import express from 'express';
import { forgotPassword, google, signin, signup } from '../controllers/auth.Controller.js';
import { signOut } from '../controllers/user.controller.js';
const router = express.Router();


router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut)
router.post('/forgot', forgotPassword)



export default router;