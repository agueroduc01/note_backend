import { firestore } from "../../configs/firestoreConfig";
import { Member } from "../../models/models";

const getMembersService = async (noteId, pageIndex, limit) => {
  try {
    const membersCollectionRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members");
    const lastPageIndex =
      Math.ceil((await membersCollectionRef.get()).size / limit) - 1;
    const hasPreviousPage = pageIndex > 0;
    const hasNextPage = pageIndex < lastPageIndex;
    const members = (
      await membersCollectionRef
        .offset(pageIndex * limit)
        .limit(limit)
        .get()
    ).docs.map((memberSnapshot) => {
      return new Member(memberSnapshot.id,
        memberSnapshot.get("role"),
        memberSnapshot.get("isPin"),
        memberSnapshot.get("uid")
      );
    });
    return {
      hasPreviousPage: hasPreviousPage,
      hasNextPage: hasNextPage,
      data: members,
    };
  } catch (error) {
    console.error(`Get members error: ${error}`);
    throw new Error("Get members failed.");
  }
};

export default getMembersService;
