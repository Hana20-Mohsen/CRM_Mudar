import Attendance from "../../../DB/models/attendance.model.js";
import User from "../../../DB/models/User.model.js";
import { userRoles } from "../../../middleware/auth.middleware.js";
import { asyncHandler } from "../../../utilities/error/error.js";
import { compareHash } from "../../../utilities/security/hash.security.js";
import { generateToken } from "../../../utilities/security/token.security.js";
import { getSocketInstance } from "../../Socket/socketManager.js";
const login = asyncHandler(async (req, res, next) => {
    const io = getSocketInstance();
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        return next(new Error('user not found', { cause: 404 }))
    }
  
    if (!compareHash({ plaintext: password, hashValue: user.password })) {
        return next(new Error('In-Valid login data!!', { cause: 400 }))

    }
    const token = generateToken({
        payload: { id: user._id, isloggedIn: true }
        , signature: user.role == userRoles.admin ? process.env.TOKEN_SIGNATURE_ADMIN : process.env.TOKEN_SIGNATURE, options: { expiresIn: '11h' }
    });
    io.to(user._id).emit("login", { message: "User logged in", userId: user._id });
    // io.join(user._id);
    return res.status(200).json({
        message: 'Done',
        id: user._id,
        user,
        token,
       
    })
})

export default login;
