import Tasks from "../../../DB/models/tasks.model.js";
import User from "../../../DB/models/User.model.js";
import Lead from "../../../DB/models/Lead.model.js";
import Deal from "../../../DB/models/deal.model.js";
import { asyncHandler } from "../../../utilities/error/error.js";

const getDashboardData=asyncHandler(async(req , res , next)=>{
    const tasks = await Tasks.aggregate([
    { $group: { _id: "$priority", count: { $sum: 1 } } }
  ]);
  const users = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]);
  const leads = await Lead.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
   const deals = await Deal.aggregate([
    { $group: { _id: "$stage", count: { $sum: 1 } } }
  ]);

    return res.status(200).json({
        status:'success',
        message:'dashboard data retrieved successfully',
        tasks,
        users,
        leads,
    deals
    })
})

export default getDashboardData