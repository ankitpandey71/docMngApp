import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const PreviewDocument = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // You should replace this with actual document detail API if available
    axios
      .post(
        "https://apis.allsoft.co/api/documentManagement/searchDocumentEntry",
        { search: { value: id } }, // assuming id is searchable
        { headers: { token } }
      )
      .then((res) => {
        setDoc(res.data?.data?.[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!doc) return <div className="p-8 text-center">Document not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Document Preview</h2>
        <div className="mb-2">
          <b>Date:</b> {doc.document_date}
        </div>
        <div className="mb-2">
          <b>Category:</b> {doc.major_head}
        </div>
        <div className="mb-2">
          <b>{doc.major_head === "Personal" ? "Name" : "Department"}:</b> {doc.minor_head}
        </div>
        <div className="mb-2">
          <b>Remarks:</b> {doc.document_remarks}
        </div>
        <div className="mb-2">
          <b>Tags:</b> {doc.tags?.map((t) => t.tag_name).join(", ")}
        </div>
        <div className="my-4">
          <b>File:</b>
          {doc.file_url?.endsWith(".pdf") ? (
            <iframe
              src={doc.file_url}
              title="PDF Preview"
              className="w-full h-96 mt-2 border"
            />
          ) : (
            <img
              src={doc.file_url}
              alt="Document"
              className="mt-2 w-full max-h-96 object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewDocument;