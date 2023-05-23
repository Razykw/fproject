const express = require("express");
const User = require("../models/User.js");
const bcrypt = require('bcrypt'); // you need to install this using npm install bcrypt
const userRouter = express.Router();
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Unauthorized: Incorrect password" });
    }

    // Authentication successful, return a success response
    res.json({ user: {email: user.email, role: user.role, name: user.name }, message: "User logged in successfully" }); // added user information
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

userRouter.post("/register", async (req, res) => {
  const { email, password, age, name, phone, role } = req.body;

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ email, password, age, name, phone, role });
    const user = await newUser.save();
    res.json({ id: user._id, email: user.email, message: "User registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

userRouter.get("/", async(req,res)=>{
    const data = await User.find({});
    res.json(data);
});

userRouter.get("/:email", async(req,res)=>{
    const data = await User.find({email: req.params.email}).exec();
    res.json(data);
});

userRouter.put('/update/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;
    const result = await User.updateOne({ email: email }, user);
    console.log('Update result:', result);
    if (result.matchedCount === 0 && result.modifiedCount === 0) {
      throw new Error('User not found');
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

userRouter.post("/add",async(req, res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        res.json(user);
    }catch{
        res.status(500).json({});   
    }
});
userRouter.delete('/:email', async (req, res) => {
  try {
      const email = req.params.email;
      const result = await User.deleteOne({ email: email });
      console.log('Delete result:', result);
      if (result.deletedCount === 0) {
          throw new Error('User not found');
      } else {
          res.sendStatus(200);
      }
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = userRouter;
