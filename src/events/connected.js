import noteServices from "../services/noteServices";
import events from "./index";

const connectedEvent = async (socket) => {
  events.addNoteEvent(socket);
  events.deleteNoteEvent(socket);
  events.addMemberEvent(socket);
  events.removeMemberEvent(socket);
  events.chatEvent(socket);
  events.getMessagesEvent(socket);

  const uid = socket.uid;
  const notes = await noteServices.getNotes(uid);
  notes.forEach((note) => {
    socket.join(note.id);
  });
};

export default connectedEvent;
