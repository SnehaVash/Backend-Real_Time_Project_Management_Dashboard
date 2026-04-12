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

    performedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    project: {type: mongoose.Schema.Types.ObjectId, ref: "Project"},
    task: {type: mongoose.Schema.Types.ObjectId, ref: "Task"},
    description: String,
},  { timestamps : true });

const activityLog = mongoose.model('activityLog', activityLogSchema);

export default activityLog;
