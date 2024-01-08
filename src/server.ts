// https://github.com/PrismarineJS/node-minecraft-protocol

import NodeRSA from 'node-rsa'
import crypto from 'crypto'
// @ts-ignore
import yggdrasil from 'yggdrasil'
import { EncryptionRequest } from './EncryptionRequest'

export class Server {
    serverId: string
    serverKey: NodeRSA
    yggdrasilServer: any
    publicKeyDer: Buffer

    constructor(serverId: string, serverKey: NodeRSA) {
        this.serverId = serverId
        this.yggdrasilServer = yggdrasil.server()
        this.serverKey = serverKey

        const publicKeyStrArr = this.serverKey.exportKey('pkcs8-public-pem').split('\n')
        let publicKeyStr = ''
        for (let i = 1; i < publicKeyStrArr.length - 1; i++) {
          publicKeyStr += publicKeyStrArr[i]
        }
        this.publicKeyDer = Buffer.from(publicKeyStr, 'base64')
    }

    startLogin(): EncryptionRequest {
        const verifyToken = crypto.randomBytes(4)
        return {
            serverId: this.serverId, 
            publicKey: this.publicKeyDer,
            verifyToken: verifyToken
        }
    }

    async authenticate(username: string, encryptedSharedSecret: Buffer): Promise<any> {
        const sharedSecret = crypto.privateDecrypt({
            key: this.serverKey.exportKey(),
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, encryptedSharedSecret)

        return await this.yggdrasilServer.hasJoined(
            username, 
            this.serverId, 
            sharedSecret, 
            this.publicKeyDer)
    }
}