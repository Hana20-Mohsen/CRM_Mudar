import Board from "../../../DB/models/board.model.js";
import { asyncHandler } from "../../../utilities/error/error.js";

const getBoardByOwnerId=asyncHandler(async(req , res , next)=>{
    const userId=req.user._id;
    const boards = await Board.find({
  $or: [
    { owner: userId },
    { users: userId }
  ]
});
    
    if(boards.length===0){
        return res.status(404).json({message:'no boards found'})
    }
    return res.status(200).json({
        message:'boards retrieved successfully',
        boards
    })
})

export default getBoardByOwnerId