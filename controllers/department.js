const { Department } = require("../models/department");



exports.createDepartment = async (req, res) => {
    try {
        const {name, faculty} = req.body;
        const existing = await Department.findOne({name: name.toLowerCase()});
        if (existing) {
            return res.status(400).json({
                message: `Department with Name: ${name} already exists`
            })
        };

        const data = {
          name: name.toLowerCase(),
          faculty,
        };

        const newDepartment = await Department.create(data);

        res.status(201).json({
          message: `${name} department created successfully`,
          data: newDepartment,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


exports.getOneDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const department = await Department.findById(id).populate("courses");
        if(!department) {
            return res.status(404).json({
                message: `Department not found`
            })
        };

        res.status(200).json({
            message: "Department found", 
            data: department
        })
    } catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
};


exports.getAllDepartments = async (req, res) => {
    try {
       const allDepartments = await Department.find().populate("courses");
       
       res.status(200).json({
        message: `All departments found and the total is ${allDepartments.length}`,
        data: allDepartments
       })
    } catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
};


exports.updateDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const { name, faculty } = req.body;
        

        const existing = await Department.findById(id);
        if (!existing) {
            return res.status(404).json({
                message: "Department not found"
            })
        };
        
        const data = {};

        if (name) {
            const dprtName = name.toLowerCase();
            const duplicate = await Department.findOne({
              name: dprtName,
            });
            if (duplicate) {
                return res.status(400).json({
                    message: "Already in use"
                })
            };
        
            data.name = dprtName;
        }
        if (faculty) {
            data.faculty = faculty;
        }

        const updatedDepartment = await Department.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            message: "Department updated successfully",
            data: updatedDepartment
        })

    } catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
};


exports.deleteDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        const existing = await Department.findById(id);

        if (!existing) {
            return res.status(404).json({
                message: "Department not found"
            })
        };

        
        if (existing.courses.length > 0) {
            return res.status(400).json({
                message: "A department with course(s) can't be deleted. Please delete all courses first"
            })
        }
        const deletedDepartment = await Department.findByIdAndDelete(id);

        res.status(200).json({
            message: "Department deleted successfully",
            data: deletedDepartment
        })
    } catch (error) {
        res.status(500).json({
          message: error.message,
        });
    }
};