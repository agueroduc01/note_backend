import { plainToClass } from "class-transformer";
import { firestore } from "../../configs/firestoreConfig";
import { Image } from "../../models/models";

const getImagesService = async (noteId, pageIndex, limit) => {
  try {
    const noteRef = firestore.collection("notes").doc(noteId);
    const images = (
      await noteRef
        .collection("images")
        .orderBy("uploadTime")
        .offset(pageIndex * limit)
        .limit(limit)
        .get()
    ).docs.map((imageSnapshot) => {
      return new Image(imageSnapshot.id,
        imageSnapshot.get("name"),
        imageSnapshot.get("url"),
        imageSnapshot.get("uploadTime"),
        imageSnapshot.get("uploadBy")
      );
    });
    return images;
  } catch (error) {
    console.error(`Get images error: ${error}`);
    throw new Error("Get images failed.");
  }
};

module.exports = getImagesService;
