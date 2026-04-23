# 🚀 Interview AI – Intelligent Interview Preparation Platform

Interview AI is a full-stack AI-powered web application that helps users prepare for job interviews by analyzing their resume and target job description to generate a personalized interview strategy.

It provides match scoring, technical & behavioral questions, skill gap analysis, and a structured preparation roadmap, along with an ATS-optimized resume tailored to the role.

🔗 **Live Demo:** https://interview-ai-green.vercel.app

---

## ✨ Features

### 🧠 AI-Powered Analysis
- Analyze resume + job description using Google Gemini
- Generate structured outputs using schema validation (Zod)
- Personalized, role-specific interview preparation

---

### 📊 Smart Interview Report
- Match Score (0–100) with alignment insights  
- Technical Questions  
  - Role-specific questions  
  - Interviewer intent  
  - Answer strategies  
- Behavioral Questions  
  - Real-world scenarios  
  - Structured response guidance  
- Skill Gap Analysis  
  - Missing skills with priority levels  
- Preparation Roadmap  
  - Day-wise structured plan  

---

### 📄 Resume Optimization
- Generate ATS-friendly resume tailored to job role  
- Clean, professional format  
- **Client-side PDF generation (HTML → PDF using html2pdf.js)**  
- Faster and more scalable than server-side generation  

---

### 🔐 Authentication & Security
- JWT-based authentication  
- Password hashing with bcrypt  
- Protected API routes  
- Cookie-based session handling  

---

### 📁 Interview History
- Save and access previous reports  
- Revisit preparation strategies anytime  
- User-specific data isolation  

---

### 🎨 UI/UX
- Modern React + Vite frontend  
- Smooth animations and loading states  
- Clean, responsive dashboard  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- SCSS (SASS)
- Axios
- Context API
- html2pdf.js

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Google Generative AI (Gemini)
- JWT Authentication

### Other Tools
- Multer (file upload)
- pdf-parse (resume parsing)
- Zod (schema validation)

---

## 🚀 Deployment & Monitoring

- Frontend deployed on Vercel  
- Backend deployed on Render (free tier)  
- Backend health monitored using UptimeRobot to prevent cold starts  
- Added `/health` endpoint for uptime checks  

---

## ⚙️ How It Works

1. Upload your resume (PDF)  
2. Paste the job description  
3. (Optional) Add self-description  
4. AI analyzes your profile and job role  
5. Generates:
   - Interview questions  
   - Skill gaps  
   - Match score  
   - Preparation roadmap  
6. Resume is generated as HTML  
7. Frontend converts it to PDF instantly  

---

## 🔌 API Overview

### Auth Routes
- POST /api/auth/register  
- POST /api/auth/login  
- GET /api/auth/logout  
- GET /api/auth/get-me  

### Interview Routes
- POST /api/interview → Generate report  
- GET /api/interview → Get all reports  
- GET /api/interview/report/:id → Get single report  
- POST /api/interview/resume/pdf/:id → Generate resume HTML  

---

## 📌 Architecture Note

Originally, PDF generation was implemented using Puppeteer (server-side).  
It was later refactored to **client-side PDF generation using html2pdf.js** to:

- Reduce backend load  
- Improve performance  
- Enable deployment on free-tier infrastructure  

---

## 📌 Future Improvements
- Mock interview simulation  
- Voice-based interview practice  
- Resume comparison (before vs after)  
- AI feedback on answers  
- Analytics dashboard  

---

## 👨‍💻 Author
Neelabhra De  
Full Stack Developer (MERN + AI Integration)
