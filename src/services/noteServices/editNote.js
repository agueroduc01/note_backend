import { ref, deleteObject, getStorage } from "firebase/storage";
import { firestore, FirebaseFirestore } from "../../configs/firestoreConfig";
import { firebaseApp } from "../../configs/firebaseConfig";
import imageServices from "../imageServices";
import constant from "../../utils/constant";
import { Image, Note } from "../../models/models";

const editNoteService = async (noteId, noteDto, memberId, memberDto, files, deleteImageIds) => {
  try {
    const noteRef = firestore.collection("notes").doc(noteId);
    const memberRef = noteRef.collection("members").doc(memberId);
    const imageCollectionRef = noteRef.collection("images");
    let deleteImages = [];
    if (deleteImageIds.length > 0) {
      deleteImages = (
        await imageCollectionRef
          .where(FirebaseFirestore.FieldPath.documentId(), "in", deleteImageIds)
          .get()
      ).docs.map((document) => {
        return new Image(document.id,
          document.get("name"),
          document.get("url"),
          document.get("uploadTime"),
          document.get("uploadBy")
        );
      });
    }

    const batch = firestore.batch();
    // Update note
    batch.update(noteRef, noteDto.json());
    // Update member
    batch.update(memberRef, memberDto.json());
    // Delete images
    if (deleteImages) {
      deleteImages.forEach(async (deleteImage) => {
        const imageRef = imageCollectionRef.doc(deleteImage.id);
        batch.delete(imageRef);
      });
    }
    // Add images
    if (files && files.images) {
      const imagesDto = await imageServices.uploadImages(
        noteId,
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

    // Delete images in storage
    const storage = getStorage(firebaseApp);
    const deleteImageObjectPromises = [];
    deleteImages.forEach(async (deleteImage) => {
      deleteImageObjectPromises.push(deleteObject(ref(storage, deleteImage.url)));
    });
    
    // Wait
    await Promise.all(deleteImageObjectPromises);

    const images = await imageServices.getImages(noteId, 0, constant.MAX_INT);

    return new Note(noteId, noteDto.title, noteDto.content, noteDto.lastModified, images);
  } catch (error) {
    console.error(`Edit note error: ${error}`);
    throw new Error("Edit note failed.");
  }
};

export default editNoteService;
