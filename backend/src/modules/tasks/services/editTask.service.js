
import Tasks from "../../../DB/models/tasks.model.js";
import { asyncHandler } from "../../../utilities/error/error.js";
import { getSocketInstance } from "../../Socket/socketManager.js";
import fs from 'fs';
const editTask = asyncHandler(async (req, res, next) => {
  console.log(`----------------------- edit task ----------------------`);

  const io = getSocketInstance();
  // console.log(`edit task io instance : `, io);
  const { id } = req.params;
  const { title, description, linkReference, status, dueDate, priority, image } = req.body;
  const updatedData = {
    title,
    description,
    linkReference,
    status,
    dueDate,
    priority
  };

  if (image !== undefined) {
    updatedData.image = image;
  }

  if (req.file) {
    updatedData.image = req.file.filename;
  }

  const updatedTask = await Tasks.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  console.log(`Updated task: `, updatedTask);
  
  const data = JSON.parse(fs.readFileSync("data.json"));
  console.log(`data from file : `, data.boardId);
  // .to(data.boardId)
  io.emit("taskUpdated", updatedTask._id);
  return res.status(200).json({
    message: "Task updated successfully",
    updatedTask
  });
})

export default editTask;