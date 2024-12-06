import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function CreateSkill() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: {
    target: { name: any; value: any; files: any };
  }) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // Handle file input for "image"
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title || ""); // Ensure title is not null
    data.append("description", formData.description || ""); // Ensure description is not null
    if (formData.image) {
      data.append("image", formData.image); // Only append if image exists
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/skills",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token if required for authentication
          },
        }
      );
      setMessage(response.data.message);
      alert("Skill created successfully!");
      navigate("/");
      setFormData({ title: "", description: "", image: null }); // Reset form
    } catch (error) {
      setMessage("An error occurred");
      alert("Failed to create skill. Please try again.");
    }
  };
  return (
    <form className="container" onSubmit={handleSubmit}>
      <h3 className="title display-5 fe-bold">Add New Skill</h3>
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          className="form-control"
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="image">Skill Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        Add
      </button>
    </form>
  );
}
