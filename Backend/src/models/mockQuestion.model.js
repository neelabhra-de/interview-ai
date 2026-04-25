const mongoose = require('mongoose');

/**
 * Schema for individual questions in a mock interview session
 * Stores question, user answer, and AI feedback
 */
const mockQuestionSchema = new mongoose.Schema({
    // Reference to parent mock interview session
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mockInterviews",
        required: [true, "Session ID is required"]
    },
    
    // Position in the interview (1-indexed)
    questionNumber: {
        type: Number,
        required: [true, "Question number is required"]
    },
    
    // The actual question text
    question: {
        type: String,
        required: [true, "Question text is required"]
    },
    
    // Whether this question came from existing report or AI-generated
    source: {
        type: String,
        enum: ["report", "fresh"],
        default: "fresh"
    },
    
    // Question category for analytics
    category: {
        type: String,
        enum: ["technical", "behavioral", "system-design"],
        default: "technical"
    },
    
    // User's answer text
    userAnswer: {
        type: String,
        default: null
    },
    
    // AI-generated feedback structure
    feedback: {
        // Score 0-10 for this answer
        score: {
            type: Number,
            min: 0,
            max: 10,
            default: null
        },
        
        // What was good about the answer
        strengths: [{
            type: String
        }],
        
        // What was missing or could improve
        gaps: [{
            type: String
        }],
        
        // AI's improved/ideal answer
        improvedAnswer: {
            type: String,
            default: null
        },
        
        // Timestamp when feedback was generated
        generatedAt: {
            type: Date,
            default: null
        }
    },
    
    // When user submitted the answer
    answeredAt: {
        type: Date,
        default: null
    },
    
    // Time spent on this question (in seconds)
    timeSpent: {
        type: Number,
        default: null
    }
    
}, {
    timestamps: true
});

// Index for efficient session queries
mockQuestionSchema.index({ session: 1, questionNumber: 1 });
mockQuestionSchema.index({ session: 1, 'feedback.score': 1 });

// Auto-calculate time spent when question is answered
mockQuestionSchema.pre('save', function() {
    if (this.answeredAt && this.createdAt) {
        this.timeSpent = Math.floor((this.answeredAt - this.createdAt) / 1000);
    }
});

module.exports = mongoose.model("mockQuestions", mockQuestionSchema);
