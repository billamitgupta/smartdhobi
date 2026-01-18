const User = require("../../models/User");
const bcrypt = require("bcryptjs");

exports.employeeRegister = async (req, res) => {
  try {
    const { name, email, password, mobile, role, panCard, aadharCard } = req.body;

    if (!name || !email || !password || !mobile || !panCard || !aadharCard) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role || "employee";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: userRole,
      panCard,
      aadharCard,
      status: "approved",
      isVerified: true
    });

    return res.status(201).json({
      message: "Employee registered successfully",
      userId: user._id,
    });
  } catch (err) {
    console.log("Registration Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");

    if (!employees || employees.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }

    return res.status(200).json({
      message: "Employees fetched successfully",
      total: employees.length,
      data: employees,
    });
  } catch (err) {
    console.error("Get Employees Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, role, panCard, aadharCard, status, isVerified } = req.body;

    const employee = await User.findOne({ _id: id, role: "employee" });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.mobile = mobile || employee.mobile;
    employee.role = role || employee.role;
    employee.panCard = panCard || employee.panCard;
    employee.aadharCard = aadharCard || employee.aadharCard;

    // Optional: Admin can approve / reject employee
    if (status) employee.status = status;
    if (typeof isVerified !== "undefined") employee.isVerified = isVerified;

    await employee.save();

    return res.status(200).json({
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (err) {
    console.error("Update Employee Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({ _id: id, role: "employee" });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.status = "rejected";
    employee.isVerified = false;

    await employee.save();

    return res.status(200).json({
      message: "Employee rejected successfully",
      data: employee,
    });
  } catch (err) {
    console.error("Delete Employee Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


