import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true },
    description: {type: String, required: true, trim: true },
    status: {type: String, enum: ["To-Do", "In Progress", "Done"], default: "To-Do"},
    startDate: Date,
    endDate: Date,
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    priority: {type: String, enum: ["low", "medium", "high"], default: "medium"},
},  { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;