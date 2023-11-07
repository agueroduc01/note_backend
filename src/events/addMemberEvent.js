import { adminAuth } from "../configs/firestoreConfig";

const addMemberEvent = (socket) => {
  socket.on("add_member", async (roomId, email) => {
    const socketList = Array.from(socket.adapter.nsp.sockets, ([key, value]) => (value))
    const user = await adminAuth.getUserByEmail(email);
    for (const s of socketList) {
      if (user && s.uid == user.uid) {
        s.join(roomId);
        break;
      }
    }
  });
};

export default addMemberEvent;
