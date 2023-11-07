import { adminAuth } from "../../configs/firestoreConfig";
import { StatusCodes } from "http-status-codes";
import { parseActionCodeURL } from "firebase/auth";
import { transporter, hostEmail } from "../../utils/mailer";

const forgetPasswordService = async (emailInput) => {
  try {
    let link = await adminAuth.generatePasswordResetLink(emailInput);
    // send mail
    const code = parseActionCodeURL(link).code;
    const mailOptions = {
      from: hostEmail,
      to: emailInput,
      subject: "You have a code for resetting your password",
      text: `Your code is ${code}\nHaving a good experience with NoteApp <3`,
    };
    let { response } = await transporter.sendMail(mailOptions);
    if (response) {
      console.log("Email sent: " + response);
      // verify code service
      // create new password service
      return {
        codeVerify: code,
        message: "Send mail successfully",
        code: StatusCodes.OK,
      };
    } else {
      console.log("error send mail", error);
      return {
        codeVerify: null,
        message: error,
        code: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  } catch (error) {
    console.log("error forget password service", error.message);
    return { message: error.message, code: StatusCodes.INTERNAL_SERVER_ERROR };
  }
};

export default forgetPasswordService;
