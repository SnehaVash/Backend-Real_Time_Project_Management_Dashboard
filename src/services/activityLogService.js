import ActivityLog from "../models/activityLog.model.js";

export async function createLog({ action, performedBy, project, task, description }) {
    const log = await ActivityLog.create({
        action,
        performedBy,
        project,
        task,
        description
    });
    return log;
}


export async function getProjectLogs(projectId) {
    const logs = await ActivityLog.find({ project: projectId })
        .populate("performedBy", "name email")
        .sort({ createdAt: -1 });
    return logs;
}