import StatusCodes from "http-status-codes";
import { adminAuth } from "../configs/firestoreConfig";
import imageServices from "../services/imageServices";
import memberServices from "../services/memberServices";
import { validationResult } from "express-validator";

const getImageDetails = async(req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg
        }),
      });
    }
    const uid = req.user.uid;
    const { noteId, imageId } = req.query;
    const member = await memberServices.getMemberDetailsByUid(noteId, uid);
    if (!member) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "No permission.",
      })
    }
    const image = await imageServices.getImageDetails(noteId, imageId);
    if (!image) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found.",
      })
    }
    const user = await adminAuth.getUser(member.uid);
    return res.status(StatusCodes.OK).json({
      message: "Get image details successfully.",
      data: {
        ...image,
        user: {
          id: user.uid,
          fullName: user.displayName,
        }
      }
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
}

export default { getImageDetails };