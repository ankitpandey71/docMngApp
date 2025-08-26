import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">Document Management Dashboard</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          className="bg-blue-500 text-white p-6 rounded shadow hover:bg-blue-600"
          onClick={() => navigate("/upload")}
        >
          Upload Document
        </button>
        <button
          className="bg-green-500 text-white p-6 rounded shadow hover:bg-green-600"
          onClick={() => navigate("/search")}
        >
          Search Documents
        </button>
      </div>
    </div>
  );
};

export default Dashboard;