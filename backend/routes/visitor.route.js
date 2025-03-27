import express from 'express';
import { createVisitor, deleteVisitor, getAllVisitor, getVisitorById } from '../controllers/visitor.controllers.js';

const visitorRouter = express.Router();

visitorRouter.post('/create', createVisitor);
visitorRouter.get('/get-visitor', getAllVisitor);
visitorRouter.get('/visitor-by/:id', getVisitorById);
visitorRouter.delete('/delete-visitor/:id', deleteVisitor);

export default visitorRouter