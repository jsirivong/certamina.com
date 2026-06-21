import express from 'express'
import { checkIfRoomExists } from '../controllers/room.controller.ts';
// import { authorizeUser } from '../middleware/authorization.ts';

const router = express.Router();

// router.post("/create", createRoom)
router.post("/status/:code", checkIfRoomExists)
// router.post("/join/:code", joinRoom)

export default router;

