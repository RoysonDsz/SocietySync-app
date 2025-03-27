import express from 'express';
import { assignFlat, deleteResidentById, getAllResidents, getResidentById, getResidentsForBuilding, updatedResident } from '../controllers/assign.controllers.js';


const assignRouter = express.Router();

assignRouter.post('/:buildingNumber/assign/:residentEmail', assignFlat);
assignRouter.get('/', getAllResidents);
assignRouter.get('/:id/residents', getResidentsForBuilding);
assignRouter.get('/:id', getResidentById);
assignRouter.put('/update/:id', updatedResident);
assignRouter.delete('/delete/:id', deleteResidentById);

export default assignRouter;
