export class LogicalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "LogicalError";
    }
}

export class FunctionCallerError extends Error{
    constructor(message: string){
        super(message);
        this.name = "FunctionCallerError";
    }
}
