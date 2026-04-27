# 🚀 Interview AI – Intelligent Interview Preparation Platform

Interview AI is a full-stack AI-powered web application that helps users prepare for job interviews by analyzing their resume and target job description to generate a personalized interview strategy.

It provides match scoring, technical & behavioral questions, skill gap analysis, and a structured preparation roadmap, along with an ATS-optimized resume and an interactive mock interview experience.

🔗 **Live Demo:** https://interview-ai-green.vercel.app

## 📸 Screenshots

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/61bc9d86-8e6d-4dc1-938c-add1bba1b73b" width="100%" />
      <br/>
      <b>Landing Page</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d832528c-b534-4f0d-8df4-b54a1690bdda" width="100%" />
      <br/>
      <b>Interview Report</b>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/632db050-5452-481f-8665-dd54201f291a" width="100%" />
      <br/>
      <b>Mock Interview Mode</b>
    </td>
  </tr>
</table>

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

### 🎤 Mock Interview Mode 
- Practice real interview questions interactively  
- Submit answers and get **instant AI feedback**  
- Score-based evaluation with strengths & gaps  
- Suggested improvements and sample answers  
- Simulates real interview thinking process  

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
- `/health` endpoint implemented for uptime checks  

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
8. Practice with Mock Interview Mode for real-time feedback  

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

### Mock Interview Routes
- POST /api/mock/start → Start mock interview  
- POST /api/mock/answer → Evaluate answer  

---

## 📌 Architecture Note

Resume generation is handled using a client-side approach:

- Backend generates structured HTML using AI  
- Frontend converts HTML to PDF using html2pdf.js  

This design:
- Reduces backend load  
- Improves performance  
- Ensures compatibility with lightweight deployment environments  

---

## 📌 Future Improvements
- Voice-based mock interviews  
- Advanced analytics & progress tracking  
- Resume comparison (before vs after)  
- Personalized learning recommendations  

---

## 👨‍💻 Author
Neelabhra De  
Full Stack Developer (MERN + AI Integration)
