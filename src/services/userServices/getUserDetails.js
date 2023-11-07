import { StatusCodes } from "http-status-codes";
import { adminAuth } from "../../configs/firestoreConfig";

const getUserDetailsService = async (uid) => {
  try {
    let user = await adminAuth.getUser(uid);
    if (!user) {
      return {
        message: "User not found",
        code: StatusCodes.UNAUTHORIZED,
        user: {},
      };
    }
    user = {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName,
      phoneNumber: user.phoneNumber,
    };
    return {
      message: "Get user details successfully",
      user,
      code: StatusCodes.OK,
    };
  } catch (error) {
    console.log("error getting user details", error.message);
    return {
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      user: user ? user : {},
    };
  }
};

export default getUserDetailsService