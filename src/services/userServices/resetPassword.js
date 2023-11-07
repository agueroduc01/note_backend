import { firebaseAuth } from "../../configs/firebaseConfig";
import { confirmPasswordReset } from "firebase/auth";
import { StatusCodes } from "http-status-codes";

const resetPasswordService = async (codeVerifyInput, newPassword) => {
  try {
    await confirmPasswordReset(firebaseAuth, codeVerifyInput, newPassword);
    return {
      message: "Your password has been reset successfully",
      code: StatusCodes.OK,
    };
  } catch (error) {
    console.log("error reseting password", error.message);
    return {
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

export default resetPasswordService;
