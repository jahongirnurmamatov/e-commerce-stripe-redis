import jwt from "jsonwebtoken";
import User from "../backend/models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized- no access token provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found!" });
      }

      req.user = user;
    } catch (error) {
        if(error.name==='TokenExpiredError'){
            return res.status(401).json({message:'Unauthorized - Access token expired'});
        }
        throw error;
    }

    next();
  } catch (error) {
    console.log("Error in protectRoute", error.message);
    res.status(500).json("Unauthorized - Invalid access token");
  }
};

export const adminRoute=(req,res,next)=>{
  console.log(req.user)
    if(req.user && req.user.role==='admin'){
        next();
    }else{
        return res.status(403).json({message:'Access denied - admin only!'});
    }
}
