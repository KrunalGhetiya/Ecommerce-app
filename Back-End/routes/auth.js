const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");


router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        console.log(value);
        return User.findOne({email:value}).then((userDoc) => {
          if (userDoc) {
            console.log(userDoc);
            return Promise.reject("email address already exist");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Enter valid password"),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Enter valid password")
  ],
  authController.login
);

router.get('/status', isAuth, authController.getstatus);

router.put('/status', isAuth, authController.updateStatus);

module.exports = router;
