const mongoose = require('mongoose');

/**
 * Schema for a mock interview session
 * Tracks the entire interview flow from start to completion
 */
const mockInterviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User ID is required"]
    },
    
    // Link to existing interview report (optional - user can choose to reuse)
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interviewReports",
        default: null
    },
    
    // Job role for this mock interview
    role: {
        type: String,
        required: [true, "Role is required"],
        example: "Senior Software Engineer, Full Stack Developer"
    },
    
    // Difficulty level affects question complexity
    difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "intermediate"
    },
    
    // Array of question ObjectIds (references to mockQuestion documents)
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "mockQuestions"
    }],
    
    // Track current progress
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    
    // Interview session timeline
    startedAt: {
        type: Date,
        default: Date.now
    },
    
    completedAt: {
        type: Date,
        default: null
    },
    
    // Session status
    status: {
        type: String,
        enum: ["in-progress", "completed", "abandoned"],
        default: "in-progress"
    },
    
    // Final metrics
    overallScore: {
        type: Number,
        min: 0,
        max: 10,
        default: null
    },
    
    weakAreas: [{
        type: String
    }],
    
    improvementTips: [{
        type: String
    }],
    
    // Total time spent (in seconds)
    totalTimeSpent: {
        type: Number,
        default: 0
    }
    
}, {
    timestamps: true
});

// Index for efficient user queries
mockInterviewSchema.index({ user: 1, createdAt: -1 });
mockInterviewSchema.index({ user: 1, status: 1 });

// Calculate duration when session completes
mockInterviewSchema.pre('save', function(next) {
    if (this.completedAt && this.startedAt) {
        this.totalTimeSpent = Math.floor((this.completedAt - this.startedAt) / 1000);
    }
    next();
});

module.exports = mongoose.model("mockInterviews", mockInterviewSchema);
