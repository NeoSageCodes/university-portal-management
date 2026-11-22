const router = require("express").Router();
const { createDepartment, getAllDepartments, getOneDepartment, updateDepartment, deleteDepartment } = require("../controllers/department");
const { createDepartmentValidation } = require("../middleware/validation");

router.post("/", createDepartmentValidation, createDepartment);
router.get("/", getAllDepartments);
router.get("/:id", getOneDepartment);
router.patch("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router