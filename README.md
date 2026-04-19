# 🚀 Interview AI – Intelligent Interview Preparation Platform

Interview AI is a full-stack AI-powered web application that helps users prepare for job interviews by analyzing their resume and target job description to generate a personalized interview strategy.

It provides match scoring, technical & behavioral questions, skill gap analysis, and a structured preparation roadmap, along with an ATS-optimized resume tailored to the role.

---

## ✨ Features

### 🧠 AI-Powered Analysis
- Analyze resume + job description using Google Gemini
- Generate structured and consistent outputs using schema validation (Zod)
- Personalized and role-specific interview preparation

---

### 📊 Smart Interview Report
- Match Score (0–100) with alignment insights
- Technical Questions
  - Role-specific questions
  - Interviewer intent
  - Model answers
- Behavioral Questions
  - Real-world scenarios
  - Structured answering approach
- Skill Gap Analysis
  - Missing skills with priority levels
- Preparation Roadmap
  - Day-wise structured plan

---

### 📄 Resume Optimization
- Generate ATS-friendly resume tailored to job role
- Clean, professional format (HTML → PDF using Puppeteer)
- Highlights relevant skills and experience

---

### 🔐 Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Secure API routes
- Token-based session handling

---

### 📁 Interview History
- Save and access previous reports
- Revisit preparation strategies anytime
- Organized user-specific data

---

### 🎨 UI/UX
- Modern React + Vite frontend
- Clean, premium UI with smooth animations
- Responsive and user-friendly dashboard

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- SCSS (SASS)
- Axios
- Context API

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Google Generative AI (Gemini)
- JWT Authentication

### Other Tools
- Multer (file upload)
- pdf-parse (resume parsing)
- Puppeteer (PDF generation)
- Zod (schema validation)

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
6. Download optimized resume

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
- POST /api/interview/resume/pdf/:id → Generate resume

---


### Frontend Setup
cd frontend  
npm install  
npm run dev  

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

