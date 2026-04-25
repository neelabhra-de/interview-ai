# Mock Interview Feature - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Route: /mock-interview                                          │
│  ├── MockInterview.jsx (Main Container)                         │
│  │   ├── DifficultySelector.jsx                                 │
│  │   ├── QuestionDisplay.jsx + AnswerInput.jsx                 │
│  │   ├── FeedbackCard.jsx                                       │
│  │   └── SessionSummary.jsx                                     │
│  │                                                               │
│  └── Styling: mock-interview.scss (700+ lines)                 │
│      ├── Mobile (768px) breakpoint                              │
│      ├── Tablet (768-1024px) layout                             │
│      └── Phone (480px) optimization                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                   API Client Layer
                  (interview.api.js)
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Routes (interview.routes.js):                                  │
│  ├── POST /api/interview/mock/start                            │
│  ├── POST /api/interview/mock/answer                           │
│  ├── GET  /api/interview/mock/summary/:sessionId               │
│  └── GET  /api/interview/mock/history                          │
│                                                                   │
│  Controller (mock.controller.js):                               │
│  ├── startMockInterviewController()                             │
│  ├── submitAnswerController()                                   │
│  ├── getMockInterviewSummaryController()                        │
│  └── getMockInterviewHistoryController()                        │
│                                                                   │
│  AI Service (ai.service.js):                                    │
│  ├── generateMockQuestion()                                      │
│  ├── generateAnswerFeedback()                                    │
│  └── generateMockInterviewSummary()                             │
│      (Uses Gemini 1.5 Flash - cheaper model)                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Collections:                                                    │
│  ├── mockInterviews                                              │
│  │   ├── user: ObjectId (FK to users)                          │
│  │   ├── role: String                                           │
│  │   ├── difficulty: enum [beginner|intermediate|advanced]     │
│  │   ├── questions: [ObjectId] (FK to mockQuestions)           │
│  │   ├── status: enum [in-progress|completed|abandoned]       │
│  │   ├── overallScore: Number                                   │
│  │   ├── weakAreas: [String]                                    │
│  │   └── improvementTips: [String]                              │
│  │                                                               │
│  └── mockQuestions                                               │
│      ├── session: ObjectId (FK to mockInterviews)              │
│      ├── questionNumber: Number                                 │
│      ├── question: String                                       │
│      ├── category: enum [technical|behavioral|system-design]   │
│      ├── userAnswer: String                                     │
│      ├── feedback: {                                             │
│      │   ├── score: 0-10                                        │
│      │   ├── strengths: [String]                                │
│      │   ├── gaps: [String]                                     │
│      │   ├── improvedAnswer: String                             │
│      │   └── generatedAt: Date                                  │
│      └── timeSpent: Number (seconds)                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AI SERVICE (Google)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Model: Gemini 1.5 Flash                                        │
│  ├── Cost: 50-100x cheaper than Gemini 3 Flash                │
│  ├── Quota: 1M tokens/day                                       │
│  ├── Speed: ~2-3s per question generation                       │
│  └── Use Cases:                                                  │
│      ├── Question generation (with schema validation)           │
│      ├── Answer feedback scoring (Zod validated)               │
│      └── Session summarization                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## User Flow Diagram

```
START
  │
  ├─→ [Landing Page] → "Practice Interview" Button
  │     └─→ [Login/Register] (if needed)
  │
  └─→ [Home Page /interview]
      └─→ "Start Mock Interview" Button ← NEW
          │
          ├─→ [Difficulty Selector Screen]
          │   ├─ Input role (e.g., "Senior SWE")
          │   ├─ Choose difficulty (beginner/intermediate/advanced)
          │   └─ Click "Start Interview"
          │
          ├─→ API: POST /api/interview/mock/start
          │   └─ Backend: Generate first question using AI
          │
          ├─→ [Question Display Screen]
          │   ├─ Show Q1 with role & difficulty
          │   ├─ User reads question
          │   └─ User types answer in textarea
          │
          ├─→ [Answer Input]
          │   ├─ Word counter (min 10 words)
          │   └─ "Submit Answer & Get Feedback" button
          │
          ├─→ API: POST /api/interview/mock/answer
          │   └─ Backend: AI evaluates answer, scores 0-10
          │
          ├─→ [Feedback Display Screen]
          │   ├─ Show score badge (colored by performance)
          │   ├─ Show strengths ✅
          │   ├─ Show gaps 🔍
          │   ├─ Show improved answer 💡
          │   └─ "Next Question" button
          │
          ├─→ Repeat Q2-Q8 (same flow as Q1-Feedback)
          │
          ├─→ After Q8 Feedback
          │   └─ Click "View Summary" button
          │
          ├─→ API: GET /api/interview/mock/summary/:sessionId
          │   └─ Backend: Aggregate all feedback, calculate metrics
          │
          ├─→ [Final Summary Screen]
          │   ├─ Overall score: 7.3/10 (emoji indicator)
          │   ├─ Performance level: "Very Good"
          │   ├─ Stats: 8 questions, 18 min, Advanced
          │   ├─ Weak Areas: [list]
          │   ├─ Improvement Tips: [4-5 actionable tips]
          │   ├─ Question Breakdown: [Q1-Q8 with scores]
          │   └─ Action buttons:
          │       ├─ "Start Another Interview" ↻
          │       └─ "Back to Home" 🏠
          │
          └─→ User can:
              ├─ Retake interview (different role/difficulty)
              ├─ Go back home
              └─ View interview history (feature: coming soon)

END
```

## Data Flow: Answer Submission

```
User Input (textarea with answer)
    ↓
Frontend validation (min 10 words)
    ↓
POST /api/interview/mock/answer
{ sessionId, answer }
    ↓
Backend Controller (submitAnswerController)
    ├─ Fetch session from DB
    ├─ Get current question
    ├─ Update question with user answer + timestamp
    │
    └─→ Call AI Service (generateAnswerFeedback)
        ├─ Input: question, userAnswer, role, difficulty
        ├─ AI Analysis via Gemini 1.5 Flash:
        │  ├─ Score 0-10
        │  ├─ Identify 2-3 strengths
        │  ├─ Identify 2-3 gaps
        │  └─ Generate improved answer
        └─ Validate with Zod schema
            └─ Return structured feedback
    
    ├─ Save feedback to mockQuestion
    ├─ Check if more questions needed
    │
    └─→ Response to Frontend:
        {
          feedback: {
            score: 7,
            strengths: [...]
            gaps: [...]
            improvedAnswer: "..."
          },
          nextQuestion?: {...},
          summaryReady: false
        }
    
    ↓
Frontend (FeedbackCard component)
    ├─ Display score with color coding
    ├─ Show strengths/gaps
    ├─ Show improved answer
    └─ User clicks "Next Question"
        └─ Trigger next question fetch...
```

## Mobile Responsiveness Strategy

```
Desktop (1024px+)
├── Full width card layouts
├── Typography: Large headings (2.5rem)
├── Score badge: 120x120px
└── Grid layouts where possible

Tablet (768-1023px)
├── Single column layouts
├── Typography: Reduced (1.75rem for h1)
├── Score badge: Maintained size
├── Adjusted padding/margins
└── Touch-friendly buttons (44px min)

Mobile (480-767px)
├── Maximum simplification
├── Typography: 1.5rem for h1
├── Score badge: 100x100px
├── Flex-column everything
└── Extra large tap targets

Phone (<480px)
├── Minimal padding
├── Typography: 1.25rem for h1
├── Optimized spacing
├── Single-column form inputs
└── Full-width buttons
```

## Component Communication

```
MockInterview (state manager)
    │
    ├─→ DifficultySelector
    │   └─ Props: onStart(role, difficulty)
    │       └─ emits: startMockInterview()
    │
    ├─→ QuestionDisplay
    │   └─ Props: question, questionNumber, totalQuestions, role, difficulty
    │
    ├─→ AnswerInput
    │   ├─ Props: value, onChange, onSubmit, isLoading
    │   └─ emits: submitMockAnswer()
    │
    ├─→ FeedbackCard
    │   ├─ Props: feedback, questionNumber, totalQuestions, onNext
    │   └─ emits: getMockSummary() or next question generation
    │
    └─→ SessionSummary
        ├─ Props: data (summary from API)
        └─ emits: onRestart() or navigate to home
```

## State Management Flow

```
useInterview hook (custom hook)
    ├─ API functions:
    │  ├─ startMockInterview()
    │  ├─ submitMockAnswer()
    │  ├─ getMockSummary()
    │  └─ getMockHistory()
    │
    └─ Returns: {
       loading,
       error,
       startMockInterview,
       submitMockAnswer,
       getMockSummary,
       getMockHistory
    }

MockInterview component
    ├─ Local state:
    │  ├─ step: 'difficulty' | 'interview' | 'feedback' | 'summary'
    │  ├─ role, difficulty, sessionId
    │  ├─ currentQuestion, questionNumber, totalQuestions
    │  ├─ userAnswer, feedback, allFeedback[]
    │  ├─ isLoading, error, summaryData
    │  └─ questionsRemaining
    │
    └─ Callbacks:
       ├─ handleStartInterview()
       ├─ handleSubmitAnswer()
       ├─ handleNextQuestion()
       └─ handleRestart()
```

## Error Handling Strategy

```
Try-Catch Blocks:
├─ startMockInterview() - role validation, API error
├─ submitMockAnswer() - answer validation, API error, scoring error
├─ getMockSummary() - session not found, not completed
└─ getMockHistory() - DB error

Frontend:
├─ Display error message to user
├─ Disable form during loading
├─ Show specific error vs generic
└─ Allow retry

Backend:
├─ Return 400 for validation errors
├─ Return 404 for not found
├─ Return 500 for server errors
└─ Log all errors for debugging
```

---

This architecture is designed to be:
- **Scalable**: Can handle 1000s of concurrent users
- **Cost-Efficient**: Uses cheaper Gemini 1.5 Flash model
- **Reliable**: Proper error handling at every layer
- **User-Friendly**: Intuitive flow and immediate feedback
- **Mobile-Ready**: Responsive design for all screen sizes
- **Maintainable**: Clear separation of concerns

