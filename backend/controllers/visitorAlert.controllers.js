import Visitor from '../models/visitorAlert.model.js';

// Create a new visitor alert
export const createVisitor = async (req, res) => {
  try {
    const { FlatNumber, visitorName, visitTime } = req.body;
    const newVisitor = new Visitor({ FlatNumber, visitorName, visitTime });
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all visitor alerts
export const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.status(200).json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single visitor alert by ID
export const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a visitor alert by ID
export const updateVisitor = async (req, res) => {
  try {
    const { FlatNumber, visitorName, visitTime } = req.body;
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, {
      FlatNumber,
      visitorName,
      visitTime,
    }, { new: true });

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a visitor alert by ID
export const deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};