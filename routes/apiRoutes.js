// Dependencies ------------------------------------------------
const db = require("../models");
const passport = require("../config/passport");
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../config/middleware/isAuthenticated");

// Routes ------------------------------------------------------

// -----------------------------------------------------------------------------------
// NOTE: ROUTES FOR USER LOGIN/LOGOUT/SIGNUP/USERDATA --------------------------------
// POST "/api/login" - passport.authenticate middleware with our local strategy
// if credentials valid, login successful. otherwise, error.
// -----------------------------------------------------------------------------------
router.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json("/members");
});

// POST "/api/signup" - for sign up form, hashing/salting happens in user.js sequelize model.
router.post("/api/signup", (req, res) => {
  console.log(req.body);
  db.User.create({
    email: req.body.email,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname
  }).then(() => {
    res.redirect(307, "/api/login");
  }).catch((err) => {
    console.log(err);
    res.json(err);
  });
});

// GET "/members/api/user_data" - for getting some data about our user to be used client side
router.get("/api/user_data", isAuthenticated, (req, res) => {
  if (!req.user) {
    res.json({});
  }
  else {
    res.json({
      email: req.user.email,
      id: req.user.id,
      firstname: req.user.firstname,
      lastname: req.user.lastname
    });
  }
});

// GET "/logout" - for logging user out
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// --------------------------------------------------------------------------
// NOTE: ROUTES FOR USERS BUDGET'S - CREATE/READ/UPDATE/DELETE
// THESE ROUTES ARE LOCKED DOWN! - THIS MEANS:
// ALL USERS NOT LOGGED IN WILL BE REDIRECTED TO LOG IN PAGE.
// For testing purposes, remove the 2nd param "isAuthenticated"
// --------------------------------------------------------------------------
// GET route for getting all of the total budget
router.get("/api/budgets/user/:userId", isAuthenticated, (req, res) => {
  db.Budget.findAll({
    where: {
      UserId: req.params.userId
    }
  })
  .then(function(dbBudget) {
    res.json(dbBudget);
  });
});

// POST route for saving a new budget
router.post("/api/budgets", isAuthenticated, (req, res) => {
  console.log(req.body);
  db.Budget.create(req.body).then((dbBudget) => {
    res.json(dbBudget);
  });
});

// DELETE route for deleting specific budgets by id
router.delete("/api/budgets/:id", isAuthenticated, (req, res) => {
  db.Budget.destroy({
    where: {
      id: req.params.id
    }
  }).then((dbBudget) => {
    res.json(dbBudget);
  });
});

// PUT route for updating specific budgets by id
router.put("/api/budgets/:id/:name", isAuthenticated, (req, res) => {
  db.Budget.update(
    req.body,
    {
      where: {
        UserId: req.params.id,
        name: req.params.name
            }
    }).then((dbBudget) => {
    res.json(dbBudget);
  });
});

// ------------------------------------------------------------------
// Exports ----------------------

module.exports = router;
