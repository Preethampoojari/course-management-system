# 🎓 Course Management System (CMS)

A full-stack **Course Management System (CMS)** built with **Next.js 16 + TypeScript**, featuring secure authentication, role-based access control, course management, and media uploads.

This project demonstrates real-world full-stack architecture, scalable design, and production-ready features.

---

## 🚀 Live Demo

🔗 **Live Project:**  
👉 https://course-management-system-nine.vercel.app/  

🔗 **GitHub Repository:**  
👉 https://github.com/Preethampoojari/course-management-system  

---

## ✨ Key Features

### 🔐 Authentication & Security
- Clerk-based Sign Up / Sign In
- Secure session handling
- Clerk Webhooks integration
- Protected routes using Next.js Middleware
- Role-Based Access Control (RBAC)

### 👥 Role-Based Access System (RBAC)

| Role        | Permissions |
|------------|-----------|
| **Admin** | Full access, manage courses, assign roles, access dashboard |
| **Moderator (Instructor)** | Access dashboard, create/manage courses (no role management) |
| **Student** | View courses and course details only |
| **Guest** | Access only the home page |

---

## 🔎 Demo Access Note (Important)

For demonstration purposes, newly registered users are assigned the **Moderator** role by default.

This allows recruiters and reviewers to:

- Access the Admin Dashboard
- Create and manage courses
- Explore core CMS functionalities without manual role assignment

⚠️ In a real-world production environment, the default role would be **Student**, and role assignment would be strictly controlled by Admin users only.  
This setup is intentionally configured to make the project easily testable.

---

## 📊 Dashboard Note

The dashboard in this project is currently implemented as a **static UI** to showcase layout design and user experience.

- The dashboard represents a future-ready structure for analytics and user metrics.
- Dynamic data integration can be added in future iterations.

---

## 📚 Course Management Features

- Create, update, and publish courses
- Upload course thumbnails and videos
- View course details and curriculum
- Admin & Moderator dashboards
- Secure API endpoints

---

## ☁️ Media Upload System

- Image & video uploads using **Cloudinary**
- File processing using **DataURI**
- Secure and optimized media storage

---

## 🎨 UI & UX

- Fully responsive design
- Modern UI with Tailwind CSS & shadcn/ui
- Clean and scalable component architecture

---

## 🛠️ Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

### Backend
- Next.js API Routes (Route Handlers)
- MongoDB Atlas
- Mongoose ODM

### Authentication & Authorization
- Clerk Authentication
- Clerk Webhooks
- Role-Based Access Control (RBAC)

### Media & Storage
- Cloudinary
- DataURI

### Deployment & Tools
- Vercel
- Git & GitHub
- Environment Variables (.env)
- REST APIs
- Next.js Middleware

---

## 🏗️ Project Architecture
- course-management-system/
- ├── app/ # Next.js App Router
- ├── components/ # Reusable UI components
- ├── api/ # Backend API routes
- ├── lib/ # Utility functions
- ├── models/ # MongoDB schemas
- ├── types/ # TypeScript types
- ├── middleware.ts # Route protection


---

## 🔥 Highlights

- ✅ Full-stack Next.js architecture
- ✅ Enterprise-level RBAC system
- ✅ Secure APIs & protected routes
- ✅ Scalable folder structure
- ✅ Production-ready deployment
- ✅ Clean and maintainable codebase
- ✅ Real-world CMS functionality

---

## 📸 Screenshots

- Home Page



- Course List
- Course Details
- Admin Dashboard
- Role Management
- Responsive UI

---

## 🚧 Future Improvements

- Payment integration (Stripe / Razorpay)
- Student enrollment system
- Progress tracking & analytics

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to fork this repository and submit a pull request.

---

## 👤 Author

**Preetham Poojari**  
💼 Full Stack Developer  

- 🌐 Portfolio: https://personal-portfolio-psi-five-33.vercel.app/
- 🐙 GitHub: https://github.com/Preethampoojari
- 💼 LinkedIn: https://www.linkedin.com/in/preethampoojari/

---

⭐ If you like this project, give it a star!

