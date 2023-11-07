import { adminAuth, firestore } from "../configs/firestoreConfig";
import memberServices from "./../services/memberServices";

const chatEvent = (socket) => {
  socket.on("chat", async (data) => {
    let message = JSON.parse(data);
    const user = await adminAuth.getUser(socket.uid);
    message.user = {
      id: user.uid,
      fullName: user.displayName,
    };

    // Check is note member
    const member = await memberServices.getMemberDetailsByUid(message.room, message.user.id);

    // If this is member of note, then can send message to this room
    if (member) {
      message.time = Date.now()
      const messageRef = firestore.collection("notes").doc(message.room).collection("messages").doc();
      messageRef.set({
        userId: message.user.id,
        message: message.content,
        time: message.time,
      });
      message.id = messageRef.id;
      socket.to(message.room).emit("chat", message);
    }
  });
}

export default chatEvent;