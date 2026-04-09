import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {type: String, enum: ["pending", "in-progress", "completed"], default: "pending"},
    priority: {type: String, enum: ["low", "medium", "high"], default: "medium"},
    project_id: {type: mongoose.Schema.Types.ObjectId, ref: "project"},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "user"},
    dueDate: Date,
    attachments: [String]
});

const task = mongoose.model('task', taskSchema);

export default task;
