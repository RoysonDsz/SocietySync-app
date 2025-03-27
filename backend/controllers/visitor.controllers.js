import 'dotenv/config';
import visitorModel from '../models/visitor.model.js';

const JWT = process.env.JWT_SECRET;

const createVisitor = async(req, res) =>{
    try {
        const { visitorName, residentName, relation, flatNumber, visitorPhoneNumber, visitorVehicleNumber, purpose, checkIn, checkOut } = req.body;
        if(!visitorName || !residentName || !relation || !flatNumber || !visitorPhoneNumber || !visitorVehicleNumber || !purpose){
            return res.status(400).json({
                success: false,
                message: "Please enter all the details"
            })
        }
        const response = new visitorModel({
            visitorName, 
            residentName, 
            relation, 
            flatNumber, 
            visitorPhoneNumber, 
            visitorVehicleNumber, 
            purpose,
            checkIn,
            checkOut
        });
        await response.save();
        res.status(201).json({
            success: true,
            message: "Visitor data saved"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error);
    }
};

const getAllVisitor = async(req, res) =>{
    try {
        const response = await visitorModel.find().sort({ createdAt : -1 });
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Empty model"
            });
        }
        res.status(201).json({
            success: true,
            message: "Visitor data saved",
            response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error)
    }
}

const getVisitorById = async(req, res) =>{
    const { id } = req.params
    try {
        const response = await visitorModel.findById(id);
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Visitor data",
            response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error);
    }
};

const deleteVisitor = async(req, res) =>{
    const { id } = req.params;
    try {
        const response = await visitorModel.findByIdAndDelete(id);
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Visitor data Deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error);
    }
}

export { createVisitor, deleteVisitor, getAllVisitor, getVisitorById };
