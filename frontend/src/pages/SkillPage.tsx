import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Skill {
  title: string;
  description: string;
  image: string;
  createdBy: string;
  _id: string;
}

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [requestedSkillId, setRequestedSkillId] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setCurrentUserId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/skills/${id}`)
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

  useEffect(() => {
    if (currentUserId) {
      axios
        .get(`http://localhost:5000/api/skills/user/${currentUserId}`)
        .then((response) => {
          setUserSkills(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user skills:", error);
        });
    }
  }, [currentUserId]);

  const handleSwap = () => {
    if (!currentUserId || !skill || !requestedSkillId) {
      return alert("User or skill data is missing.");
    }

    const swapRequestData = {
      fromUserId: currentUserId,
      toUserId: skill.createdBy,
      skillOfferedId: requestedSkillId,
      skillRequestedId: skill._id,
    };
    if (skill.createdBy === currentUserId) {
      return alert("You cannot swap your own skill.");
    }
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
        <div className="col-md-6">
          <img
            src={`http://localhost:5000/${skill.image}`}
            alt="skill image"
            className="img-fluid rounded mb-4"
          />
        </div>
        <div className="col-md-6">
          <h1 className="display-4 mb-4">{skill.title}</h1>
          <p className="lead">{skill.description}</p>
          <p className="lead">{skill._id}</p>
          <label htmlFor="requestedSkill">Select a skill to request:</label>
          <div className="form-group">
            <select
              id="requestedSkill"
              value={requestedSkillId || ""}
              onChange={(e) => setRequestedSkillId(e.target.value)}
              className="form-control"
            >
              <option value="" disabled>
                Select a skill
              </option>
              {userSkills.map((userSkill) => (
                <option key={userSkill._id} value={userSkill._id}>
                  {userSkill.title}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-warning mt-3" onClick={handleSwap}>
            Swap
          </button>
        </div>
      </div>
    </div>
  );
}
