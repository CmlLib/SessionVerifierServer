export class HttpError extends Error {
    status: Number

    constructor(status: Number, msg: string) {
        super(msg)
        this.status = status
    }
}