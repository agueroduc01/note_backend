import fileUpload from "express-fileupload";
export default fileUpload({
  responseOnLimit: "Image size limit has reached.", // Response when face limit exception
  abortOnLimit: true, // Return 413 when face limit exception
  limits: {
    fileSize: 1024 * 1024 * 2, // File size
    files: 10, // Maxmimum files uploading at the same time
  },
});