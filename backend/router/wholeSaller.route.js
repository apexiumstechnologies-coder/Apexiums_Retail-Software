import express from "express";

const router = express.Router();

import {
  signupWholesaler,
  loginWholesaler,
} from "../Controller/wholeSalerController.js"

router.post("/signup" , signupWholesaler);
router.post("/login" , loginWholesaler);

export default router;