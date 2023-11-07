import { firestore } from "../../configs/firestoreConfig";
import { Member } from "../../models/models";

const editMemberService = async (noteId, memberId, memberDto) => {
  try {
    const memberRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members")
      .doc(memberId);
    await memberRef.update(memberDto.json());
    return new Member(memberId, memberDto.role, memberDto.isPin, memberDto.uid);
  } catch (error) {
    console.error(`Edit member error: ${error}`);
    throw new Error("Edit member failed.");
  }
};

export default editMemberService;
