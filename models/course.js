const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    creditUnits: { type: Number, required: true },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departments",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


exports.Course = mongoose.model("Courses", courseSchema);