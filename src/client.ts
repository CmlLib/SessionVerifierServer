// https://github.com/PrismarineJS/node-minecraft-protocol

// @ts-ignore
import yggdrasil from 'yggdrasil'
import crypto from 'crypto'
import { Session } from './session'
import { EncryptionRequest } from './EncryptionRequest'
import { EncryptionResponse } from './EncryptionResponse'

export class Client {
    public session: Session
    private yggdrasilServer: any

    constructor(session: Session) {
        this.session = session
        this.yggdrasilServer = yggdrasil.server()
    }

    async encrypt(req: EncryptionRequest): Promise<EncryptionResponse> {
        const sharedSecret = crypto.randomBytes(16)
        await this.yggdrasilServer.join(
            this.session.accessToken, 
            this.session.uuid, 
            req.serverId, 
            sharedSecret, 
            req.publicKey)

        const pubKey = mcPubKeyToPem(req.publicKey)
        const encryptedSharedSecretBuffer = crypto.publicEncrypt({ key: pubKey, padding: crypto.constants.RSA_PKCS1_PADDING }, sharedSecret)
        const encryptedVerifyTokenBuffer = crypto.publicEncrypt({ key: pubKey, padding: crypto.constants.RSA_PKCS1_PADDING }, req.verifyToken)

        return {
            sharedSecret: encryptedSharedSecretBuffer,
            verifyToken: encryptedVerifyTokenBuffer
        }
    }
}

function mcPubKeyToPem (mcPubKeyBuffer: Buffer): string {
    let pem = '-----BEGIN PUBLIC KEY-----\n'
    let base64PubKey = mcPubKeyBuffer.toString('base64')
    const maxLineLength = 65
    while (base64PubKey.length > 0) {
      pem += base64PubKey.substring(0, maxLineLength) + '\n'
      base64PubKey = base64PubKey.substring(maxLineLength)
    }
    pem += '-----END PUBLIC KEY-----\n'
    return pem
}