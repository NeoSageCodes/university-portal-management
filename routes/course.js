const router = require("express").Router();
const { createCourse, getAllCourses, getOneCourse, updateCourse, deleteCourse } = require("../controllers/course");
const { createCourseValidation } = require("../middleware/validation");

router.post("/", createCourseValidation, createCourse);
router.get("/", getAllCourses);
router.get("/:id", getOneCourse);
router.patch("/:id", updateCourse);
router.delete("/:id", deleteCourse);

module.exports = router;