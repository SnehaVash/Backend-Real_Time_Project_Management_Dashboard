import fs from "fs";

const filePath = "task.json";


function readTasks() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
}


function writeTasks(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}



export function createTask(req, res) {
  try {
    const { title, status } = req.body;

    if (!title || !status) {
      return res.status(400).send("All fields are required");
    }

    const tasks = readTasks();

    const newTask = {
      id: Date.now(),
      title,
      status   
    };

    tasks.push(newTask);
    writeTasks(tasks);

    res.status(201).json(newTask);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export function getTasks(req, res) {
  try {
    const tasks = readTasks();
    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const tasks = readTasks();
    const task = tasks.find(t => t.id == id);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}



export function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    let tasks = readTasks();

    const index = tasks.findIndex(t => t.id == id);

    if (index === -1) {
      return res.status(404).send("Task not found");
    }

    if (title) tasks[index].title = title;
    if (status) tasks[index].status = status;

    writeTasks(tasks);

    res.json(tasks[index]);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export function deleteTask(req, res) {
  try {
    const { id } = req.params;

    let tasks = readTasks();

    const newTasks = tasks.filter(t => t.id != id);

    if (tasks.length === newTasks.length) {
      return res.status(404).send("Task not found");
    }

    writeTasks(newTasks);

    res.send("Task deleted successfully");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}