const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  faculty: { type: String, required: true,},
  courses: [{type: mongoose.SchemaTypes.ObjectId, ref: "Courses"}]
}, {
    timestamps: true
});


exports.Department = mongoose.model("Departments", departmentSchema)