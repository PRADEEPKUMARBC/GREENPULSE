import mongoose from 'mongoose';

const irrigationEventSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'default-user'
  },
  zone: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // minutes
    required: true
  },
  waterUsed: {
    type: Number, // liters
    required: true
  },
  aiRecommended: {
    type: Boolean,
    default: false
  },
  aiConfidence: {
    type: Number
  },
  sensorData: {
    soilMoisture: Number,
    temperature: Number,
    humidity: Number
  },
  reason: String,
  hardwareCommand: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['started', 'completed', 'failed'],
    default: 'started'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
irrigationEventSchema.index({ timestamp: -1 });
irrigationEventSchema.index({ zone: 1 });
irrigationEventSchema.index({ userId: 1 });

const IrrigationEvent = mongoose.model('IrrigationEvent', irrigationEventSchema);

export default IrrigationEvent;