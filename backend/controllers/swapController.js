import { User } from "../models/User.js";
import { Skills } from "../models/Skills.js";

export const createSwapRequest = async (req, res) => {
  const { fromUserId, toUserId, skillOfferedId, skillRequestedId } = req.body;

  try {
    // Validate users and skills
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    const skillOffered = await Skills.findById(skillOfferedId);
    const skillRequested = await Skills.findById(skillRequestedId);

    if (!fromUser || !toUser || !skillOffered || !skillRequested) {
      return res
        .status(404)
        .json({ message: "Invalid users or skills provided." });
    }

    // Add request to toUser's swapRequests
    toUser.swapRequests.push({
      fromUser: fromUserId,
      skillRequested: skillRequestedId,
      skillOffered: skillOfferedId,
    });

    // Add request to fromUser's sentRequests
    fromUser.sentRequests.push({
      toUser: toUserId,
      skillRequested: skillRequestedId,
      skillOffered: skillOfferedId,
    });

    await toUser.save();
    await fromUser.save();

    res.status(201).json({ message: "Swap request created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept Swap Request
export const acceptSwapRequest = async (req, res) => {
  const { userId, requestId } = req.body;

  try {
    // Find the toUser
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const request = user.swapRequests.id(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Update the request status to "approved"
    request.status = "approved";
    await user.save();

    // Find the fromUser and update their sentRequests
    const fromUser = await User.findById(request.fromUser);
    const sentRequest = fromUser.sentRequests.find(
      (req) =>
        req.toUser.toString() === userId.toString() &&
        req.skillRequested.toString() === request.skillRequested.toString() &&
        req.skillOffered.toString() === request.skillOffered.toString()
    );

    if (sentRequest) {
      sentRequest.status = "approved";
      await fromUser.save();
    }

    res.status(200).json({ message: "Swap request accepted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Decline Swap Request
export const declineSwapRequest = async (req, res) => {
  const { userId, requestId } = req.body;

  try {
    // Find the toUser
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const request = user.swapRequests.id(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    // Update the request status to "declined"
    request.status = "declined";
    await user.save();

    // Find the fromUser and update their sentRequests
    const fromUser = await User.findById(request.fromUser);
    const sentRequest = fromUser.sentRequests.find(
      (req) =>
        req.toUser.toString() === userId.toString() &&
        req.skillRequested.toString() === request.skillRequested.toString() &&
        req.skillOffered.toString() === request.skillOffered.toString()
    );

    if (sentRequest) {
      sentRequest.status = "declined";
      await fromUser.save();
    }

    res.status(200).json({ message: "Swap request declined successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
