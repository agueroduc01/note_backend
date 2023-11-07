import { firestore } from "../../configs/firestoreConfig";
import imageServices from "../imageServices";
import constant from "../../utils/constant";
import { Note } from "../../models/models";

const addNoteService = async (noteDto, memberDto, files) => {
  try {
    // Batch using to write with atomic (transaction)
    const batch = firestore.batch();
    const newNoteRef = firestore.collection("notes").doc();
    const newMemberRef = newNoteRef.collection("members").doc();

    batch.create(newNoteRef, noteDto.json());
    batch.create(newMemberRef, memberDto.json());
    const imageCollectionRef = newNoteRef.collection("images");
    if (files && files.images) {
      const imagesDto = await imageServices.uploadImages(
        newNoteRef.id,
        memberDto,
        files.images
      );
      if (imagesDto) {
        imagesDto.forEach((imageDto) => {
          batch.create(imageCollectionRef.doc(), imageDto.json());
        });
      }
    }

    await batch.commit();

    const images = await imageServices.getImages(
      newNoteRef.id,
      0,
      constant.MAX_INT
    );

    return new Note(
      newNoteRef.id,
      noteDto.title,
      noteDto.content,
      noteDto.lastModified,
      images
    );
  } catch (error) {
    console.error(`Add note error: ${error}`);
    throw new Error("Add note failed.");
  }
};

export default addNoteService;
