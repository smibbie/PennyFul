// Dependencies -------------------------------------------------
const path = require("path");
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../config/middleware/isAuthenticated");

// Routes --------------------------------------------------------

// GET - "/" Landing page route
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/landing.html"));
});

// GET "/signup" - If the user already has an account send them to the members page
router.get("/signup", (req, res) => {
  if (req.user) {
    res.redirect("/members");
  }
  res.sendFile(path.join(__dirname, "../views/signup.html"));
});

// GET "/login" - If the user already has an account send them to the members page
router.get("/login", (req, res) => {
  if (req.user) {
    res.redirect("/members");
  }
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

// GET "/members" - authenticated route - logged in users only
// add this middleware for any route that shouldnt be accessible to public
router.get("/members", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dashboard.html"));
});

router.get("/members/chart-view", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/chart.html"));
});

router.get("/members/support", isAuthenticated, (req, res) => {
  if (!req.user) {
    res.redirect("/login");
  }
  res.sendFile(path.join(__dirname, "../views/support.html"));
});

module.exports = router;
