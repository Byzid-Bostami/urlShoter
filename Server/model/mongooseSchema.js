const mongoose = require('mongoose');
const shortid = require('shortid');

// URL Schema
const urlSchema = new mongoose.Schema(
  {user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
    originalUrl: {
      type: String,
      required: true, 
      trim: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
      default: shortid.generate,
    },
    qrCode: {
      type: String,
      required: true,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    
  },
  { timestamps: true }
);


urlSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('shortUrl')) {
    while (true) {
      const existing = await mongoose.models.URL.findOne({ shortUrl: this.shortUrl });
      if (!existing) break;
      this.shortUrl = shortid.generate();
    }
  }
  next();
});


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /.+@.+\..+/,
  },
  password: {
    type: String,
    required: true,
  },
});

// Models
const urlModel = mongoose.model('URL', urlSchema);
const userModel = mongoose.model('User', userSchema);

// Export Models
module.exports = { urlModel, userModel };
