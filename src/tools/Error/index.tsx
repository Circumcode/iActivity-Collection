export class LogicalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LogicalError";
    }
}
