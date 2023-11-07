// This code implements the logic for a login service.

// Importing necessary modules and functions from firebase/auth and firebaseConfig
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../../configs/firebaseConfig";
import { StatusCodes } from "http-status-codes";

// Defining the loginService function which handles the login logic
const loginService = async (userInput) => {
  // Logging the request userInput
  console.log("userInput from login", userInput);

  // Checking if the email and password are present in the request body
  if (!(userInput.email && userInput.password)) {
    // Responding with a 400 Bad Request error if either the email or password is missing
    return {
      message: "All inputs are required.",
      data: null,
      code: StatusCodes.BAD_REQUEST,
    };
  }

  // Wrapping the logic in a try-catch block
  try {
    // Signing in the user with the provided email and password using firebaseAuth
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      userInput.email,
      userInput.password
    );

    // Destructuring the user object from the credential
    const user = credential.user;

    // Checking if the email is verified
    if (!user.emailVerified) {
      // Responding with a 403 Forbidden error if the email is not verified
      return {
        message: "Email not verified.",
        data: null,
        code: StatusCodes.FORBIDDEN,
      };
    }

    // Responding with a 200 OK status code and the refreshToken if the login is successful
    let refreshToken = user.refreshToken;
    return {
      message: "Login successfully.",
      refreshToken,
      code: StatusCodes.OK,
    };
  } catch (error) {
    // Logging the error
    console.log("error from login", error.message);

    // Responding with a 401 Unauthorized error if the login fails
    return {
      message: "Email or password is incorrect.",
      data: null,
      code: StatusCodes.UNAUTHORIZED,
    };
  }
};

// Exporting the loginService function
export default loginService;
