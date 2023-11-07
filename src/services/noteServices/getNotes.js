import { firestore } from "../../configs/firestoreConfig";
import imageServices from "../imageServices";
import constant from "../../utils/constant";
import { Note } from "../../models/models";

const getNotesService = async (uid) => {
  try {
    const querySnapshot = await firestore
      .collectionGroup("members")
      .where("uid", "==", uid)
      .get();

    const promises = querySnapshot.docs.map(async (document) => {
      const noteSnapshot = await document.ref.parent.parent.get();
      const images = await imageServices.getImages(noteSnapshot.id, 0 , constant.MAX_INT);
      const note = new Note(noteSnapshot.id,
        noteSnapshot.get("title"),
        noteSnapshot.get("content"),
        noteSnapshot.get("lastModified"),
        images
      );
      return note;
    });
    
    // Wait
    const notes = await Promise.all(promises);
    return notes;
  } catch (error) {
    console.error(`Get notes error: ${error}`);
    throw new Error("Get notes failed.");
  }
};

export default getNotesService;
