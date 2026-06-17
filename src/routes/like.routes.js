import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    toggleLike,
    getVideoLikes,
} from "../controllers/like.controller.js";

const router = Router();

router.post(
    "/:videoId",
    verifyJWT,
    toggleLike
);

router.get(
    "/:videoId",
    getVideoLikes
);

export default router;