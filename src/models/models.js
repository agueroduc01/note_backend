class Note {
  constructor(id, title, content, lastModified, images) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.lastModified = lastModified;
    this.images = images;
  }
}

class Member {
  constructor(id, role, isPin, uid, isArchived, isRemoved) {
    this.id = id;
    this.role = role;
    this.isPin = isPin;
    this.uid = uid;
    this.isArchived = isArchived;
    this.isRemoved = isRemoved;
  }
}

class Image {
  constructor(id, name, url, uploadTime, uploadBy) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.uploadTime = uploadTime;
    this.uploadBy = uploadBy;
  }
}

export { Note, Member, Image };
