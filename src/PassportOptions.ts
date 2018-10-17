export default class PassportOptions {
    usernameField: string;
    tableName: string;
    constructor(tableName: string, usernameField: string) {
        this.tableName = tableName;
        this.usernameField = usernameField;
    }
}