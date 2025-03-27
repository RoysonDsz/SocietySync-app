import parkingModel from "../models/parking.model.js";

export const createParking = async (req, res) => {
    try {
        const { vehicleNumber, residentName, residentNumber, slotNumber } = req.body;
        const newParking = new parkingModel({
            vehicleNumber,
            residentName,
            residentNumber,
            slotNumber,
            status : "Occupied"
        });
        const savedParking = await newParking.save();
        res.status(201).json(savedParking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllParkings = async (req, res) => {
    try {
        const parkings = await parkingModel.find().sort({ createdAt: -1 });
        res.json(parkings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSingleParking = async (req, res) => {
    try {
        const parking = await parkingModel.findById(req.params.id);
        if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
        res.json(parking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateParking = async (req, res) => {
    try {
        const parking = await parkingModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
        res.json(parking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteParking = async (req, res) => {
    try {
        const parking = await parkingModel.findByIdAndDelete(req.params.id);
        if (!parking) return res.status(404).json({ message: 'Parking entry not found' });
        res.json({ message: 'Parking entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};