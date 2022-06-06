import fs from 'fs';
import util from 'util';

export enum LogLevel {
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL,
}

type LogLevelStrings = keyof typeof LogLevel;

const debug_level = process.env.DEBUG_LEVEL || 'none';

export const l = (level: LogLevelStrings, message: string, data: any = null): void => {
    new Log(level, message, data).log();
}

class Log {

    private message: string;
    private data: any;
    private type: LogLevel;
    private string_type: string;
    private console_level: string;

    constructor (type: LogLevelStrings, message: string, data: any = null) {
        this.type = LogLevel[type];
        this.string_type = type;
        this.message = message;
        this.data = data;
        this.console_level = type.toLowerCase();
    }

    private formatMessage(): string {
        const log_obj = {
            type: this.string_type,
            message: this.message,
            data: {},
        };
        
        if (this.data != null) {
            log_obj.data = this.data;
        }

        return JSON.stringify(log_obj);
    }

    private validation(): boolean {
        return this.message != '';
    }

    private saveInFile (content: string): void {
        const file_path = `${__dirname}/../../logs/`;
        const file_name = `${new Date().toLocaleDateString('pt-BR', {timeZone: 'UTC'}).replace(/\//g, '-')}.log`;
    
        if (!fs.existsSync(file_path)){
            fs.mkdirSync(file_path);
        }

        fs.appendFile(`${file_path}${file_name}`, `${util.format(content)} \n`, (err) => {
            if (err) l('ERROR', err.message);
        });
    }

    private print(): void {
        if (this.validation() && (
               this.console_level == 'trace'
            || this.console_level == 'debug'
            || this.console_level == 'info'
            || this.console_level == 'warn'
            || this.console_level == 'error'
        )) {
            const formatted_message = this.formatMessage();
            console[this.console_level](formatted_message);
            this.saveInFile(formatted_message);
        }
    }

    public log(): void {
        switch (this.type) {
            case LogLevel.TRACE:
            case LogLevel.DEBUG:
                if (debug_level != 'formatted' && debug_level != 'full') return;
                break;
            case LogLevel.INFO:
            case LogLevel.WARN:
            case LogLevel.ERROR:
                break;
            case LogLevel.FATAL:
                this.console_level = 'error';
                // TODO: Send to email || telegram
                break;
            default: 
                return;
        }

        this.print();
    }

}