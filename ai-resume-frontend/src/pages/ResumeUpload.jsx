import { useState } from "react";
import API from "../services/api";

function ResumeUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/api/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Resume Uploaded Successfully!");
    } catch (error) {
      alert("Upload Failed");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>Upload Resume</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default ResumeUpload;