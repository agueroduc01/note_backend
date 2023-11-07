const { firestore } = require("../../configs/firestoreConfig");
import { Note } from "../../models/models";
import constant from "../../utils/constant";
import imageServices from "../imageServices";

const searchNotesService = async (keySearch, uid) => {
  try {
    const querySnapshot = await firestore
      .collectionGroup("members")
      .where("uid", "==", uid)
      .get();

    const notePromises = querySnapshot.docs.map(async (document) => {
      const noteSnapshot = await document.ref.parent.parent.get();
      const images = await imageServices.getImages(noteSnapshot.id, 0, constant.MAX_INT);
      const note = new Note(noteSnapshot.id,
        noteSnapshot.get("title"),
        noteSnapshot.get("content"),
        noteSnapshot.get("lastModified"),
        images
      );
      return note;
    });

    // Wait
    let notes = await Promise.all(notePromises);
    
    // Filter by key search
    notes = notes.filter((note) => note.title.includes(keySearch) || note.content.includes(keySearch));

    return notes;
  } catch (error) {
    console.error(`Search notes error: ${error}`);
    throw new Error("Search notes failed.");
  }
};

module.exports = searchNotesService;
