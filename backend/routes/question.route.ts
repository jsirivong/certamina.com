import express from 'express';
import { authorizeUser } from '../middleware/authorization.ts'
import { generateQuestions } from '../controllers/question.controller.ts';

const router = express.Router();

router.post("/generate-questions", generateQuestions);

export default router;