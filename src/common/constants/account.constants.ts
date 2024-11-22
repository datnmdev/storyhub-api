export enum AccountStatus {
    UNACTIVATED = 0,
    ACTIVATED = 1,
    LOCKED = 2,
    DELETED = 3
}

export enum AuthType {
    EMAIL_PASSWORD = 'email_password',
    GOOGLE = 'google'
}

export enum Role {
    MANAGER = 1,
    AUTHOR = 2,
    MODERATOR = 3,
    READER =4
}