import { StatusCodes } from "http-status-codes";
import { Member, Note } from "../models/models";
import { NoteDto } from "../dto/NoteDto";
import { MemberDto } from "../dto/MemberDto";
import noteServices from "../services/noteServices";
import memberServices from "../services/memberServices";
import { validationResult } from "express-validator";

const addNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg;
        }),
      });
    }
    const uid = req.user.uid;
    const { title, content, isPin } = req.body;
    const isArchived = false;
    const isRemoved = false;
    const noteDto = new NoteDto(title, content, Date.now());
    const memberDto = new MemberDto(
      "owner",
      isPin === "true",
      uid,
      isArchived,
      isRemoved
    );
    const files = req.files;
    const note = await noteServices.addNote(noteDto, memberDto, files);
    const member = await memberServices.getMemberDetailsByUid(note.id, uid);
    return res.status(StatusCodes.OK).json({
      message: "Add note successfully.",
      data: {
        ...note,
        isPin: member.isPin,
        role: member.role,
        isArchived,
        isRemoved,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const editNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg;
        }),
      });
    }
    const uid = req.user.uid;
    const { id } = req.query;
    const { title, content, isPin, isArchived, isRemoved } = req.body;
    const deleteImageIds = JSON.parse(
      req.body.deleteImageIds ? req.body.deleteImageIds : "[ ]"
    );
    const currentMember = await memberServices.getMemberDetailsByUid(id, uid);
    if (currentMember.role == "viewer") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "No permission.",
      });
    }
    currentMember.isPin = isPin === "true";
    currentMember.isArchived = isArchived === "true";
    currentMember.isRemoved = isRemoved === "true";
    const noteDto = new NoteDto(title, content, Date.now());
    const memberDto = new MemberDto(
      currentMember.role,
      currentMember.isPin,
      currentMember.uid,
      currentMember.isArchived,
      currentMember.isRemoved
    );

    const files = req.files;

    const note = await noteServices.editNote(
      id,
      noteDto,
      currentMember.id,
      memberDto,
      files,
      deleteImageIds
    );
    res.status(StatusCodes.OK).json({
      message: "Edit note successfully.",
      data: {
        ...note,
        isPin: currentMember.isPin,
        role: currentMember.role,
        isArchived: currentMember.isArchived,
        isRemoved: currentMember.isRemoved,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg;
        }),
      });
    }
    const uid = req.user.uid;
    const noteId = req.query.id;

    const currentMember = await memberServices.getMemberDetailsByUid(
      noteId,
      uid
    );
    if (currentMember.role != "owner") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "No permission.",
      });
    }

    // Call delete note service
    await noteServices.deleteNote(noteId, uid);

    res.status(StatusCodes.OK).json({
      message: "Delete note successfully.",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getNoteDetails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg;
        }),
      });
    }
    const uid = req.user.uid;
    const noteId = req.query.id;
    const note = await noteServices.getNoteDetails(noteId);
    const member = await memberServices.getMemberDetailsByUid(noteId, uid);
    res.status(StatusCodes.OK).json({
      message: "Get note details successfully.",
      data: {
        ...note,
        isPin: member.isPin,
        role: member.role,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const uid = req.user.uid;
    const notes = await noteServices.getNotes(uid);
    const dataPromises = notes.map(async (note) => {
      const member = await memberServices.getMemberDetailsByUid(note.id, uid);
      return {
        ...note,
        isPin: member.isPin,
        role: member.role,
        isArchived: member.isArchived,
        isRemoved: member.isRemoved,
      };
    });
    res.status(StatusCodes.OK).json({
      message: "Get notes successfully.",
      data: await Promise.all(dataPromises),
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const searchNotes = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: errors.array().map((error) => {
          return error.msg;
        }),
      });
    }
    const uid = req.user.uid;
    const keySearch = req.query.key;
    const notes = await noteServices.searchNotes(keySearch, uid);
    const dataPromises = notes.map(async (note) => {
      const member = await memberServices.getMemberDetailsByUid(note.id, uid);
      return {
        ...note,
        isPin: member.isPin,
        role: member.role,
      };
    });
    res.status(StatusCodes.OK).json({
      message: "Search notes successfully.",
      data: await Promise.all(dataPromises),
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default {
  addNote,
  editNote,
  deleteNote,
  getNoteDetails,
  getNotes,
  searchNotes,
};
