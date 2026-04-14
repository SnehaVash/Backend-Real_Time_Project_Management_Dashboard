import * as activityLogService from "../services/activityLogService.js";
import { successResponse } from "../utils/helpers.js";

export async function getProjectLogs(req, res, next) {
    try {
        const logs = await activityLogService.getProjectLogs(req.params.id);
        return successResponse(res, 200, "Activity logs fetched", { logs });
    } catch (error) {
        next(error);
    }
}