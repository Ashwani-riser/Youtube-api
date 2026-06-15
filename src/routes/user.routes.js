import { Router } from "express";
import {
     registerUser,
     loginUser,
     logoutUser,
     refreshAccessToken,
      updateUserAvatar,
      updateUserCoverImage,
      changeCurrentPassword,
      updateAccountDetails
 } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

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
router.post(
    "/avatar",
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);
router.post(
    "/cover-image",
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);
router.get("/current-user", verifyJWT, (req, res) => {
    return res.status(200).json({
        success: true,
        data: req.user,
    });
});

router.post(
    "/change-password",
    verifyJWT,
    changeCurrentPassword
);
router.patch(
    "/update-account",
    verifyJWT,
    updateAccountDetails
);




router.post("/logout", verifyJWT, logoutUser);



export default router;