export class ContractMsg {
    toJson(): string {
        return JSON.stringify(this)
    }

    toJsonPretty(): string {
        return JSON.stringify(this, undefined, 2)
    }
}