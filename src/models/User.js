const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true, trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
        type: String, 
        enum: ['student', 'teacher'], 
        required: true, 
        default: 'student' 
    },
        // Dashboard-related fields
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: []
    }],

    completedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        default: []
    }],

    certificates: [{
        type: String, // certificate URL or ID
        default: []
    }],

    hoursLearned: {
        type: Number,
        default: 0
    },
    avatar: { 
        type: String,
         default: "" 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.comparePassword = function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
