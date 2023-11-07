class MemberDto {
  constructor(role, isPin, uid, isArchived, isRemoved) {
    this.role = role;
    this.isPin = isPin;
    this.uid = uid;
    this.isArchived = isArchived;
    this.isRemoved = isRemoved;
  }

  role;
  isPin;
  uid;
  isArchived;
  isRemoved;

  json() {
    return { ...this };
  }
}

export { MemberDto };
