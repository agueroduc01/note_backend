import { firestore } from "../../configs/firestoreConfig";
import { getStorage, listAll, deleteObject, ref } from "firebase/storage";
import { firebaseApp } from "../../configs/firebaseConfig";
const deleteNoteService = async (noteId, uid) => {
  try {
    const noteRef = firestore.collection("notes").doc(noteId);
    const numberImages = (await noteRef.collection("images").get()).size;
    await firestore.recursiveDelete(noteRef);
    if (numberImages > 0) {
      const storage = getStorage(firebaseApp);
      const listRef = ref(storage, `images/${uid}/${noteId}`);
      const result = await listAll(listRef);
      const deleteImagesPromises = [];
      result.items.forEach((itemRef) => {
        deleteImagesPromises.push(deleteObject(itemRef));
      });
      await Promise.all(deleteImagesPromises);
    }

    return {};
  } catch (error) {
    console.error(`Delete note error: ${error}`);
    throw new Error("Delete note failed.");
  }
};

export default deleteNoteService;
