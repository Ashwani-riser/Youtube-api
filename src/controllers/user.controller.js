import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../config/cloudinary.js";


const registerUser = async (req, res) => {
    // POST /register
//       |
//       v
// req.body
//       |
//       v
// Empty field check
//       |
//       v
// User already exists?
//       |
//    Yes ---> 409 Error
//       |
//       No
//       |
//       v
// Create User
//       |
//       v
// 201 Success Response
    try {
        const { username, email, fullName, password } = req.body;

        if (
            [username, email, fullName, password].some(
                (field) => field?.trim() === ""
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }

        const user = await User.create({
            username,
            email,
            fullName,
            password,
        });
        //hide the password field in the response
        const createdUser = await User.findById(user._id).select("-password");

        return res.status(201).json({
            success: true,
            data: createdUser,
            message: "User registered successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }
        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

         user.refreshToken = newRefreshToken;

        await user.save({ validateBeforeSave: false });

        const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
        );


       const options = {
            httpOnly: true,//frontend js token nhi padh sakta
            secure: true
        };
        return res
            .status(200)
            //server cookies set karega browser me, isliye httpOnly true karna chahiye taki client side scripts unhe access na kar sake
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                success: true,
                user: loggedInUser,
                message: "Login successful"
});

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const logoutUser = async (req, res) => {
    try {

        // Database se refresh token remove karo
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {  //unset refrehToken field from database
                    refreshToken: 1
                }
            }
        );

        // Browser se cookies remove karo
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
//  Refresh Token
//       ↓
// jwt.verify()
//       ↓
// _id mil gaya
//       ↓
// User.findById(_id)
//       ↓
// User exist?
//       ↓ No → 401
//       ↓ Yes
// Token DB wale token se match?
//       ↓ No → 401
//       ↓ Yes
// New Access Token Generate
//       ↓
// 200 OK
        const incomingRefreshToken =
            req.cookies?.refreshToken ||
            req.body.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required"
            });
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        if (incomingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired or used"
            });
        }

        const accessToken = user.generateAccessToken();

        return res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

const updateUserAvatar = async (req, res) => {
    try {
        const avatarLocalPath = req.file?.path;

        if (!avatarLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Avatar file is required"
            });
        }

        const avatar = await uploadOnCloudinary(
            avatarLocalPath
        );

        if (!avatar) {
            return res.status(500).json({
                success: false,
                message: "Error while uploading avatar"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            {
                new: true
            }
        ).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            data: user,
            message: "Avatar updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const updateUserCoverImage = async (req, res)=>{
    try {
        const coverImageLocalPath = req.file?.path;

        if (!coverImageLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Cover image file is required"
            });
        }

        const coverImage = await uploadOnCloudinary(
            coverImageLocalPath
        );

        if (!coverImage) {
            return res.status(500).json({
                success: false,
                message: "Error while uploading cover image"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    coverImage: coverImage.url
                }
            },
            {
                new: true
            }
        ).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            data: user,
            message: "Cover image updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const changeCurrentPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old password and new password are required"
            });
        }

        const user = await User.findById(req.user._id);

        const isPasswordCorrect =
            await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid old password"
            });
        }

        user.password = newPassword;

        await user.save({
            validateBeforeSave: false  //validation skip karne ke liye
        });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateAccountDetails = async (req, res) => {
    try {
        const { fullName, email } = req.body;

        if (!fullName || !email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    fullName,
                    email
                }
            },
            {
                new: true
            }
        ).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            data: user,
            message: "Account details updated successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export { registerUser, loginUser, logoutUser, refreshAccessToken, updateUserAvatar, updateUserCoverImage, changeCurrentPassword, updateAccountDetails };


