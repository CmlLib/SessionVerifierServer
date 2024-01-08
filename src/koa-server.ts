import Koa from 'koa'
import Router from '@koa/router'
import { bodyParser } from '@koa/bodyparser'
import morgan from 'koa-morgan'
import { HttpError } from './HttpError'
import { Controller } from './controller'
import { config } from './config'

const app = new Koa()
const controller = new Controller()
const router = new Router()

router.get('/startlogin', async (ctx, next) => {
    ctx.body = await controller.startLogin()
    await next()
})

router.post('/verifysecret', async (ctx, next) => {
    ctx.body = await controller.verifySecret(ctx.req.body)
    await next()
})

router.post('/verifytoken', async (ctx, next) => {
    ctx.body = await controller.verifyToken(ctx.req.body)
    await next()
})

async function errorHandler(ctx: Koa.DefaultContext, next: any) {
    try {
        await next()
    }
    catch (e) {
        if (e instanceof HttpError) {
            ctx.status = e.status
            ctx.body = { error: e.message }
        }
        else if (e instanceof Error) {
            if (!ctx.body) {
                ctx.body = { error: e.message }
                ctx.status = 500
            }
            console.log(e)
        }
        else {
            if (!ctx.body) {
                ctx.body = e
                ctx.status = 500
            }
            console.log(e)
        }
    }
}

export function startServer() {
    app.use(morgan('short', { stream: process.stdout }))
    app.use(errorHandler)
    app.use(bodyParser())
    app.use(router.routes())
    app.listen(config.port)
    
    console.log(`session-verifier started, ${config.port}`)
}