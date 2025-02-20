import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
  },
  swapRequests: [
    {
      fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      skillRequested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills",
      },
      skillOffered: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills",
      },
      status: {
        type: String,
        enum: ["pending", "approved", "declined"],
        default: "pending",
      },
    },
  ],
  sentRequests: [
    {
      toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      skillRequested: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills",
      },
      skillOffered: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills",
      },
      status: {
        type: String,
        enum: ["pending", "approved", "declined"],
        default: "pending",
      },
    },
  ],
});
export const User = new mongoose.model("User", schema);
// export const Skills = new mongoose.model("Skills", schema);
