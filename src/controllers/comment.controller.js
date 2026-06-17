import { Comment } from "../models/comment.model.js";

// Add Comment
const addComment = async (req, res) => {
    try {
        const { videoId } = req.params; //url sa data larha hai
        const { content } = req.body;

        const comment = await Comment.create({
            content,
            video: videoId,
            owner: req.user._id,
        });

        return res.status(201).json({
            success: true,
            data: comment,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Video Comments
const getVideoComments = async (req, res) => {
    try {
        const { videoId } = req.params;

        const comments = await Comment.find({
            video: videoId,
        })
            .populate(
                "owner",
                "username fullName avatar"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: comments,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Comment
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (
            comment.owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        comment.content = content;

        await comment.save();

        return res.status(200).json({
            success: true,
            data: comment,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        const video = await Video.findById(comment.video);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        if (
            comment.owner.toString() !==
            req.user._id.toString() &&  video.owner.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment,
};