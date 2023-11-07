import { firebaseApp } from "../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { ImageDto } from "../../dto/ImageDto";
const uploadImages = async (noteId, memberDto, images) => {
  try {
    // Create storage instance
    const storage = getStorage(firebaseApp);
    // Create array store upload images promises
    const uploadImagesPromises = [];
    // Generate image url and push upload images promises to array
    [].concat(images).forEach((image) => {
      const imageUrl = `images/${memberDto.uid}/${noteId}/${Date.now().toString()}-${
        image.name
      }`;
      uploadImagesPromises.push(
        uploadBytes(ref(storage, imageUrl), image.data, {
          contentType: "image",
        })
      );
    });
    // Wait for all upload images promises done and get results
    const uploadResults = await Promise.all(uploadImagesPromises);
    // Convert results to images (data)
    const getImagesDtoPromises = uploadResults.map(async (uploadResult) => {
      return new ImageDto(
        uploadResult.ref.name,
        await getDownloadURL(uploadResult.ref),
        Date.parse(uploadResult.metadata.updated),
        memberDto.uid
      );
    });
    // Wait
    const data = await Promise.all(getImagesDtoPromises)
    return data;
  } catch (error) {
    console.error(`Upload images error: ${error}`);
    throw new Error("Upload images failed.");
  }
};

module.exports = uploadImages;
