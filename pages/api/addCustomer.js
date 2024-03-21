import Customers from "@/model/Customers";
import connectDb from "../../middleware/mongoose";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

// Function to generate customer ID in series
const generateCustomerID = async () => {
  // Find the count of existing customers
  const count = await Customers.countDocuments();
  // Generate the next customer ID based on the count
  const nextID = `C${(count + 1).toString().padStart(3, "0")}`;
  return nextID;
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const cookies = parse(req.headers.cookie || "");
      const token = cookies.admin_access_token;
      let decoded = await jwt.verify(token, process.env.TOKEN_ADMIN);
      if (!decoded._id === process.env.ADMIN_PASSWORD) {
        return res
          .status(403)
          .json({ success: false, errors: "Unable to Authenticate" });
      }

      console.log(req.body);

      // Generate the next customer ID
      const nextCustomerID = await generateCustomerID();

      const newCard = new Customers({
        CustomerID: nextCustomerID,
        CustomerName: req.body.CustomerName,
        CustomerPhone: req.body.CustomerPhone,
        CustomerEmail: req.body.CustomerEmail,
      });

      await newCard.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: "Customer Added Successfully." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: "Server error. Contact the Developers." });
    }
  }
};

export default connectDb(handler);
