import { firestore } from "../../configs/firestoreConfig";
import { Member } from "../../models/models";
const addMemberService = async (noteId, memberDto) => {
  try {
    const memberRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members")
      .doc();
    await memberRef.create(memberDto.json());
    const memberSnapshot = await memberRef.get();
    return new Member(memberSnapshot.id,
      memberSnapshot.get("role"),
      memberSnapshot.get("isPin"),
      memberSnapshot.get("uid")
    );
  } catch (error) {
    console.log(`Add member error: ${error}`);
    throw new Error("Add member failed.");
  }
};

export default addMemberService;
