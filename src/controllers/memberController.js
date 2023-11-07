import { StatusCodes } from "http-status-codes";
import { adminAuth } from "../configs/firestoreConfig";
import memberServices from "../services/memberServices";
import noteServices from "../services/noteServices";
import { MemberDto } from "../dto/MemberDto";
import { validationResult } from "express-validator";
import { OWNER_ROLE } from "../utils/constant";

const addMember = async (req, res) => {
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
    const { noteId } = req.query;
    const { email, role } = req.body;
    const user = await adminAuth.getUserByEmail(email);
    if (user.uid == uid) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "You can not add yourself.",
      });
    }
    if (!user.emailVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "This user haven't verify email yet.",
      });
    }
    let member = await memberServices.getMemberDetailsByUid(noteId, user.uid);
    if (member != null) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "This member already exists.",
      });
    }
    const memberDto = new MemberDto(role, false, user.uid);
    member = await memberServices.addMember(noteId, memberDto);
    return res.status(StatusCodes.OK).json({
      message: "Add member successfully.",
      data: {
        id: member.id,
        role: member.role,
        fullName: user.displayName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const editMember = async (req, res) => {
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
    const { noteId, memberId } = req.query;
    const { role } = req.body;
    const currentMember = await memberServices.getMemberDetailsByUid(
      noteId,
      uid
    );
    if (currentMember == null || currentMember.role != OWNER_ROLE || currentMember.id == memberId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "No permission.",
      });
    }

    let member = await memberServices.getMemberDetails(noteId, memberId);
    if (member == null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Member does not exist.",
      });
    }
    // Create member dto
    const memberDto = new MemberDto(role, member.isPin, member.uid);
    // Update
    member = await memberServices.editMember(noteId, memberId, memberDto);

    // Get profile of member
    const user = await adminAuth.getUser(member.uid);
    return res.status(StatusCodes.OK).json({
      message: "Edit member successfully.",
      data: {
        id: member.id,
        fullName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: member.role,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const deleteMember = async (req, res) => {
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
    const { noteId, memberId } = req.query;
    const currentMember = await memberServices.getMemberDetailsByUid(
      noteId,
      uid
    );
    if (currentMember == null) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "No permission.",
      });
    }
    const deletingMember = await memberServices.getMemberDetails(
      noteId,
      memberId
    );
    if (deletingMember == null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Deleting member does not exists.",
      });
    }
    const isOwner = currentMember.role == OWNER_ROLE;
    if (isOwner && currentMember.role == deletingMember.role) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Owner can not be deleted.",
      });
    }
    if (isOwner) {
      await memberServices.deleteMember(noteId, memberId);
    } else {
      await memberServices.deleteMember(noteId, currentMember.id);
    }
    return res.status(StatusCodes.OK).json({
      message: "Delete member successfully.",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getMembers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg
        }),
      });
    }
    const { noteId, pageIndex, limit } = req.query;
    const result = await memberServices.getMembers(
      noteId,
      pageIndex,
      limit
    );
    const promises = result.data.map(async (member) => {
      const user = await adminAuth.getUser(member.uid);
      return {
        id: member.id,
        fullName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: member.role,
      };
    });
    // Wait
    result.data = await Promise.all(promises);
    return res.status(StatusCodes.OK).json({
      message: "Get members successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getMemberDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg
        }),
      });
    }
    const { noteId, memberId } = req.query;
    const member = await memberServices.getMemberDetails(noteId, memberId);
    const user = await adminAuth.getUser(member.uid);
    return res.status(StatusCodes.OK).json({
      id: member.id,
      fullName: user.displayName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: member.role,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const updatePin = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { noteId } = req.query;
    const { isPin } = req.body;
    if (!noteId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg
        }),
      });
    }
    const note = await noteServices.getNoteDetails(noteId);
    if (note == null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Note does not exists.",
      });
    }
    let member = await memberServices.getMemberDetailsByUid(noteId, uid);
    if (member == null) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "No permission.",
      });
    }
    member.isPin = isPin === "true";
    member = await memberServices.updatePin(note, member);
    return res.status(StatusCodes.OK).json({
      message: "Update pin successfully.",
      data: isPin,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default {
  addMember,
  editMember,
  deleteMember,
  getMembers,
  getMemberDetails,
  updatePin,
};
