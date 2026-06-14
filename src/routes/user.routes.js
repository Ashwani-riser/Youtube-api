import { Router } from "express";
import { registerUser ,loginUser,logoutUser,refreshAccessToken} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.route("/register").post((req, res) => {
//      res.status(200).json({
//         success: true,
//         message: "Register Route Working",
//     });
// });
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/current-user", verifyJWT, (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user,
    });
});
router.post("/logout", verifyJWT, logoutUser);



export default router;