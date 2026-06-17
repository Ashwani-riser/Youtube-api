import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { User } from "../models/user.model.js";

const publishVideo = async (req, res) => {
    try {

         console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required",
            });
        }

        const videoLocalPath = req.files?.videoFile?.[0]?.path;
        const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

        if (!videoLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Video file is required",
            });
        }

        if (!thumbnailLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Thumbnail is required",
            });
        }

        const videoFile = await uploadOnCloudinary(videoLocalPath);
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

        if (!videoFile) {
            return res.status(500).json({
                success: false,
                message: "Video upload failed",
            });
        }

        const video = await Video.create({
            title,
            description,
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            duration: videoFile.duration || 0,
            owner: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Video uploaded successfully",
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find()
            .populate("owner", "username fullName avatar")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: videos,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId)
            .populate("owner", "username fullName avatar");

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: {
                    watchHistory: videoId,
                },
            }
        );


        video.views += 1;
        await video.save();

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;//kaunsi se video delete karni hai ye params se milega

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        if (video.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await Video.findByIdAndDelete(videoId);

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description } = req.body;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }


        if (video.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        video.title = title || video.title;
        video.description = description || video.description;

        await video.save();

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const togglePublishStatus = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }
        
        if (
            video.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        video.isPublished = !video.isPublished;

        await video.save();

        return res.status(200).json({
            success: true,
            isPublished: video.isPublished,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};