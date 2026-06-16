import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    toggleSubscription,
    getChannelSubscribers,
    getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = Router();

router.post(
    "/:channelId",
    verifyJWT,
    toggleSubscription
);

router.get(
    "/:channelId/subscribers",
    getChannelSubscribers
);

router.get(
    "/subscribed/channels",
    verifyJWT,
    getSubscribedChannels
);

export default router;