export interface SendOtpData {
    accountId: number
    otp: string
    to: string
}

export interface SendAccountInfoToModeratorData {
    email: string
    password: string
    to: string
}