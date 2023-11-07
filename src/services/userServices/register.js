// This code implements the logic for a register service.

// Import firebase authentication functions and StatusCodes utils
import {
  sendEmailVerification,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "../../configs/firebaseConfig";
import { adminAuth } from "../../configs/firestoreConfig";

// Define the registerService function
const registerService = async (newUser) => {
  // Create a new user with email and password
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    newUser.email,
    newUser.password
  );
  const user = credential.user;

  // Update the user profile with displayName and phoneNumber
  await adminAuth.updateUser(user.uid, {
    displayName: newUser.fullName,
    phoneNumber: `+84${newUser.phoneNumber.substring(1)}`,
  });

  // Send email verification to the new user
  await sendEmailVerification(user);
};

// Export the registerService function
export default registerService;
