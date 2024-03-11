
import Customers from "@/model/Customers";
import connectDb from "../../middleware/mongoose";
import { parse } from "cookie";
import jwt from "jsonwebtoken";


const handler = async (req, res) => {
  if (req.method == "POST") {
    try {
              const cookies = parse(req.headers.cookie || "");
              const token = cookies.admin_access_token;
              let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
              if (!decoded._id==process.env.ADMIN_PASSWORD) {
                return res
                  .status(403)
                  .json({ success: false, errors: "Unable to Authenticate" });
              }
      console.log(req.body);

      const existingCard = await Customers.findOne({ CustomerID: req.body.CustomerID });

      if (existingCard) {
        // If cardID already exists, return an error response
        return res.status(400).json({ success: false, msg: "Customer ID already exists." });
      }

      const newCard = new Customers({
        CustomerID: req.body.CustomerID,
        CustomerName: req.body.CustomerName,
        CustomerPhone: req.body.CustomerPhone,
        CustomerEmail: req.body.CustomerEmail,
      });

      await newCard.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: "Customer Added Successfuly.." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: "Server error..Contact the Developers." });
    }
  }
};

export default connectDb(handler);