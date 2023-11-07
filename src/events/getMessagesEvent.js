import { adminAuth, firestore } from "../configs/firestoreConfig";
import memberServices from "../services/memberServices";

const getMessagesEvent = async (socket) => {
  socket.on("load_messages", async (roomId, pageIndex, limit) => {
    const member = await memberServices.getMemberDetailsByUid(
      roomId,
      socket.uid
    );
    if (member) {
      const messagePromises = (
        await firestore
          .collection("notes")
          .doc(roomId)
          .collection("messages")
          .orderBy("time", "desc")
          .offset(pageIndex * limit)
          .limit(limit)
          .get()
      ).docs.map(async (document) => {
        const memberUser = await adminAuth.getUser(document.get("userId"));
        return {
          id: document.id,
          content: document.get("message"),
          time: document.get("time"),
          room: roomId,
          user: {
            id: memberUser.uid,
            fullName: memberUser.displayName,
          },
        };
      });
      let messages = await Promise.all(messagePromises);
      messages.sort((m1, m2) => m1.time - m2.time);
      socket.emit("load_messages", messages);
    }
  });
};

export default getMessagesEvent;