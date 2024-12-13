export enum QueueName {
    MAIL = 'mail',
    DELETE_FILE_AWS_S3 = 'delete-file-aws-s3'
}

export enum JobName {
    SEND_OTP_TO_VERIFY_ACCOUNT = 'send-otp-to-verify-account',
    SEND_OTP_TO_RESET_PASSWORD = 'send-otp-to-reset-password',
    SEND_ACCOUNT_INFO_TO_MODERATOR = 'send-account-info-to-moderator',
    SEND_OTP_TO_VERIFY_CHANGE_PASSWORD = 'send-otp-to-verify-change-password',
    DELETE_FILE_AWS_S3 = 'delete-file-aws-s3'
}