export interface Config {
    port: number
    serverId: string
    serverKeyPem: string
}

let config: Config = {
    port: 23333,
    serverId: 'abababab',
    serverKeyPem: `BEGIN RSA PRIVATE KEY`
}

import prod from "./config-prod"
config = prod

export { config }