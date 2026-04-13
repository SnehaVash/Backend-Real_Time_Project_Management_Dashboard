import express from "express";

import authRoutes from "./routes/authroutes.js";
import projectRoutes from "./routes/projectroutes.js";
import taskRoutes from "./routes/taskroutes.js";

const app = express();
const PORT = 5000;


app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});