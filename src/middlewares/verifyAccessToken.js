import { adminAuth } from "../configs/firestoreConfig";
import { StatusCodes } from "http-status-codes";

const verifyAccessToken = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (
    !authorization ||
    authorization.split(" ")[0] !== "Bearer" ||
    authorization.split(" ")[1] === ""
  ) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid authorization token",
    });
  }
  let accessToken = authorization.split(" ")[1];
  req.user = {};
  adminAuth
    .verifyIdToken(accessToken)
    .then((decodedToken) => {
      req.user.uid = decodedToken.uid;
      next();
    })
    .catch((error) => {
      console.log("error from access token", error.message);
      return res.status(StatusCodes.FORBIDDEN).json({
        message: error.message,
      });
    });
};

export default verifyAccessToken