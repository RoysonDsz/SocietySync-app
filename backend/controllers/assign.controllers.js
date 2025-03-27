import assignModel from "../models/assign.model.js";
import signupModel from "../models/signup.model.js";

const errorResponse = (res, status, message) => {
    return res.status(status).json({ success: false, message });
};

const getResidentsForBuilding = async (req, res) => {
    const { id } = req.params;

    try {
        const assignedResidents = await assignModel.findById(id).distinct('residentEmail');
        const residents = await signupModel.find({ 
            email: { $nin: assignedResidents }
        }).select('name email phoneNumber -_id');

        res.status(200).json({
            success: true,
            data: residents
        });
    } catch (error) {
        console.error("Error fetching residents:", error);
        errorResponse(res, 500, "Server error fetching residents");
    }
};

const assignFlat = async (req, res) => {
    const { buildingNumber, residentEmail } = req.params;
    const { flatNumber } = req.body;

    try {
        const user = await signupModel.findOne({ email: residentEmail });
        if (!user) return errorResponse(res, 404, "Resident not found");

        const [existingFlat, existingAssignment] = await Promise.all([
            assignModel.findOne({ buildingNumber, flatNumber }),
            assignModel.findOne({ residentEmail })
        ]);

        if (existingFlat) return errorResponse(res, 400, "Flat already occupied");
        if (existingAssignment) return errorResponse(res, 400, "Resident already has a flat assigned");

        const newAssignment = await assignModel.create({
            residentName: user.name,
            residentEmail: user.email,
            residentNumber: user.phoneNumber,
            buildingNumber,
            flatNumber
        });

        res.status(201).json({
            success: true,
            message: "Flat assigned successfully",
            data: newAssignment
        });

    } catch (error) {
        console.error("Assignment error:", error);
        errorResponse(res, 500, "Server error during assignment");
    }
};

// Get all assigned residents
const getAllResidents = async (req, res) => {
    try {
        const residents = await assignModel.find();
        res.status(200).json({
            success: true,
            count: residents.length,
            data: residents
        });
    } catch (error) {
        errorResponse(res, 500, "Server error fetching residents");
    }
};

// Get single resident by ID
const getResidentById = async (req, res) => {
    const { id } = req.params;
    
    if (!id) return errorResponse(res, 400, "Invalid ID");

    try {
        const resident = await assignModel.findById(id);
        if (!resident) return errorResponse(res, 404, "Resident not found");
        
        res.status(200).json({
            success: true,
            data: resident
        });
    } catch (error) {
        errorResponse(res, 500, "Server error");
    }
};

// Delete resident assignment
const deleteResidentById = async (req, res) => {
    const { id } = req.params;

    if (!id) return errorResponse(res, 400, "Invalid ID");

    try {
        const resident = await assignModel.findByIdAndDelete(id);
        if (!resident) return errorResponse(res, 404, "Resident not found");
        
        res.status(200).json({
            success: true,
            message: "Resident assignment removed"
        });
    } catch (error) {
        errorResponse(res, 500, "Server error");
    }
};

// Update resident assignment
const updatedResident = async (req, res) => {
    const { id } = req.params;
    const { flatNumber, buildingNumber } = req.body;

    if (!id) return errorResponse(res, 400, "Invalid ID");

    try {
        const existingAssignment = await assignModel.findById(id);
        if (!existingAssignment) return errorResponse(res, 404, "Resident not found");

        // Check for flat availability
        if (flatNumber && buildingNumber) {
            const occupiedFlat = await assignModel.findOne({
                buildingNumber,
                flatNumber,
                _id: { $ne: id }
            });
            
            if (occupiedFlat) {
                return errorResponse(res, 400, "New flat is already occupied");
            }
        }

        const updates = {};
        if (flatNumber) updates.flatNumber = flatNumber;
        if (buildingNumber) updates.buildingNumber = buildingNumber;

        const updatedResident = await assignModel.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedResident
        });
    } catch (error) {
        errorResponse(res, 500, "Server error");
    }
};

export {
    assignFlat,
    deleteResidentById,
    getAllResidents,
    getResidentById,
    getResidentsForBuilding,
    updatedResident
};
