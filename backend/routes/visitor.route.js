import express from 'express';
import { createVisitor, deleteVisitor, getAllVisitor, getVisitorById, checkOutVisitor } from '../controllers/visitor.controllers.js';

const visitorRouter = express.Router();

// Change route path to match what the frontend is using
visitorRouter.post('/add-visitor', createVisitor);
visitorRouter.get('/get-visitor', getAllVisitor);
visitorRouter.get('/visitor-by/:id', getVisitorById);
visitorRouter.delete('/delete-visitor/:id', deleteVisitor);
// Add check-out route
visitorRouter.put('/check-out/:id', checkOutVisitor);

export default visitorRouter;