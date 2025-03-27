import express from 'express';
import {
    createParking,
    deleteParking,
    getAllParkings,
    getSingleParking,
    updateParking
} from '../controllers/parking.controllers.js';

const parkingRouter = express.Router();

// Create new parking entry
parkingRouter.post('/book-parkings', createParking);

// Get all parking entries
parkingRouter.get('/get-parkings', getAllParkings);

// Get single parking entry
parkingRouter.get('/get-parkings/:id', getSingleParking);

// Update parking entry
parkingRouter.put('/update-parkings/:id', updateParking);

// Delete parking entry
parkingRouter.delete('/delete-parkings/:id', deleteParking);

export default parkingRouter;