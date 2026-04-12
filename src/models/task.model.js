import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true },
    description: String,
    status: {type: String, enum: ["pending", "in-progress", "completed"], default: "pending"},
    priority: {type: String, enum: ["low", "medium", "high"], default: "medium"},
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true},
    assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    dueDate: Date,
    attachments: [String]
},  { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
