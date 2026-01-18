const Employee = require('../../models/Employee');

exports.listEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('user manager');
        res.json({ success: true, employees });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('user manager');
        if (!employee) return res.status(404).json({ success: false, message: "Employee not found" });

        res.json({ success: true, employee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!employee)
            return res.status(404).json({ success: false, message: "Employee not found" });

        res.json({ success: true, employee });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee)
            return res.status(404).json({ success: false, message: "Employee not found" });

        res.json({ success: true, message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
