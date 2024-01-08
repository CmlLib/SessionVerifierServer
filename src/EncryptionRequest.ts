export interface EncryptionRequest {
    serverId: string,
    publicKey: Buffer,
    verifyToken: Buffer
}