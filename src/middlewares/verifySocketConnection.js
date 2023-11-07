import { adminAuth } from "../configs/firestoreConfig";

const verifySocketConnection = async (socket, next) => {
  const handshake = socket.handshake;
  if (!(handshake.auth && handshake.auth.token)) {
    const err = new Error("Not authorized.");
    err.data = {
      message: "Token required.",
    };
    next(err);
    return;
  }
  try {
    const token = handshake.auth.token;
    const decoded = await adminAuth.verifyIdToken(token);
    socket.uid = decoded.uid;
    next();
  } catch (error) {
    console.log(error);
    const err = new Error("Not authorized.");
    err.data = {
      message: "Invalid token.",
    };
    next(err);
  }  
};

export default verifySocketConnection;