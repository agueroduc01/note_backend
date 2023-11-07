import { firestore } from "../../configs/firestoreConfig";
import imageServices from "../imageServices";
import constant from "../../utils/constant";
import { Note } from "../../models/models";

const getNoteDetailsService = async (noteId) => {
  try {
    const noteRef = firestore.collection("notes").doc(noteId);
    const [noteSnapshot, images] = await Promise.all([
      noteRef.get(),
      imageServices.getImages(noteId, 0, constant.MAX_INT),
    ]);

    if (!noteSnapshot.exists) {
      return null;
    }

    return new Note(noteSnapshot.id, 
      noteSnapshot.get("title"), 
      noteSnapshot.get("content"), 
      noteSnapshot.get("lastModified"),
      images
    )
  } catch (error) {
    console.error(`Get note details error: ${error}`);
    throw new Error("Get note details failed.");
  }
};

export default getNoteDetailsService;
