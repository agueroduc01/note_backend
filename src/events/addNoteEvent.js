import memberServices from "../services/memberServices";

const addNoteEvent = (socket) => {
  socket.on("add_note", async (roomId) => {
    // Get role of socket user
    const member = await memberServices.getMemberDetailsByUid(roomId, socket.uid);
    if (member && member.role == "owner") {
      socket.join(roomId);
    }
  });
};

export default addNoteEvent;
