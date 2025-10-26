// src/components/PropertyImageUpload.jsx
import React, { useState } from "react";
import api from "../services/apiService";

const PropertyImageUpload = ({ propertyId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first!");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      const response = await api.post(`/properties/${propertyId}/upload-image/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadSuccess(response.data);
      setSelectedFile(null);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        {loading ? "Uploading..." : "Upload Property Image"}
      </button>
    </div>
  );
};

export default PropertyImageUpload;
