const mongoose = require("mongoose");
// mongoose.set('strictQuery', true);

const InvoiceSchema = new mongoose.Schema(
  {
    InvoiceID: { type: String, required: true, unique: true },
    OrderID: { type: String },
    CustomerID: { type: String },
    Products: { type: Array },
    SalesChannel: { type: String },
    Address: { type: String },
    TrackingID: { type: String },
    Total: { type: String },
    Date: { type: String },
    Tax: { type: String },
  },
  { collection: "all-Invoices" },
  { timestamps: true }
);

mongoose.models = {};
const Invoices = mongoose.model("Invoices", InvoiceSchema);
module.exports = Invoices;