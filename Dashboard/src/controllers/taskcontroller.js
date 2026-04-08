import Task from "../models/Task.js";

export async function createTask(req, res) {
  try {
    const { title, status } = req.body;

    if (!title || !status) {
      return res.status(400).send("All fields are required");
    }

    const newTask = await Task.create({
      title,
      status
    });

    res.status(201).json(newTask);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export async function getTasks(req, res) {
  try {
    const tasks = await Task.find();
    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export async function getTaskById(req, res) {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    if (title) task.title = title;
    if (status) task.status = status;

    await task.save();

    res.json(task);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


export async function deleteTask(req, res) {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.send("Task deleted successfully");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}