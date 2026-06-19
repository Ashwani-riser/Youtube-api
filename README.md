## 🌐 Live API
Base URL:https://youtube-api-ziy9.onrender.com

# 🎥 YouTube Backend API

A scalable RESTful backend inspired by YouTube, built with Node.js, Express, MongoDB, JWT Authentication, and Cloudinary.
This project provides secure user management, video handling, subscriptions, likes, playlists, tweets, comments, and dashboard analytics.

---

## 🚀 Features

### 👤 Authentication & Authorization
- User Registration
- User Login & Logout
- JWT Access Token & Refresh Token
- Secure Password Hashing using bcrypt
- Protected Routes Middleware

### 👥 User Management
- Update Account Details
- Change Password
- Update Avatar & Cover Image
- View User Profile
- Watch History

### 🎬 Video Management
- Upload Videos
- Publish / Unpublish Videos
- Update Video Details
- Delete Videos
- Search Videos
- Pagination Support
- Channel Videos

### 👍 Likes System
- Like / Unlike Videos
- Like / Unlike Comments
- Get Liked Videos

### 💬 Comments
- Add Comment
- Update Comment
- Delete Comment
- Get Video Comments

### 📺 Subscriptions
- Subscribe to Channel
- Unsubscribe from Channel
- Get Subscriber Count
- Get Subscribed Channels

### 📂 Playlists
- Create Playlist
- Update Playlist
- Delete Playlist
- Add Video to Playlist
- Remove Video from Playlist

### 🐦 Tweets
- Create Tweet
- Update Tweet
- Delete Tweet
- Get User Tweets

### 📊 Dashboard
- Total Videos
- Total Views
- Total Subscribers
- Total Likes
- Channel Statistics

### ☁️ Cloud Storage
- Cloudinary Integration
- Image Uploads
- Video Uploads

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Cloudinary | Media Storage |
| Multer | File Uploads |
| Cookie Parser | Cookie Handling |

---

## 📁 Project Structure

```bash
src/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── constants/
│
├── app.js
└── index.js
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

MONGODB_URI=your_mongodb_uri
DB_NAME=youtube

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📦 Installation

### Clone Repository

```bash
git clone https://github.com/Ashwani-riser/Youtube-api.git
```

### Move Into Project

```bash
cd Youtube-api
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Server will run on:

```bash
http://localhost:8000
```

---

## 🔐 Authentication Flow

```text
User Login
    │
    ▼
Generate Access Token
Generate Refresh Token
    │
    ▼
Store Refresh Token in Database
    │
    ▼
Access Protected Routes
```

---

## 📌 API Endpoints

### Auth

```http
POST   /api/v1/users/register
POST   /api/v1/users/login
POST   /api/v1/users/logout
POST   /api/v1/users/refresh-token
```

### Users

```http
GET    /api/v1/users/current-user
PATCH  /api/v1/users/update-account
PATCH  /api/v1/users/change-password
PATCH  /api/v1/users/avatar
PATCH  /api/v1/users/cover-image
```

### Videos

```http
POST   /api/v1/videos
GET    /api/v1/videos
GET    /api/v1/videos/:videoId
PATCH  /api/v1/videos/:videoId
DELETE /api/v1/videos/:videoId
```

### Comments

```http
POST   /api/v1/comments/:videoId
GET    /api/v1/comments/:videoId
PATCH  /api/v1/comments/:commentId
DELETE /api/v1/comments/:commentId
```

### Playlists

```http
POST   /api/v1/playlists
GET    /api/v1/playlists/:playlistId
PATCH  /api/v1/playlists/:playlistId
DELETE /api/v1/playlists/:playlistId
```

### Subscriptions

```http
POST   /api/v1/subscriptions/:channelId
GET    /api/v1/subscriptions/c/:channelId
GET    /api/v1/subscriptions/u/:subscriberId
```

---

## 📈 Future Improvements

- Real-time Notifications
- Live Streaming Support
- Recommendation Engine
- Video Processing Queue
- AI-powered Search
- Redis Caching
- Docker Deployment

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

## ⭐ Show Your Support

If you found this project useful, please give it a ⭐ on GitHub.

---

## 👨‍💻 Author

**Ashwani Kumar**

- GitHub: https://github.com/Ashwani-riser
- LinkedIn: https://www.linkedin.com/in/ashwani-kumar-2b2110320/

---

### Built with ❤️ using Node.js, Express, MongoDB and Cloudinary
