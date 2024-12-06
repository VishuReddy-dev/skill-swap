import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
interface SwapRequest {
  _id: string;
  fromUser: string; // Correctly using string
  skillRequested: string; // Correctly using string
  skillOffered: string; // Correctly using string
  status: string;
}

interface Props {
  swapRequests: SwapRequest[];
}

const Request: React.FC<Props> = ({ swapRequests }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwtDecode(token); // Decode the token
      return decodedToken.id; // Adjust according to your token structure
    }
    return null;
  };

  // Function to handle accepting a swap request
  const handleAccept = async (requestId: string) => {
    const userId = getUserIdFromToken(); // Get userId from token
    if (!userId) {
      alert("User ID not found.");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:5000/api/swaps/accept",
        {
          userId,
          requestId,
        }
      );
      alert(response.data.message);
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: "approved" } : req
        )
      );
      // Optionally refresh or update the requests state here
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request.");
    }
  };

  // Function to handle declining a swap request
  const handleDecline = async (requestId: string) => {
    const userId = getUserIdFromToken(); // Get userId from token
    if (!userId) {
      alert("User ID not found.");
      return;
    }
    try {
      const response = await axios.put(
        "http://localhost:5000/api/swaps/decline",
        {
          userId,
          requestId,
        }
      );
      alert(response.data.message);
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: "declined" } : req
        )
      );
      // Optionally refresh or update the requests state here
    } catch (err) {
      console.error("Error declining request:", err);
      alert("Failed to decline request.");
    }
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

  const processSwapRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const enrichedRequests = await Promise.all(
        swapRequests.map(async (swapRequest) => {
          const fromUserName = await fetchUserName(swapRequest.fromUser, token);
          const requestedSkillTitle = await fetchSkillTitle(
            swapRequest.skillRequested
          );
          const offeredSkillTitle = await fetchSkillTitle(
            swapRequest.skillOffered
          );
          return {
            _id: swapRequest._id,
            fromUserName,
            requestedSkillTitle,
            offeredSkillTitle,
            status: swapRequest.status,
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
    processSwapRequests();
  }, [swapRequests]);
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
      <h1>Swap Requests</h1>
      {requests.length > 0 ? (
        requests.map((request, index) => (
          <ul key={index} className="list-group">
            <li className="list-group-item">
              <strong>From User:</strong> {request.fromUserName}
            </li>
            <li className="list-group-item">
              <strong>Requested Skill:</strong> {request.requestedSkillTitle}
            </li>
            <li className="list-group-item">
              <strong>Offered Skill:</strong> {request.offeredSkillTitle}
            </li>
            <li className="list-group-item">
              <strong>Status:</strong>{" "}
              <span className={getStatusBadgeClass(request.status)}>
                {request.status}
              </span>
            </li>

            {/* Conditionally render buttons based on status */}
            {request.status !== "approved" && request.status !== "declined" && (
              <div
                style={{ display: "flex", gap: "10px" }}
                className="mt-4 mb-4"
              >
                <button
                  className="btn btn-success"
                  style={{ maxWidth: "100px", width: "100%" }}
                  onClick={() => handleAccept(request._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  style={{ maxWidth: "100px", width: "100%" }}
                  onClick={() => handleDecline(request._id)}
                >
                  Reject
                </button>
              </div>
            )}
          </ul>
        ))
      ) : (
        <p>No swap requests available.</p> // Message when there are no requests
      )}
    </div>
  );
};

export default Request;
