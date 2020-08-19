class Case {
    constructor(id, ownerId, title, subject, description, imageUrl, imageLink, status) {
        this.id = id;
        this.ownerId = ownerId;
        this.title = title;
        this.subject = subject;
        this.description = description;
        this.imageUrl = imageUrl;
        this.imageLink = imageLink;
        this.status = status;
    }
}

export default Case;