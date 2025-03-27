import express from 'express';
import { deleteComplaints, getAllComplaints, getComplaintById, ownComplaints, postComplaint } from '../controllers/complaint.controllers.js';

const complaintRouter = express.Router();

complaintRouter.post('/create-complaint', postComplaint);
complaintRouter.get('/get-complaint', getAllComplaints);
complaintRouter.get('/complaint-by/:id', getComplaintById);
complaintRouter.delete('/delete-complaint/:id', deleteComplaints);
complaintRouter.get('/own-complaint', ownComplaints);

export default complaintRouter