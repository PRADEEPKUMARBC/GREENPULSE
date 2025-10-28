import mongoose from 'mongoose';

const moistureSchema = new mongoose.Schema({
  status: { type: String, required: true },  // DRY, WET, etc.
  raw: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Moisture = mongoose.model('Moisture', moistureSchema);
export default Moisture;
