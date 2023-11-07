import { StatusCodes } from "http-status-codes";
import { firebaseAuth } from "../../configs/firebaseConfig";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { adminAuth } from "../../configs/firestoreConfig";

const changePasswordService = async (userInput) => {
  try {
    let user = await adminAuth.getUser(userInput.uid);
    let credential = await signInWithEmailAndPassword(
      firebaseAuth,
      user.email,
      userInput.oldPassword
    );
    user = credential.user;
    if (user && credential) {
      await updatePassword(user, userInput.newPassword);
      let credentialNew = await signInWithEmailAndPassword(
        firebaseAuth,
        user.email,
        userInput.newPassword
      );
      let userNew = credentialNew.user;
      return {
        message: "Successfully change user's password",
        refreshToken: userNew.refreshToken,
        code: StatusCodes.OK,
      };
    }
  } catch (error) {
    console.log("error change password", error.message);
    return {
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }
};

export default changePasswordService;
