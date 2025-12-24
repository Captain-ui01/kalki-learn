// src/models/Course.js
module.exports = (mongoose) => {
  if (mongoose.models.Course) {
    return mongoose.models.Course;
  }

  const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
      }
    ]
  }, { timestamps: true });

  return mongoose.model("Course", CourseSchema);
};
