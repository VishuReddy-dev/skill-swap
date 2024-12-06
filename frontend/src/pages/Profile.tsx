import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import SkillCard from "../components/SkillCard";
import Requests from "../components/Request";
import SentRequests from "../components/SentRequests";
const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(true); // Loading state for user data
  const [loadingSkills, setLoadingSkills] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Fetch user data by ID from the API
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage after login
        if (!token) {
          setError("No token found, please log in");
          setLoadingUser(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the request header
            },
          }
        );
        setUser(response.data);
        console.log(user);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching user data");
      } finally {
        setLoadingUser(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);
  useEffect(() => {
    const fetchSkills = async () => {
      if (user) {
        // Only fetch skills once the user data is available
        setLoadingSkills(true);
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("No token found, please log in");
            setLoadingSkills(false);
            return;
          }

          // Fetch skills created by the user
          const skillsResponse = await axios.get(
            `http://localhost:5000/api/skills/user/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Ensure skills are an array before setting state
          setSkills(
            Array.isArray(skillsResponse.data) ? skillsResponse.data : []
          );
        } catch (err: any) {
          setError(err.response?.data?.message || "Error fetching skills");
        } finally {
          setLoadingSkills(false);
        }
      }
    };

    fetchSkills();
  }, [id, user]);

  if (loadingUser || loadingSkills) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleCreateSkill = () => {
    navigate("/createSkill");
  };

  return (
    <div className="container py-5 ">
      <div className="profile-header">
        <h3 className="text-muted">Profile</h3>
      </div>
      <div className="profile-content mb-5">
        <h2 className="display-1">{user?.name}</h2>
        <p className="lead">{user?.email}</p>
        {/* Add any other user details you need */}
        <button className="btn btn-primary" onClick={handleCreateSkill}>
          Add skills
        </button>
      </div>
      <div className="skills-section container">
        <h3 className="text-muted">Skills Created by {user?.name}</h3>
        {skills.length > 0 ? (
          <div className="row">
            {skills.map((skill, index) => (
              <SkillCard
                id={skill._id}
                key={index}
                title={skill.title}
                description={skill.description}
                image={skill.image}
              />
            ))}
          </div>
        ) : (
          <p>No skills found for this user.</p>
        )}
      </div>
      <div className="container">
        <Requests swapRequests={user?.swapRequests} />
        <SentRequests sentRequests={user?.sentRequests} />
      </div>
    </div>
  );
};

export default Profile;
