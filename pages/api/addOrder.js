
import Customers from "@/model/Customers";
import connectDb from "../../middleware/mongoose";
import Orders from "@/model/Orders";
import { parse } from "cookie"; import jwt from "jsonwebtoken";


const handler = async (req, res) => {

  if (req.method == "POST") {
    try {
      const cookies = parse(req.headers.cookie || "");
      const token = cookies.admin_access_token;
      let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
      if (!decoded._id == process.env.ADMIN_PASSWORD) {
        return res
          .status(403)
          .json({ success: false, errors: "Unable to Authenticate" });
      }
      console.log(req.body);

      const existingCard = await Orders.findOne({ OrderID: req.body.OrderID });
      const checkCustomer = await Customers.findOne({ CustomerID: req.body.CustomerID });

      if (existingCard) {
        // If cardID already exists, return an error response
        return res.status(400).json({ success: false, msg: "Order ID already exists." });
      }
      if (!checkCustomer) {
        // If cardID already exists, return an error response
        return res.status(400).json({ success: false, msg: "Customer not found" });
      }

      const newCard = new Orders({
        OrderID: req.body.OrderID,
        CustomerID: req.body.CustomerID,
        Status: req.body.TrackingStatus,
        Products: req.body.Products,
        SalesChannel: req.body.SalesChannel,
        Address: req.body.Address,
        Pincode: req.body.Pincode,
        TrackingID: req.body.TrackingID,
        PaymentID: req.body.PaymentID,
        TaxType : req.body.TaxType,
        GST : req.body.GST,
        Total: req.body.Total,
      });

      await newCard.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: "Order Added Successfuly.." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: "Server error..Contact the Developers." });
    }
  }
};

export default connectDb(handler);