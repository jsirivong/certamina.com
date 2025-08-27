import express from 'express';
import { createPractice, inPractice } from '../controllers/practice.controller.ts';

const router = express.Router();

router.post("/", createPractice)
router.get("/inpractice", inPractice)

export default router;