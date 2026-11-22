const { Course } = require("../models/course");
const {Department} = require("../models/department")


exports.createCourse = async (req, res) => {
    try {
        const {courseCode, title, creditUnits, department} = req.body;
        const existing = await Course.findOne({courseCode});
        if (existing) {
            return res.status(400).json({
                message: `Course with ${courseCode} already exists.`
            })
        };

        const existingDepartment = await Department.findOne({name: department.toLowerCase()});
        if (!existingDepartment) {
          return res.status(404).json({
            message: `Department not found`,
          });
        };

        const data = {
          courseCode,
          title,
          creditUnits,
          department: existingDepartment._id,
        };

        const newCourse = new Course(data);
        existingDepartment.courses.push(newCourse._id);
        await newCourse.save();
        await existingDepartment.save();

        res.status(201).json({
          message: "Course created successfully",
          data: newCourse,
        });
} catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


exports.getOneCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id).populate("department");
        if (!course) {
          return res.status(404).json({
            message: `Course not found`,
          });
        }

        res.status(200).json({
          message: "Course found",
          data: course,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find().populate("department");

        res.status(200).json({
          message: `All courses found and the total is ${allCourses.length}`,
          data: allCourses,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.updateCourse = async (req, res) => {
    try {
        const {id} = req.params;
        const { courseCode, title, creditUnits, department } = req.body;
        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                message: `Course not found`
            })
        };

        const formerDepartmentId = course.department;
        const data = {};
        

        if (courseCode) {
            const duplicate = await Course.findOne({courseCode})
            if (duplicate) {
                return res.status(400).json({
                    message: `${courseCode} already in use`
                })
            }

            data.courseCode = courseCode;
        };
        if (creditUnits) {
            data.creditUnits = creditUnits
        }
        if (title) {
            data.title = title
        }
        if (department) {
            const found = await Department.findOne({ name: department.toLowerCase() });
            if (!found) {
                return res.status(404).json({
                    message: "Department not found"
                })
            };
            if (formerDepartmentId.toString() == found._id.toString()) {
                return res.status(400).json({
                    message: `This course is already in ${department} department`
                })
            };

            data.department = found._id;
            // Added the course to the new department & save to db
            found.courses.push(id);
            await found.save();
            // Removed the course from the previous department & save to db
            const formerDepartment = await Department.findById(formerDepartmentId);
            if (formerDepartment) {
                formerDepartment.courses.pull(id);
                await formerDepartment.save();
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            message: `Course updated successfully`,
            data: updatedCourse
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};


exports.deleteCourse = async (req, res) => {
    try {
        const {id} = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                message: `Course not found`
            })
        };

        const deletedCourse = await Course.findByIdAndDelete(id);

        const departmentId = course.department;
        const department = await Department.findById(departmentId);
        if (department) {
            department.courses.pull(id);
            await department.save();
        }
        

        res.status(200).json({
            message: `${course.courseCode} deleted successfully`,
            data: deletedCourse
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};