import express from "express";

const router = express.Router();

import {
  signupWholesaler,
  loginWholesaler,
} from "../Controller/wholeSalerController.js"
import { protect } from "../middleware/auth.js";

router.post("/signup", protect , signupWholesaler);
router.post("/login", protect , loginWholesaler);

export default router;