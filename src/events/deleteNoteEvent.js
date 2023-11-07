import memberServices from "../services/memberServices";

const deleteNoteEvent = (socket) => {
  socket.on("delete_note", async (roomId) => {
    // Get role of current socket
    const member = await memberServices.getMemberDetailsByUid(roomId, socket.uid);
    // If can delete note, then leave all socket of this note (room)
    if (member && member.role == "owner") {
      socket.adapter.sockets(roomId).array.forEach((s) => {
        s.leave(roomId);
      });
    }
  });
};

export default deleteNoteEvent;
