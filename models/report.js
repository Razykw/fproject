const mongoose = require('mongoose');

const { Schema } = mongoose;

const reportSchema = new Schema({
  type: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
