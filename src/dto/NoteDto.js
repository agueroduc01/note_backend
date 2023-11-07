class NoteDto {
    constructor(title, content, lastModified) {
        this.title = title
        this.content = content
        this.lastModified = lastModified
    }

    title;
    content;
    lastModified;

    json() {
        return {...this}
    }
}

export { NoteDto };