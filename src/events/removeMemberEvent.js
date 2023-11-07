const { adminAuth } = require("../configs/firestoreConfig");
import memberServices from "../services/memberServices";

const removeMemberEvent = (socket) => {
  socket.on("remove_member", async (roomId, email) => {
    // Get role of current user of this socket
    const member = await memberServices.getMemberDetailsByUid(roomId, socket.uid);
    if (member && ["owner", "editor"].includes(member.role)) {
      // Get uid of removing member
      const user = await adminAuth.getUserByEmail(email);
      // Convert socket map to socket array
      const socketList = Array.from(socket.adapter.nsp.sockets, ([key, value]) => (value))
      for (const s of socketList) {
        // Leave socket of removing member
        if (s.uid == user.uid) {
          s.leave(roomId);
          break;
        }
      }
    }
  });
};

export default removeMemberEvent;
