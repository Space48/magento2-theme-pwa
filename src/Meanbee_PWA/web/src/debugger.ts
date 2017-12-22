class Debugger {
    private static enabled: boolean = false;

    constructor(private className: string) {}

    static enable() {
        Debugger.enabled = true;
    }

    static disable() {
        Debugger.enabled = false;
    }

    log(message: string, method: string | null, context = {}) : void {
        if (Debugger.enabled) {
            console.log("%c%s", 'background:black;color:white;padding:3px 5px;', this.formatMessage(message, method), context);
        }
    }

    warn(message: string, method: string | null, context = {}) : void {
        if (Debugger.enabled) {
            console.warn(this.formatMessage(message, method), context);
        }
    }

    formatMessage(message: string, method: string | null) : string {
        const where = (method === null) ? this.className : `${this.className}::${method}`;

        return `🐰 [${where}] ${message}`;
    }
}

export = Debugger;
