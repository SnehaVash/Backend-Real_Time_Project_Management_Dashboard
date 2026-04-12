import * as projectService from "../services/projectService.js";
import { successResponse, errorResponse } from "../utils/helpers.js";

export async function createProject(req, res, next) {
  try {
    const { title, description, priority, startDate, endDate } = req.body;

    if (!title || !description) {
      return errorResponse(res, 400, "Please fill all fields");
    }

    const allowedPriorities = ["low", "medium", "high"];
    if (priority && !allowedPriorities.includes(priority)) {
      return errorResponse(res, 400, "Invalid priority value");
    }

    const project = await projectService.createProject(
      { title, description, priority, startDate, endDate },
      req.user._id
    );

    return successResponse(res, 201, "Project created", { project });

  } catch (error) {
    next(error);
  }
}

export async function getProjects(req, res, next) {
  try {
    const projects = await projectService.getAllProjects(req.user._id);
    return successResponse(res, 200, "Projects fetched", { projects });

  } catch (error) {
    next(error);
  }
}

export async function getProject(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.params.id);

    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    const isOwner = project.createdBy._id.toString() === req.user._id.toString();

    if (!isMember && !isOwner) {
      return errorResponse(res, 403, "Access denied");
    }

    return successResponse(res, 200, "Project fetched", { project });

  } catch (error) {
    next(error);
  }
}

export async function updateProject(req, res, next) {
  try {
    const { title, description, priority, status, startDate, endDate } = req.body;

    const allowedPriorities = ["low", "medium", "high"];
    if (priority && !allowedPriorities.includes(priority)) {
      return errorResponse(res, 400, "Invalid priority value");
    }

    const project = await projectService.updateProject(
      req.params.id,
      { title, description, priority, status, startDate, endDate }
    );

    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    return successResponse(res, 200, "Project updated", { project });

  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
  try {
    await projectService.deleteProject(req.params.id);
    return successResponse(res, 200, "Project and related tasks deleted");

  } catch (error) {
    next(error);
  }
}

export async function addMember(req, res, next) {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return errorResponse(res, 400, "Member id is required");
    }

    const project = await projectService.addMember(req.params.id, memberId);

    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    return successResponse(res, 200, "Member added successfully", { project });

  } catch (error) {
    next(error);
  }
}

export async function removeMember(req, res, next) {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return errorResponse(res, 400, "Member id is required");
    }

    const project = await projectService.removeMember(req.params.id, memberId);

    if (!project) {
      return errorResponse(res, 404, "Project not found");
    }

    return successResponse(res, 200, "Member removed successfully", { project });

  } catch (error) {
    next(error);
  }
}