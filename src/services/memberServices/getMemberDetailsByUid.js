import { firestore } from "../../configs/firestoreConfig";
import { Member } from "../../models/models";

const getMemberDetailsByUidService = async (noteId, memberUid) => {
  try {
    const querySnapshot = await firestore
      .collection("notes")
      .doc(noteId)
      .collection("members")
      .where("uid", "==", memberUid)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    const memberSnapshot = querySnapshot.docs[0];
    return new Member(
      memberSnapshot.id,
      memberSnapshot.get("role"),
      memberSnapshot.get("isPin"),
      memberSnapshot.get("uid"),
      memberSnapshot.get("isArchived"),
      memberSnapshot.get("isRemoved")
    );
  } catch (error) {
    console.error(`Get member details by uid error: ${error}`);
    throw new Error("Get member details failed.");
  }
};

export default getMemberDetailsByUidService;
