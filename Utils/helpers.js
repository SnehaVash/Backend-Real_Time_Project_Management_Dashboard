export function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}


export function getRelativeTime(date) {
    const now = new Date();
    const target = new Date(date);
    const diffMs = target - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1) return Due in ${diffDays} days;
    if (diffDays < -1) return ${Math.abs(diffDays)} days ago;
}


export function paginate(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return { skip, limit: parseInt(limit) };
}


export function successResponse(res, statusCode = 200, message, data = {}) {
    return res.status(statusCode).json({
        message,
        ...data
    });
}


export function errorResponse(res, statusCode = 400, message) {
    return res.status(statusCode).json({
        message
    });
}