import { firestore } from "../../configs/firestoreConfig";
import { Member } from "../../models/models";
const pinService = async (note, member) => {
  try {
    const memberRef = firestore
      .collection("notes")
      .doc(note.id)
      .collection("members")
      .doc(member.id);
    let memberSnapshot = await memberRef.get();
    if (!memberSnapshot.exists) {
      return null;
    }
    await memberRef.update({
      isPin: member.isPin,
    });
    memberSnapshot = await memberRef.get();
    return new Member(memberSnapshot.id,
      memberSnapshot.get("role"),
      memberSnapshot.get("isPin"),
      memberSnapshot.get("uid")
    );
  } catch (error) {
    console.error(`Update pin error: ${error}`);
    throw new Error("Update pin failed.");
  }
};

export default pinService;
