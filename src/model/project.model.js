import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {type: String, enum: ["active", "completed", "inactive"], default: "active"},
    startDate: Date,
    endDate: Date,
    createdAT: {type: Date, default: Date.now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    updatedAt: {type: Date, default: Date.now},
    priority: {type: String, enum: ["low", "medium", "high"], default: "medium"},
});

const project = mongoose.model('project', projectSchema);

export default project;