import Building from '../models/building.model.js';

export const createBuilding = async (req, res) => {
    try {
        const newBuilding = await Building.create(req.body);
        res.status(201).json(newBuilding);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const getAllBuildings = async (req, res) => {
    try {
        const buildings = await Building.find();
        res.status(200).json(buildings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getBuildingById = async (req, res) => {
    try {
        const building = await Building.findById(req.params.id);
        if (!building) return res.status(404).json({ message: 'Building not found' });
        res.status(200).json(building);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 

export const updateBuilding = async (req, res) => {
    try {
        const updatedBuilding = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBuilding) return res.status(404).json({ message: 'Building not found' });
        res.status(200).json(updatedBuilding);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const deleteBuilding = async (req, res) => {
    try {
        const deletedBuilding = await Building.findByIdAndDelete(req.params.id);
        if (!deletedBuilding) return res.status(404).json({ message: 'Building not found' });
        res.status(200).json({ message: 'Building deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


