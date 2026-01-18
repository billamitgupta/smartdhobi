const User = require("../../models/User");
const bcrypt = require("bcryptjs");

exports.customerRegister = async (req, res) => {
    try {
        const { name, email, password, mobile, role } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = role || "customer";

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            role: userRole,
            status: "approved",
            isVerified: true
        });

        return res.status(201).json({
            message: "Customer registered successfully",
            userId: user._id,
        });
    } catch (err) {
        console.log("Registration Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: "customer" }).select("-password");

        if (!customers || customers.length === 0) {
            return res.status(404).json({ message: "No customers found" });
        }

        return res.status(200).json({
            message: "Customers fetched successfully",
            total: customers.length,
            data: customers,
        });
    } catch (err) {
        console.error("Get Customers Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobile, role, status, isVerified } = req.body;

        const customer = await User.findOne({ _id: id, role: "customer" });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        customer.name = name || customer.name;
        customer.email = email || customer.email;
        customer.mobile = mobile || customer.mobile;
        customer.role = role || customer.role;

        // Optional admin approval
        if (status) customer.status = status;
        if (typeof isVerified !== "undefined") customer.isVerified = isVerified;

        await customer.save();

        return res.status(200).json({
            message: "Customer updated successfully",
            data: customer,
        });
    } catch (err) {
        console.error("Update Customer Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await User.findOne({ _id: id, role: "customer" });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        customer.status = "rejected";
        customer.isVerified = false;

        await customer.save();

        return res.status(200).json({
            message: "Customer rejected successfully",
            data: customer,
        });
    } catch (err) {
        console.error("Delete Customer Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
