import fs from "fs";

const filePath = "project.json";

function getData() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


export function createProject(req, res) {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.send("Please fill all fields");
  }

  const projects = getData();

  const newProject = {
    id: Date.now(),
    title,
    description
  };

  projects.push(newProject);
  saveData(projects);

  res.send("Project created");
}


export function getProjects(req, res) {
  const projects = getData();
  res.json(projects);
}


export function getProject(req, res) {
  const { id } = req.params;

  const projects = getData();

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.send("Project not found");
  }

  res.json(project);
}


export function updateProject(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;

  const projects = getData();

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.send("Project not found");
  }

  if (title) project.title = title;
  if (description) project.description = description;

  saveData(projects);

  res.send("Project updated");
}


export function deleteProject(req, res) {
  const { id } = req.params;

  let projects = getData();

  const newProjects = projects.filter(p => p.id != id);

  saveData(newProjects);

  res.send("Project deleted");
}