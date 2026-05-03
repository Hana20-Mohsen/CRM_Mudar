import Board from "../../../DB/models/board.model.js";
import User from "../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utilities/error/error.js";
import { getSocketInstance } from "../../Socket/socketManager.js";
const assignUserToBoardByEmail= asyncHandler(async(req , res , next)=>{
    const io = getSocketInstance();
    const id=req.params.id;
    const {email}=req.body;
    const user= await User.findOne({email});
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    console.log(user);
    
    const board= await Board.findByIdAndUpdate(
        id,
        { $addToSet: { users: user._id } },
        { new: true }
      
    )
    if (!board) {
        return res.status(404).json({ message: "Board not found" });
    }
    

    return res.status(200).json({
        message: "User assigned to board successfully",
        board
    })
})

export default assignUserToBoardByEmail;