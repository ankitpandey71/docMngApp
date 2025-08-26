import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGenerateOTP = async () => {
    try {
      await axios.post("https://apis.allsoft.co/api/documentManagement/generateOTP", {
        mobile_number: mobile,
      });
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP");
    }
  };

  const handleLogin = async () => {
    try {
      await login(mobile, otp);
      navigate("/");
    } catch (err) {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {step === 1 && (
          <>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={handleGenerateOTP}
            >
              Generate OTP
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              className="w-full mb-4 p-2 border rounded"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={handleLogin}
            >
              Login
            </button>
          </>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;