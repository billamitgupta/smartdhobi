const express = require("express");
const { createReview, listReviews, approveReview, markHelpful } = require("../../controllers/customer/reviewController");
const auth = require("../../middlewares/authMiddleware");
const { adminMiddleware } = require("../../middlewares/roleMiddleware");

const router = express.Router();

router.post("/createReview", auth, createReview);
router.get("/listReviews", listReviews);
router.put("/approveReview/:id", auth, adminMiddleware, approveReview);
router.put("/markHelpful/:id", auth, markHelpful);

module.exports = router;
