import NodeRSA from "node-rsa"
import { config } from "./config"
import { Server } from "./server"
import { HttpError } from "./HttpError"
import { Client } from "./client"

export class Controller {
    server: Server

    constructor() {
        const serverKey = new NodeRSA()
        serverKey.importKey(config.serverKeyPem, 'pkcs1-private-pem')
        this.server = new Server(config.serverId, serverKey)
    }

    async startLogin(): Promise<any> {
        const enc = this.server.startLogin()
        return {
            serverId: enc.serverId,
            publicKey: enc.publicKey.toString('base64'),
            verifyToken: enc.verifyToken.toString('base64')
        }
    }
    
    async verifySecret(reqBody: any): Promise<any> {
        const username = reqBody?.username
        const sharedSecret = reqBody?.sharedSecret
    
        if (!username || typeof username !== 'string') {
            throw new HttpError(400, 'invalid username')
        }
    
        if (!sharedSecret || typeof sharedSecret !== 'string') {
            throw new HttpError(400, 'invalid sharedSecret')
        }
    
        const auth = await this.server.authenticate(username, Buffer.from(sharedSecret, 'base64'))
        return {
            username: auth.name,
            uuid: auth.id
        }
    }
    
    async verifyToken(reqBody: any): Promise<any> {
        const accessToken = reqBody?.accessToken
        const uuid = reqBody?.uuid
        const username = reqBody?.username
    
        if (!accessToken || typeof accessToken !== 'string') {
            throw new HttpError(400, 'invalid accessToken')
        }
    
        if (!uuid || typeof uuid !== 'string') {
            throw new HttpError(400, 'invalid uuid')
        }
    
        if (!username || typeof username !== 'string') {
            throw new HttpError(400, 'invalid username')
        }
    
        const client = new Client({
            accessToken,
            uuid,
            username
        })
    
        const req = this.server.startLogin()
        const res = await client.encrypt(req)
        const auth = await this.server.authenticate(client.session.username, res.sharedSecret)
        return {
            username: auth.name,
            uuid: auth.id
        }
    }
}