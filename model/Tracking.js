const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const Trackingchema = new mongoose.Schema(
  {
    OrderID: { type: String, required: true, unique: true },
    TrackingID: { type: String },
    TrackingCost: { type: String },
    trackingUrl: { type: String },
    TrackingStatus: { type: String },
    TrackingCourier: { type: String },
  },
  { collection: "all-Tracking" },
  { timestamps: true }
);

mongoose.models = {};
const Tracking = mongoose.model("Tracking", Trackingchema);
module.exports = Tracking;