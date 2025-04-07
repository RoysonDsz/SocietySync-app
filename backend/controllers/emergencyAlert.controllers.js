import Alert from '../models/emergencyAlert.model.js';

export const createAlert = async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAlerts = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const alerts = await Alert.find(filter).sort({ timestamp: -1 });
  res.json(alerts);
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejectReason } = req.body;

  try {
    const alert = await Alert.findByIdAndUpdate(id, {
      status,
      rejectReason: status === 'rejected' ? rejectReason : undefined
    }, { new: true });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
