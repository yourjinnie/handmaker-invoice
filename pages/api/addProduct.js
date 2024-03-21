import { parse } from "cookie";
import jwt from "jsonwebtoken";
import Products from "@/model/Products";
import connectDb from "../../middleware/mongoose";

// Function to generate product ID in series
const generateProductID = async () => {
  // Find the count of existing products
  const count = await Products.countDocuments();
  // Generate the next product ID based on the count
  const nextID = `P${(count + 1).toString().padStart(3, "0")}`;
  return nextID;
};

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

      // Generate the next product ID
      const nextProductID = await generateProductID();

      const existingProduct = await Products.findOne({ ProductID: nextProductID });

      if (existingProduct) {
        // If productID already exists, return an error response
        return res.status(400).json({ success: false, msg: "Product ID already exists." });
      }

      const newProduct = new Products({
        ProductID: nextProductID,
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        ProductStock: req.body.ProductStock,
      });

      await newProduct.save();
      console.log("okay");
      return res.status(200).json({ success: true, msg: "Product Added Successfully." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, msg: "Server error. Contact the Developers." });
    }
  }
};

export default connectDb(handler);
