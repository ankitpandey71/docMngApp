import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const names = ["John", "Tom", "Emily"];
const departments = ["Accounts", "HR", "IT", "Finance"];

const UploadDocument = () => {
  const { token } = useAuth();
  const [majorHead, setMajorHead] = useState("Personal");
  const [minorHead, setMinorHead] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch tags from API
    axios
      .post(
        "https://apis.allsoft.co/api/documentManagement/documentTags",
        { term: "" },
        { headers: { token } }
      )
      .then((res) => {
        setAllTags(res.data?.tags || []);
      });
  }, [token]);

  const handleTagAdd = (tag) => {
    if (!tags.find((t) => t.tag_name === tag)) {
      setTags([...tags, { tag_name: tag }]);
      if (!allTags.find((t) => t.tag_name === tag)) {
        setAllTags([...allTags, { tag_name: tag }]);
        // Optionally send new tag to API here
      }
    }
    setTagInput("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("File is required");
      return;
    }
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setMessage("Only Image and PDF files are allowed");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "data",
      JSON.stringify({
        major_head: majorHead,
        minor_head: minorHead,
        document_date: date,
        document_remarks: remarks,
        tags,
        user_id: "user", // replace with actual user id if available
      })
    );

    try {
      await axios.post(
        "https://apis.allsoft.co/api/documentManagement/saveDocumentEntry",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token,
          },
        }
      );
      setMessage("Document uploaded successfully!");
    } catch {
      setMessage("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        className="bg-white p-8 rounded shadow w-full max-w-lg space-y-4"
        onSubmit={handleUpload}
      >
        <h2 className="text-xl font-bold mb-2">Upload Document</h2>
        <div>
          <label className="block mb-1">Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Category</label>
          <select
            className="w-full border p-2 rounded"
            value={majorHead}
            onChange={(e) => {
              setMajorHead(e.target.value);
              setMinorHead("");
            }}
          >
            <option value="Personal">Personal</option>
            <option value="Professional">Professional</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">{majorHead === "Personal" ? "Name" : "Department"}</label>
          <select
            className="w-full border p-2 rounded"
            value={minorHead}
            onChange={(e) => setMinorHead(e.target.value)}
            required
          >
            <option value="">Select</option>
            {(majorHead === "Personal" ? names : departments).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag.tag_name}
                className="bg-blue-100 px-2 py-1 rounded-full flex items-center"
              >
                {tag.tag_name}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t.tag_name !== tag.tag_name))}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            className="border p-2 rounded w-2/3 mr-2"
            placeholder="Add tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            list="tags-list"
          />
          <datalist id="tags-list">
            {allTags.map((tag) => (
              <option key={tag.tag_name} value={tag.tag_name} />
            ))}
          </datalist>
          <button
            type="button"
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => tagInput && handleTagAdd(tagInput)}
          >
            Add
          </button>
        </div>
        <div>
          <label className="block mb-1">Remarks</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">File (Image/PDF)</label>
          <input
            type="file"
            className="w-full border p-2 rounded"
            accept="image/png, image/jpeg, application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Upload
        </button>
        {message && <div className="text-center text-green-600 mt-2">{message}</div>}
      </form>
    </div>
  );
};

export default UploadDocument;