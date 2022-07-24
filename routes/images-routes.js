const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/images-controller");
const checkAuth=require('../middleware/check-auth');

const router = express.Router();


// router.use(checkAuth);

router.post(
  "/",
  [
    check("name").not().isEmpty().withMessage("Name is required"),
    check("image").isEmpty().withMessage("Image is required"),
  ],
  placesControllers.createPlace
);

router.put("/list", placesControllers.list);

// router.delete("/:pid", placesControllers.deletePlace);
module.exports = router;
