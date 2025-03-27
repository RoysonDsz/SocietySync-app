import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getOwnEvent, getSingleEvent, updateEvent } from '../controllers/event.controllers.js';

const eventRouter = express.Router();

eventRouter.post('/create-event', createEvent);
eventRouter.get('/getAll-event', getAllEvents);
eventRouter.get('/getSingle-event/:id', getSingleEvent);
eventRouter.get('/getOwn-event', getOwnEvent);
eventRouter.put('/update-event/:id', updateEvent);
eventRouter.delete('/delete-event/:id', deleteEvent);

export default eventRouter;