// routers/reviewRouter.js
const express = require("express");
const Review = require("../models/Review");
const reviewRouter = express.Router();

// Fetch all reviews
reviewRouter.get("/", async (req, res) => {
    const reviews = await Review.find({}).populate('customerId').populate('itemId');
    res.json(reviews);
});

// Create a new review
reviewRouter.post("/", async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.json(newReview);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Fetch a specific review
reviewRouter.get("/:reviewId", async (req, res) => {
    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId).populate('customerId').populate('itemId');
    if (!review) {
        res.status(404).json({ message: "Review not found" });
    } else {
        res.json(review);
    }
});

// Update a review
reviewRouter.put("/:reviewId", async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const updatedReview = req.body;
        const result = await Review.findByIdAndUpdate(reviewId, updatedReview, { new: true });
        if (!result) {
            throw new Error('Review not found');
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a review
reviewRouter.delete("/:reviewId", async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const result = await Review.findByIdAndRemove(reviewId);
        if (!result) {
            throw new Error('Review not found');
        }
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = reviewRouter;
