import express from 'express';
import { createAlert, getAlerts, updateStatus } from '../controllers/emergencyAlert.controllers.js';

const router = express.Router();

router.post('/alerts', createAlert);
router.get('/alerts', getAlerts);
router.patch('/alerts/:id', updateStatus);

export default router;
