# Mock Interview Feature - Implementation Plan

## 📋 Overview
Adding an interactive mock interview feature where users can practice with AI-generated questions and receive real-time feedback.

## 🎯 Core Flow
1. **Start Interview** → Choose role/difficulty
2. **AI asks questions** (1 at a time, 5-10 total)
3. **User answers** (text input)
4. **Get feedback** (score 0-10, strengths, gaps, improved answer)
5. **Final summary** (overall score, weak areas, tips)

## 🏗️ Architecture

### Database Models
**MockInterview Session**
```javascript
{
  user: ObjectId,
  reportId: ObjectId, // linked to existing report (optional)
  role: String,
  difficulty: "beginner" | "intermediate" | "advanced",
  questions: [ObjectId], // references to MockQuestion docs
  currentQuestionIndex: Number,
  startedAt: Date,
  completedAt: Date,
  status: "in-progress" | "completed",
  overallScore: Number,
  feedbackSummary: String
}
```

**MockQuestion**
```javascript
{
  session: ObjectId,
  questionNumber: Number,
  question: String,
  source: "report" | "fresh", // from existing report or AI-generated
  userAnswer: String,
  feedback: {
    score: Number (0-10),
    strengths: [String],
    gaps: [String],
    improvedAnswer: String
  },
  answeredAt: Date
}
```

### API Endpoints
```
POST   /api/interview/mock/start
       Body: { reportId?, role, difficulty }
       Returns: { sessionId, question, questionNumber, totalQuestions }

POST   /api/interview/mock/answer
       Body: { sessionId, answer }
       Returns: { feedback, nextQuestion?, summaryReady }

GET    /api/interview/mock/summary/:sessionId
       Returns: { overallScore, weakAreas, improvementTips, sessionDetails }

GET    /api/interview/mock/history
       Returns: [{ sessionId, role, score, completedAt, difficulty }]
```

### Gemini Model Strategy
- **Primary (reports)**: gemini-3-flash-preview (current, stable)
- **Mock Interview**: gemini-1.5-flash or gemini-1.5-nano (cheaper, 1M tokens/day)
  - Faster response
  - Lower cost
  - Sufficient for Q&A generation and feedback

### Frontend Components
```
MockInterview.jsx (main container)
├── DifficultySelector.jsx (start screen)
├── QuestionDisplay.jsx (current question + counter)
├── AnswerInput.jsx (text area for user response)
├── FeedbackCard.jsx (score + feedback display)
├── SessionSummary.jsx (final results + stats)
└── MockHistory.jsx (past sessions list)
```

## 📝 Implementation Steps

### Phase 1: Database & Models (Step 1-2)
1. Create `mockInterview.model.js` - session tracking
2. Create `mockQuestion.model.js` - question & feedback storage

### Phase 2: Backend AI Service (Step 3)
3. Add cheaper Gemini model integration
4. Create prompts for:
   - Question generation (from report or fresh)
   - Answer feedback scoring

### Phase 3: Backend API (Step 4)
5. Create `mock.controller.js` with:
   - startMockInterview
   - submitAnswer
   - getSummary
   - getHistory

6. Add routes in `interview.routes.js`

### Phase 4: Frontend UI (Step 5-6)
7. Build mock interview flow components
8. Connect to API endpoints
9. Add real-time feedback display

### Phase 5: Polish & Deploy (Step 7-9)
10. Error handling, rate limiting, loading states
11. Testing & validation
12. Deployment & monitoring

## 🔑 Key Features
- ✅ Reuse questions from existing reports OR generate fresh ones
- ✅ Difficulty scaling (easy/medium/hard questions)
- ✅ Real-time AI feedback on each answer
- ✅ Session history tracking
- ✅ Cheap model (nano/flash) for cost efficiency
- ✅ Touch-friendly mobile UI (already responsive)
- ✅ Progress tracking during session

## ⚠️ Considerations
- **API Limits**: Gemini nano has 1M tokens/day (sufficient for ~500 mock interviews)
- **Response Time**: Expected 2-3s per question feedback
- **Storage**: Questions stored in DB for history
- **Cost**: ~50-100x cheaper than current gemini-3-flash model

## 🚀 Start Point
Begin with **Step 1**: Creating the database models for mock interview sessions and questions.
