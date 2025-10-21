import mongoose from 'mongoose';

const registrationRequestSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  contactInfo: {
    type: String,
    trim: true,
    maxlength: 200
  },
  reason: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: String
  },
  rejectionReason: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// 创建索引
registrationRequestSchema.index({ username: 1, status: 1 });
registrationRequestSchema.index({ submittedAt: -1 });

const RegistrationRequest = mongoose.model('RegistrationRequest', registrationRequestSchema);

export default RegistrationRequest;

