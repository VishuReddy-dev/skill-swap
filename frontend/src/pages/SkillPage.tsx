import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

interface Skill {
  title: string;
  description: string;
  image: string;
  createdBy: string; // The user who created the skill (the toUser)
  _id: string; // Skill ID
}

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>(); // Get the skill ID from the URL
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // To store the current user ID
  const [requestedSkillId, setRequestedSkillId] = useState<string | null>(null); // For the skill the user wants to request

  // Fetch current user ID from the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the JWT token from localStorage
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decode the JWT token
        setCurrentUserId(decodedToken.id); // Extract userId from the decoded token
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  console.log(currentUserId);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/skills/${id}`) // Fetch the skill based on ID
        .then((response) => {
          setSkill(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching skill:", error);
          setLoading(false);
        });
    }
  }, [id]);
  console.log(skill);

  // Handle the swap request
  const handleSwap = () => {
    if (!currentUserId || !skill || !requestedSkillId) {
      return alert("User or skill data is missing.");
    }

    const swapRequestData = {
      fromUserId: currentUserId,
      toUserId: skill.createdBy, // The toUser is identified by the createdBy field of the skill
      skillOfferedId: requestedSkillId, // The skill the user is offering (current skill)
      skillRequestedId: skill._id, // The skill the user is requesting (this should be a different skill)
    };

    axios
      .post("http://localhost:5000/api/swaps/request", swapRequestData)
      .then((response) => {
        alert("Swap request created successfully!");
      })
      .catch((error) => {
        console.error("Error creating swap request:", error);
        alert("Failed to create swap request.");
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!skill) {
    return <p>Skill not found</p>;
  }

  return (
    <div className="container skill-detail-page">
      <div className="row">
        {/* Image Section */}
        <div className="col-md-6">
          <img
            src={`http://localhost:5000/${skill.image}`}
            alt="skill image"
            className="img-fluid rounded mb-4"
          />
        </div>

        {/* Skill Details Section */}
        <div className="col-md-6">
          <h1 className="display-4 mb-4">{skill.title}</h1>
          <p className="lead">{skill.description}</p>

          {/* Dropdown or input to select the requested skill */}
          <label htmlFor="requestedSkill">Select a skill to request:</label>
          <div className="form-group">
            <input
              type="text"
              id="requestedSkill"
              value={requestedSkillId || ""}
              onChange={(e) => setRequestedSkillId(e.target.value)} // This can be a dropdown of available skills
              placeholder="Enter the ID of the skill you want"
              className="form-control"
            />
          </div>

          <button className="btn btn-warning mt-3" onClick={handleSwap}>
            Swap
          </button>
        </div>
      </div>
    </div>
  );
}
