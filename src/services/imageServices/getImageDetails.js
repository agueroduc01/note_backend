import { firestore } from "../../configs/firestoreConfig";
import { Image } from "../../models/models";

const getImageDetails = async (noteId, imageId) => {
  const imageSnapshot = await firestore
    .collection("notes")
    .doc(noteId)
    .collection("images")
    .doc(imageId)
    .get();
  if (!imageSnapshot.exists) {
    return null;
  }
  return new Image(imageSnapshot.id,
    imageSnapshot.get("name"),
    imageSnapshot.get("url"),
    imageSnapshot.get("uploadTime"),
    imageSnapshot.get("uploadBy")
  );
};

export default getImageDetails;