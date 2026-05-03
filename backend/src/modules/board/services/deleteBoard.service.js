// import Board from "../../../DB/models/board.model.js";
// import { asyncHandler } from "../../../utilities/error/error.js";

// const deleteBoard=asyncHandler(async(req , res , next)=>{
//     const {id}=req.params;
//     const deletedBoard= await Board.findByIdAndDelete(id)
//     if (!deletedBoard) {
//     return res.status(404).json({ message: "Board not found" });
//     }
//     return res.status(200).json({
//         message: "Board deleted successfully"
//     })
// })

// export default deleteBoard;

import Board from "../../../DB/models/board.model.js"; 
import { asyncHandler } from "../../../utilities/error/error.js";
import mongoose from "mongoose";
import { getSocketInstance } from "../../Socket/socketManager.js";
const deleteBoard = asyncHandler(async (req, res, next) => {
    const io = getSocketInstance();
    const { id } = req.params;
    const userId = req.user._id; // لازم يكون جاي من auth middleware

    const board = await Board.findById(id);

    if (!board) {
        return res.status(404).json({ message: "Board not found" });
    }

    // لو هو owner
    if (board.owner.toString() === userId.toString()) {
        await Board.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Board deleted successfully (owner)"
        });
    }

    // لو هو user عادي جوه ال users array
    const isUserInBoard = board.users.some(
        (user) => user.toString() === userId.toString()
    );

    if (isUserInBoard) {
        board.users = board.users.filter(
            (user) => user.toString() !== userId.toString()
        );

        await board.save();

        return res.status(200).json({
            message: "User removed from board"
        });
    }
    
    // لو مش owner ولا موجود أصلاً
    return res.status(403).json({
        message: "You are not authorized for this action"
    });
});

export default deleteBoard;