import 'dotenv/config';
import jwt from 'jsonwebtoken';
import complaintModel from '../models/complaint.model.js';
import signupModel from '../models/signup.model.js';

const JWT = process.env.JWT_SECRET;

const postComplaint = async(req, res) =>{
    const { complaint } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(403).json({
            success: true,
            message: "Unauthorized"
        });
    }
    try {
        const { id } = jwt.verify(token, JWT);
        if(!id){
            return res.status(403).json({
                success: true,
                message: "Invalid id"
            });
        }
        const user = await signupModel.findById(id);
        if(!user){
            return res.status(403).json({
                success: true,
                message: "Unauthorized"
            });
        }
        const response = new complaintModel({
            id: user.id,
            name: user.name,
            role: user.role,
            complaint
        });
        await response.save();
        res.status(201).json({
            success: true,
            message: "Complaint posted",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
        console.log(error)
    }
};

const getAllComplaints = async(req, res) =>{
    try {
        const response = await complaintModel.find().sort({ createdAt: -1 });
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Complaint not found",
            });
        };
        res.status(200).json({
            success: true,
            message: "All Complaints",
            response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
        console.log(error);
    }
}

const getComplaintById = async(req, res) =>{
    try {
        const response = await complaintModel.findById(req.params.id);
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Not foudn",
            });
        };
        res.status(200).json({
            success: true,
            message: "Complaint",
            response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Sever error",
        });
        console.log(error);
    }
};

const ownComplaints = async(req, res) =>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        })
    }
    try {
        const { id } = jwt.verify(token, JWT);
        if(!id){
            return res.status(404).json({
                success: false,
                message: "Invalid id"
            })
        }
        const response = await complaintModel.find({id});
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Complaints not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Complaints",
            response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error);
    }
}

const deleteComplaints = async(req, res) =>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        })
    }
    try {
        const { id } = jwt.verify(token, JWT);
        if(!id){
            return res.status(404).json({
                success: false,
                message: "Invalid id"
            })
        }
        const response = await complaintModel.findByIdAndDelete(id);
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Complaints not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Complaints Deleted "
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
        console.log(error);
    }
}

export { deleteComplaints, getAllComplaints, getComplaintById, ownComplaints, postComplaint };

