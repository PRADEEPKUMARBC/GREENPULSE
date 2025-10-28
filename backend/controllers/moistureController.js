import Moisture from '../models/Moisture.js';

export const saveMoisture = async (status, raw) => {
  try {
    const doc = new Moisture({ status, raw });
    await doc.save();
    console.log('💾 Moisture saved to DB:', doc);
    return doc;
  } catch (err) {
    console.error('❌ Failed to save moisture:', err);
  }
};

export const getLatestMoisture = async (req, res) => {
  try {
    const latest = await Moisture.findOne().sort({ timestamp: -1 });
    res.json({ moisture: latest?.status ?? 'UNKNOWN' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch moisture' });
  }
};
