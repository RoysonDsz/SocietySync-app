import express from 'express';
import {
  createVisitor,
  getVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
} from '../controllers/visitorAlert.controllers.js';

const alertRouter = express.Router();
alertRouter.post('/visitor', createVisitor);
alertRouter.get('/visitors', getVisitors);
alertRouter.get('/visitor/:id', getVisitorById);
alertRouter.put('/visitor/:id', updateVisitor);
alertRouter.delete('/visitor/:id', deleteVisitor);

export default alertRouter
