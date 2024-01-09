# SessionVerifierServer

verify a user's minecraft session

[node-minecraft-protocol encrypt.js](https://github.com/PrismarineJS/node-minecraft-protocol/blob/master/src/client/encrypt.js)

[node-minecraft-protocol login.js](https://github.com/PrismarineJS/node-minecraft-protocol/blob/master/src/server/login.js)

[node-yggdrasil](https://github.com/PrismarineJS/node-yggdrasil)

[Protocol#Login](https://wiki.vg/Protocol#Login)

[Protocol Encryption](https://wiki.vg/Protocol_Encryption)

## API

### GET /startlogin

Response

| Property    | Type   | Description                                       |
|-------------|--------|---------------------------------------------------|
| serverId    | string | server id                                         |
| publicKey   | string | public key formatted in DER and encoded in base64 |
| verifyToken | string | verify token encoded in base64                    |

### POST /verifysecret

Request

| Property     | Type   | Description                     |
|--------------|--------|---------------------------------|
| username     | string | username                        |
| sharedSecret | string | shared secret encoded in base64 |

Response

| Property | Type   | Description |
|----------|--------|-------------|
| username | string |             |
| uuid     | string |             |

### POST /verifytoken

Request

| Property    | Type   | Description |
|-------------|--------|-------------|
| accessToken | string |             |
| uuid        | string |             |
| username    | string |             |

Response

| Property | Type   | Description |
|----------|--------|-------------|
| username | string |             |
| uuid     | string |             |

## Configuration

/src/config-prod.ts

```ts
import { Config } from "./config";

const prod: Config = {
    port: 23333,
    serverId: 'serverid',
    serverKeyPem: `
-----BEGIN RSA PRIVATE KEY-----
(pem)
-----END RSA PRIVATE KEY-----`
}

export default prod;
```

| Property     | Type   | Description      |
|--------------|--------|------------------|
| port         | number | http server port |
| serverId     | string | [Server ID String](https://wiki.vg/Protocol_Encryption#Server_ID_String) |
| serverKeyPem | string | RSA private key, formatted in PEM with PKCS1 padding, used for encrypting and decrypting shared secrets |
