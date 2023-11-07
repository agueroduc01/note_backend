const { firestore } = require("../../configs/firestoreConfig");
import { Member } from "../../models/models";

const getMemberDetailsService = async (noteId, memberId) => {
  try {
    const memberSnapshot = await firestore.collection("notes").doc(noteId).collection("members").doc(memberId).get()
    if (!memberSnapshot.exists) {
      return null;
    }
    return new Member(memberSnapshot.id,
      memberSnapshot.get("role"),
      memberSnapshot.get("isPin"),
      memberSnapshot.get("uid")
    );
  } catch (error) {
    console.error(`Get member details error: ${error}`)
    throw new Error("Get member details failed.")
  }
};

export default getMemberDetailsService
