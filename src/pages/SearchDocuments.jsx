import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SearchDocuments = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    major_head: "",
    minor_head: "",
    from_date: "",
    to_date: "",
    tags: [],
    uploaded_by: "",
    start: 0,
    length: 10,
    filterId: "",
    search: { value: "" },
  });
  const [documents, setDocuments] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .post(
        "https://apis.allsoft.co/api/documentManagement/documentTags",
        { term: "" },
        { headers: { token } }
      )
      .then((res) => setAllTags(res.data?.tags || []));
  }, [token]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://apis.allsoft.co/api/documentManagement/searchDocumentEntry",
        filters,
        { headers: { token } }
      );
      setDocuments(res.data?.data || []);
    } catch {
      setDocuments([]);
    }
    setLoading(false);
  };

  return (
    <div>
       <div className="bg-white fixed  shadow p-4 flex items-center">
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
      <div className="bg-white fixed shadow p-4 flex items-center">
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
      <div className="min-h-screen bg-gray-100 p-4">
        <form
          className="bg-white p-6 rounded shadow max-w-3xl mx-auto mb-8"
          onSubmit={handleSearch}
        >
          <h2 className="text-xl font-bold mb-4">Search Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Search"
              value={filters.search.value}
              onChange={(e) =>
                setFilters({ ...filters, search: { value: e.target.value } })
              }
            />
            <input
              type="date"
              className="border p-2 rounded"
              placeholder="From Date"
              value={filters.from_date}
              onChange={(e) =>
                setFilters({ ...filters, from_date: e.target.value })
              }
            />
            <input
              type="date"
              className="border p-2 rounded"
              placeholder="To Date"
              value={filters.to_date}
              onChange={(e) =>
                setFilters({ ...filters, to_date: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Uploaded By"
              value={filters.uploaded_by}
              onChange={(e) =>
                setFilters({ ...filters, uploaded_by: e.target.value })
              }
            />
          </div>
          <div className="mt-4">
            <label className="block mb-1">Tags</label>
            <select
              multiple
              className="border p-2 rounded w-full"
              value={filters.tags.map((t) => t.tag_name)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(
                  (opt) => ({
                    tag_name: opt.value,
                  })
                );
                setFilters({ ...filters, tags: selected });
              }}
            >
              {allTags.map((tag) => (
                <option key={tag.tag_name} value={tag.tag_name}>
                  {tag.tag_name}
                </option>
              ))}
            </select>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-bold mb-4">Results</h3>
          <div className="bg-white rounded shadow">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Major Head</th>
                  <th className="p-2 border">Minor Head</th>
                  <th className="p-2 border">Remarks</th>
                  <th className="p-2 border">Preview</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="p-2 border">{doc.document_date}</td>
                    <td className="p-2 border">{doc.major_head}</td>
                    <td className="p-2 border">{doc.minor_head}</td>
                    <td className="p-2 border">{doc.document_remarks}</td>
                    <td className="p-2 border">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => navigate(`/preview/${doc.id}`)}
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
                {!documents.length && (
                  <tr>
                    <td colSpan={5} className="p-2 text-center">
                      No documents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default SearchDocuments;
