# 📚 Book Memory — A Social Platform for Book Lovers

[🌍 Live Demo](https://book-and-memories.vercel.app)

[Frontend GitHub Repo](https://github.com/johnbekele/Book-and-Memories-Frontend.git)  
[Backend GitHub Repo](https://github.com/johnbekele/Book-and-Memories.git)

---

## 📝 Project Description
**Book Memory** is a full-stack social media platform designed for book lovers to share, discuss, and explore books. Users can post their reading experiences, like and comment on posts, and engage in community discussions. Built with the **MERN stack**, it also features **AI-powered moderation** to ensure safe and quality discussions.

---

## 🔑 Credentials for Testing
| Role        | Email                  | Password |
|:------------|:------------------------|:---------|
| User        | user@gmail.com           | Pass123  |
| Moderator   | moderator@gmail.com      | Pass123  |
| Admin       | admin@gmail.com          | Pass123  |

---

## ✨ Features
- 🧑‍💻 User Roles: User, Moderator, and Admin dashboards.
- 📚 Book Sharing: Post book summaries, reviews, and discussions.
- ❤️ Like & Comment: Engage with the community by liking and commenting.
- 🚩 AI Moderation: Content automatically scanned by **Gemini AI** for inappropriate content.
- 🛡️ Secure Authentication: JWT-based authentication with Google OAuth login.
- 🔥 Real-time Updates: Immediate content moderation and notifications.
- 📈 Scalable Architecture: Clean separation between frontend and backend.

---

## 🔐 Authentication & Security
- JWT (JSON Web Tokens) for session handling.
- Google OAuth 2.0 login via Passport.js.
- Role-based protected routes in both backend (Express middleware) and frontend (React Context).
- Data security and route authorization.

---

## ⚙️ Tech Stack
| Layer | Technology |
|:------|:-----------|
| Frontend | React.js, React Router, React Query |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT, Passport.js (Google Strategy) |
| AI Moderation | Gemini AI |
| Hosting | Frontend: Vercel, Backend: AWS EC2 |

---

## 🛠️ Installation and Setup Instructions

### Backend Setup
```bash
git clone https://github.com/johnbekele/Book-and-Memories.git
cd Book-and-Memories
npm install
npm run dev
```

### Frontend Setup
```bash
git clone https://github.com/johnbekele/Book-and-Memories-Frontend.git
cd Book-and-Memories-Frontend
npm install
npm start
```

> ⚡ Ensure you set up a `.env` file for backend with environment variables like `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, etc.

---

## 📚 API Endpoints Overview

### 🔐 Auth Routes
- `GET /api/auth/profile` — Get current user profile
- `POST /api/auth/register` — Register a user
- `POST /api/auth/login` — Login a user
- `GET /api/auth/google` — Google OAuth login
- `GET /api/auth/google/callback` — Google OAuth callback

### 📚 Book Routes
- `GET /api/books/` — Get all books
- `POST /api/books/add` — Add a new book
- `POST /api/books/search` — Search books
- `GET /api/books/google/search` — Search books using Google Books API

### 📝 Post Routes
- `GET /api/posts/` — Get all posts
- `POST /api/posts/comment/:postid` — Comment on a post
- `POST /api/posts/:postId/like` — Like a post
- `POST /api/posts/:postId/unlike` — Unlike a post

### 🚩 Flagged Comments
- `GET /api/posts/flagged/` — Get all flagged comments (Moderator only)

### ⭐ Favorites
- `GET /api/favorites/` — Get user favorites

### 🔔 Notifications
- `GET /api/notifications/` — Get system notifications

---

## 📦 Future Improvements
- ✍️ Add private messaging between users.
- 🧠 Further improve AI moderation accuracy with ML training feedback.
- 📊 Add analytics dashboard for Admin.
- 📱 Launch mobile-friendly Progressive Web App (PWA).

---

## 📸 Screenshots
(You can add screenshots or UI previews here.)

![image](https://github.com/user-attachments/assets/096571c7-e702-4cb4-98c2-c752a37ac591)
![Screenshot 2025-04-28 at 23 57 51](https://github.com/user-attachments/assets/9114579a-12e4-4c9c-8ab1-5844a8bc4ef6)
![image](https://github.com/user-attachments/assets/293c0c72-e901-40c5-b0c3-d6f3f43a3b68)
![image](https://github.com/user-attachments/assets/4fb49df1-7ba4-45a9-8f58-4636cf2aed4e)
![image](https://github.com/user-attachments/assets/fbf0a9d2-3fc3-4f2b-ae2e-f47b0d1e66a5)
![image](https://github.com/user-attachments/assets/2d93855e-93e3-40f5-98a1-a7563c46dfae)





## 📄 License
This project is licensed under the MIT License.

---

> Made with ❤️ for Book Lovers!

---

