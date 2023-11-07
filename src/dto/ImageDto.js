class ImageDto {
    constructor(name, url, uploadTime, uploadBy) {
        this.name = name
        this.url = url
        this.uploadTime = uploadTime
        this.uploadBy = uploadBy
    }

    name;
    url;
    uploadTime;
    uploadBy;

    json() {
        return {...this}
    }
}

export { ImageDto };