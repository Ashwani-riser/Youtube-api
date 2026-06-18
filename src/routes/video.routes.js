import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    searchVideos,
    getTrendingVideos,
} from "../controllers/video.controller.js";

const router = Router();

router.route("/publish").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        },
    ]),
    publishVideo
);

router.route("/").get(getAllVideos);

// router.route("/:videoId").get(
//      verifyJWT,
//     getVideoById
// );

router.route("/:videoId").patch(
    verifyJWT,
    updateVideo
);

router.route("/:videoId").delete(
    verifyJWT,
    deleteVideo
);
router.patch(
    "/:videoId/toggle",
    verifyJWT,
    togglePublishStatus
);
router.get("/search", searchVideos);
router.get("/trending", getTrendingVideos);
router.route("/:videoId").get(
     verifyJWT,
    getVideoById
);
export default router;