import 'dotenv/config';
import jwt from 'jsonwebtoken';
import eventModel from '../models/event.model.js';
import signupModel from '../models/signup.model.js';

const JWT = process.env.JWT_SECRET;

const createEvent = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        });
    };
    try {

        const { id } = jwt.verify(token, JWT);
        if(!id){
            return res.status(404).json({
                success: false,
                message: "Invalid id"
            });
        };

        const user = await signupModel.findById(id);

        const { residentNumber, date, time, purpose } = req.body;
        const newEvent = new eventModel({
            id: user.id,
            residentNumber,
            residentName : user.name,
            date,
            time,
            purpose
        });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.find().sort({ date: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const getSingleEvent = async (req, res) => {
    try {
        const event = await eventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const updateEvent = async (req, res) => {
    try {
        const event = await eventModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const deleteEvent = async (req, res) => {
    try {
        const event = await eventModel.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOwnEvent = async(req, res) =>{
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(403).json({
            success: false,
            message: "Invalid token"
        });
    };
    try {
        const { id } = jwt.verify(token, JWT);
        if(!id){
            return res.status(404).json({
                success: false,
                message: "Invalid token"
            });
        };
        const response = await eventModel.find({id});
        if(!response){
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        };
        res.status(200).json({
            success: true,
            message: "Event",
            response
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    };
};

export { createEvent, deleteEvent, getAllEvents, getOwnEvent, getSingleEvent, updateEvent };
