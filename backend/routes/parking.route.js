
// backend route
import express from 'express';
import {
    createParking,
    deleteParking,
    getAllParkings,
    getSingleParking,
    updateParking
} from '../controllers/parking.controllers.js';

const parkingRouter = express.Router();

parkingRouter.post('/book-parkings', createParking);
parkingRouter.get('/get-parkings', getAllParkings);
parkingRouter.get('/get-parkings/:id', getSingleParking);
parkingRouter.put('/update-parkings/:id', updateParking);
parkingRouter.delete('/delete-parkings/:id', deleteParking);

export default parkingRouter;