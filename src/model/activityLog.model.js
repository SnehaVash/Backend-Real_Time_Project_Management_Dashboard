import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    action: {type: String,
        enum: ["task_created",
            "task_updated",
            "task_deleted",
            "project_created",
            "project_updated",
            "project_deleted",
            "member_registered",
            "member_added",
            "member_removed"
        ],
        required: true,
    },

    performedBy: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    projectId: {type: mongoose.Schema.Types.ObjectId, ref: "project"},
    taskId: {type: mongoose.Schema.Types.ObjectId, ref: "task"},
    createdAt: {type: Date, default: Date.now},
    description: String,
});

const activityLog = mongoose.model('activityLog', activityLogSchema);

export default activityLog;
