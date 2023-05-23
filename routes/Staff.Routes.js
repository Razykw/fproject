// routers/staffRouter.js
const express = require("express");
const Staff = require("../models/Staff");
const staffRouter = express.Router();

// Fetch all staff
staffRouter.get("/", async (req, res) => {
    const staff = await Staff.find({});
    res.json(staff);
});

// Add a new staff member
staffRouter.post("/", async (req, res) => {
    try {
        const newStaffMember = new Staff(req.body);
        await newStaffMember.save();
        res.json(newStaffMember);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Fetch a specific staff member
staffRouter.get("/:staffId", async (req, res) => {
    const staffId = req.params.staffId;
    const staffMember = await Staff.findById(staffId);
    if (!staffMember) {
        res.status(404).json({ message: "Staff member not found" });
    } else {
        res.json(staffMember);
    }
});

// Update a staff member
staffRouter.put("/:staffId", async (req, res) => {
    try {
        const staffId = req.params.staffId;
        const updatedStaffMember = req.body;
        const result = await Staff.findByIdAndUpdate(staffId, updatedStaffMember, { new: true });
        if (!result) {
            throw new Error('Staff member not found');
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a staff member
staffRouter.delete("/:staffId", async (req, res) => {
    try {
        const staffId = req.params.staffId;
        const result = await Staff.findByIdAndRemove(staffId);
        if (!result) {
            throw new Error('Staff member not found');
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = staffRouter;
