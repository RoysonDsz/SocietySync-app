import 'dotenv/config';
import visitorAlert from '../models/visitor.model.js';

const JWT = process.env.JWT_SECRET;

const createVisitor = async(req, res) => {
    try {
        const { visitorName, flatNumber, visitorPhoneNumber, purpose, additionalNotes, buildingNumber } = req.body;
        
        if(!visitorName || !flatNumber || !visitorPhoneNumber || !purpose || !buildingNumber){
            return res.status(400).json({
                success: false,
                message: "Please enter all the required details"
            });
        }
        
        const response = new visitorAlert({
            visitorName,
            flatNumber,
            visitorPhoneNumber,
            purpose,
            additionalNotes: additionalNotes || '',
            status: 'checked-in',
            buildingNumber,
            visitTime: new Date() // Set current date/time for visitTime
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
        const response = await visitorAlert.find().sort({ createdAt : -1 });
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Empty model"
            });
        }
        res.status(200).json({
            success: true,
            message: "Visitor data retrieved",
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

const getVisitorById = async(req, res) =>{
    const { id } = req.params;
    try {
        const response = await visitorAlert.findById(id);
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

// Add check-out functionality
const checkOutVisitor = async(req, res) =>{
    const { id } = req.params;
    try {
        const visitor = await visitorAlert.findById(id);
        
        if(!visitor){
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }
        
        // Update the visitor status to checked-out and set checkOut time
        visitor.status = 'checked-out';
        visitor.checkOut = new Date();
        
        await visitor.save();
        
        res.status(200).json({
            success: true,
            message: "Visitor checked out successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error);
    }
};

const deleteVisitor = async (req, res) => {
    const { id } = req.params;
    try {
      const response = await visitorAlert.findByIdAndDelete(id);
      if (!response) {
        return res.status(404).json({
          success: false,
          message: "Visitor not found"
        });
      }
      res.status(200).json({
        success: true,
        message: "Visitor data deleted"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error"
      });
      console.log(error);
    }
  };
  

export { createVisitor, deleteVisitor, getAllVisitor, getVisitorById, checkOutVisitor };