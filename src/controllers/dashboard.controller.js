import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";

const getChannelStats = async (req, res) => {
    try {

        const totalVideos = await Video.countDocuments({
            owner: req.user._id,
        });

        const videos = await Video.find({
            owner: req.user._id,
        });

        let totalViews = 0;

        videos.forEach((video) => {
            totalViews += video.views;
        });

        const totalSubscribers =
            await Subscription.countDocuments({
                channel: req.user._id,
            });

        const videoIds = videos.map(
            (video) => video._id
        );

        const totalLikes =
            await Like.countDocuments({
                video: {
                    $in: videoIds,
                },
            });

        return res.status(200).json({
            success: true,
            data: {
                totalVideos,
                totalViews,
                totalSubscribers,
                totalLikes,
            },
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};
export {
    getChannelStats,
};