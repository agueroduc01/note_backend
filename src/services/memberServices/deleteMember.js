const { firestore } = require("../../configs/firestoreConfig");

const deleteMemberService = async (noteId, memberId) => {
  try {
    const memberRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members")
      .doc(memberId);
    await memberRef.delete();
    return {};
  } catch (error) {
    console.error(`Delete member error: ${error}`);
    throw new Error("Delete member failed.");
  }
};

export default deleteMemberService;
