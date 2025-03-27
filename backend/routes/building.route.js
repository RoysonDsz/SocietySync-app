import express from 'express';
import {
    createBuilding,
    deleteBuilding,
    getAllBuildings,
    getBuildingById,
    updateBuilding,
} from '../controllers/building.controllers.js';

const buildingRouter = express.Router();

buildingRouter.post('/create', createBuilding);
buildingRouter.get('/', getAllBuildings);
buildingRouter.get('/:id', getBuildingById);
buildingRouter.put('/update/:id', updateBuilding);
buildingRouter.delete('/delete/:id', deleteBuilding);

export default buildingRouter;
