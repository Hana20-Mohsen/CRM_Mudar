import Tasks from "../../../DB/models/tasks.model.js";
import { asyncHandler } from "../../../utilities/error/error.js";
import {getIo} from '../../Socket/index.js';
const editTask = asyncHandler(async (req, res, next) => {
  const io = getIo();
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
  io.to(updatedTask.boardId).emit("taskUpdated", updatedTask);
  return res.status(200).json({
    message: "Task updated successfully",
    updatedTask
  });
})

export default editTask;