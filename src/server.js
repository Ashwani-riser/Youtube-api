import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
});



// console.log("SERVER ENV CHECK");
// console.log("CLOUD_NAME =", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("API_KEY =", process.env.CLOUDINARY_API_KEY);
// console.log("API_SECRET =", process.env.CLOUDINARY_API_SECRET ? "FOUND" : "MISSING");

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });