import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    enum: ['手机', '平板', '电脑', '未知'],
    default: '未知'
  },
  deviceInfo: {
    type: String,
    maxlength: 500
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  lastActiveTime: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 创建复合索引
deviceSchema.index({ username: 1, deviceId: 1 }, { unique: true });
deviceSchema.index({ loginTime: -1 });

// 更新最后活跃时间
deviceSchema.methods.updateActivity = function() {
  this.lastActiveTime = new Date();
  return this.save();
};

const Device = mongoose.model('Device', deviceSchema);

export default Device;

