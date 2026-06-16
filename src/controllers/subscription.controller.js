import { Subscription } from "../models/subscription.model.js";


// Toggle Subscribe / Unsubscribe
const toggleSubscription = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (req.user._id.toString() === channelId) {
            return res.status(400).json({
             success: false,
            message: "You cannot subscribe to yourself",
        });
        }
        
        const existingSubscription =
            await Subscription.findOne({
                subscriber: req.user._id,
                channel: channelId,
            });

        if (existingSubscription) {
            await Subscription.findByIdAndDelete(
                existingSubscription._id
            );

            return res.status(200).json({
                success: true,
                message: "Unsubscribed successfully",
            });
        }
      
        const subscription =
            await Subscription.create({
                subscriber: req.user._id,
                channel: channelId,
            });

        return res.status(201).json({
            success: true,
            message: "Subscribed successfully",
            data: subscription,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get Subscriber Count
const getChannelSubscribers = async (req, res) => {
    try {
        const { channelId } = req.params;

        const subscribers =
            await Subscription.countDocuments({
                channel: channelId,
            });//same channel ka kitne log subscribe hain ussa cnt karo

        return res.status(200).json({
            success: true,
            subscribers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get Subscribed Channels
const getSubscribedChannels = async (req, res) => {
    try {
        const channels =
            await Subscription.find({
                subscriber: req.user._id, //same subscriber ne kis kis channel ko subscribe kiya hai uska list lao
            }).populate(
                "channel",//it works as object id of user model and we want to populate it with username fullname avatar
                "username fullName avatar"
            );

        return res.status(200).json({
            success: true,
            data: channels,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export {
    toggleSubscription,
    getChannelSubscribers,
    getSubscribedChannels,
};