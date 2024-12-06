import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure this import is correct

interface SentRequest {
  toUser: string; // Assuming toUser is an object with $oid
  skillRequested: string; // Assuming skillRequested is an object with $oid
  skillOffered: string; // Assuming skillOffered is an object with $oid
  status: string;
  _id: string; // Assuming each request has an _id field
}

interface Props {
  sentRequests: SentRequest[];
}

const SentRequests: React.FC<Props> = ({ sentRequests = [] }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState<string>("");

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwtDecode(token); // Decode the token
      return decodedToken.userId; // Adjust according to your token structure
    }
    return null;
  };

  const fetchUserName = async (userId: string, token: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.name;
    } catch (err) {
      console.error("Error fetching user name:", err);
      return "Unknown User";
    }
  };

  const fetchSkillTitle = async (skillId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/skills/${skillId}`
      );
      return response.data.title;
    } catch (err) {
      console.error("Error fetching skill title:", err);
      return "Unknown Skill";
    }
  };

  const processsentRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const enrichedRequests = await Promise.all(
        sentRequests.map(async (SentRequest) => {
          const toUserName = await fetchUserName(SentRequest.toUser, token);
          const requestedSkillTitle = await fetchSkillTitle(
            SentRequest.skillRequested
          );
          const offeredSkillTitle = await fetchSkillTitle(
            SentRequest.skillOffered
          );
          return {
            toUserName,
            requestedSkillTitle,
            offeredSkillTitle,
            status: SentRequest.status,
          };
        })
      );

      setRequests(enrichedRequests);
    } catch (err) {
      console.error("Error processing swap requests:", err);
      setError("Failed to process swap requests. Please try again.");
    }
  };

  useEffect(() => {
    processsentRequests();
  }, [sentRequests]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "badge bg-success";
      case "pending":
        return "badge bg-warning";
      case "declined":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };
  return (
    <div>
      {error && <p>{error}</p>}
      <h1>Sent Requests</h1>
      {requests.length > 0 ? (
        requests.map((request, index) => (
          <ul key={index} className="list-group">
            <li className="list-group-item">
              <strong>To User:</strong> {request.toUserName}
            </li>
            <li className="list-group-item">
              <strong>Requested Skill:</strong> {request.requestedSkillTitle}
            </li>
            <li className="list-group-item">
              <strong>Offered Skill:</strong> {request.offeredSkillTitle}
            </li>
            <li className="list-group-item">
              <strong>Status: </strong>
              <span className={getStatusBadgeClass(request.status)}>
                {request.status}
              </span>
            </li>
          </ul>
        ))
      ) : (
        <p>No sent requests available.</p>
      )}
    </div>
  );
};

export default SentRequests;
