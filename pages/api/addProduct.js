
import { parse } from "cookie";  import jwt from "jsonwebtoken";
import Products from "@/model/Products";
import connectDb from "../../middleware/mongoose";


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

      const existingCard = await Products.findOne({ ProductID: req.body.ProductID });

      if (existingCard) {
        // If cardID already exists, return an error response
        return res.status(400).json({ success: false, msg: "Product ID already exists." });
      }

      const newCard = new Products({
        ProductID: req.body.ProductID,
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        ProductStock: req.body.ProductStock,
      });

      await newCard.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: "Product Added Successfuly.." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: "Server error..Contact the Developers." });
    }
  }
};

export default connectDb(handler);