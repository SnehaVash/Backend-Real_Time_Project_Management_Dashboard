import Project from "../models/Project.js";


export async function createProject(req, res) {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.send("Please fill all fields");
    }

    const newProject = await Project.create({
      title,
      description
    });

    res.status(201).json({
      message: "Project created",
      project: newProject
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}



export async function getProjects(req, res) {
  try {
    const projects = await Project.find();
    res.json(projects);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}



export async function getProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.send("Project not found");
    }

    res.json(project);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}



export async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.send("Project not found");
    }

    if (title) project.title = title;
    if (description) project.description = description;

    await project.save();

    res.send("Project updated");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}



export async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.send("Project not found");
    }

    res.send("Project deleted");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}