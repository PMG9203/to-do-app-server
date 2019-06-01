const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/toDo_app", {
  useNewUrlParser: true
});

const Task = mongoose.model("Task", {
  name: String,
  done: Boolean
});

// CREATE

app.post("/create", async (req, res) => {
  if (req.body.name) {
    const task = new Task({ name: req.body.name, done: req.body.done });

    try {
      await task.save();
      return res.json(req.body);
      // return res.json("Task created");
    } catch (error) {
      return res.status(400).json({ message: "An error occured" });
    }
  } else {
    res.status(400).json("Task is missing");
  }
});

// UPDATE
app.post("/update-Task", async (req, res) => {
  try {
    //obtenir le Bon To DO
    const task = await Task.findOne({ _id: req.body.id });
    // modifier le To DO
    task.name = req.body.name;
    task.done = req.body.done;
    // sauvegarder le To DO modifié
    await task.save();
    return res.json(task);
  } catch (error) {
    return res.status(400).json({ message: " An error occured" });
  }
});

// DELETE
app.post("/delete-Task", async (req, res) => {
  try {
    // 1. Obtenir le student
    const task = await Task.findOne({ _id: req.query.id });

    // 2. On supprime
    await task.remove();
    return res.json(tasq);
  } catch (error) {
    return res.status(400).json({ message: "An error occurred" });
  }
});

// READ
app.get("/", async (req, res) => {
  try {
    // FIND EST ASYNCHRONE
    const tasks = await Task.find();
    return res.json(tasks);
  } catch (error) {
    return res.status(400).json({ message: "An error occurred" });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(3000, () => {
  console.log("server started");
});
