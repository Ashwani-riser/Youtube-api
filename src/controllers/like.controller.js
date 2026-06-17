import { Like } from "../models/like.model.js";

const toggleLike = async (req, res) => {
    try {
        const { videoId } = req.params;

        const existingLike = await Like.findOne({
            video: videoId,
            likedBy: req.user._id,
        });

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);

            return res.status(200).json({
                success: true,
                message: "Like removed",
            });
        }

        const like = await Like.create({
            video: videoId,
            likedBy: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Video liked",
            data: like,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getVideoLikes = async (req, res) => {
    try {
        const { videoId } = req.params;

        const likes = await Like.countDocuments({
            video: videoId,
        });

        return res.status(200).json({
            success: true,
            likes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export {
    toggleLike,
    getVideoLikes,
};