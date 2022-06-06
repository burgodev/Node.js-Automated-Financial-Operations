export interface IPasswordRecovery {
    id: string,
    token: string,
    user_id: string,
    created_at: Date,
    expires_at: Date,
    is_valid: boolean,
}