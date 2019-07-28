import { Router, Request, Response } from 'express'
import { MyResponse, isString, toInt, isInteger } from './utility'

class Server {
    data: object
    last_seen: Date
    ip: string
    port: number

    constructor(ip: string, port: number, data: object) {
        this.data = data
        this.last_seen = new Date()
        this.ip = ip
        this.port = port
    }

    get key(): string{
        return this.ip + this.port
    }
}



const servers: Map<string, Server> = new Map<string, Server>()

function delete_dead(): void {
    Array.from(servers.values())
        .filter(s => {
            return Date.now() - s.last_seen.getTime() > 1000 * 20 // older than 20 seconds
        })
        .forEach(s => servers.delete(s.key))
}

function servers_GET(req: Request): MyResponse {
    delete_dead()
    return new MyResponse(200, Array.from(servers.values()))
}

function servers_POST(req: Request): MyResponse {
    let data = req.body.data

    let ip = req.header('x-forwarded-for') || req.connection.remoteAddress
    if (!ip) return new MyResponse(505, "Unable to resolve remote IP address")

    let port = req.body.port
    if(!port) return new MyResponse(506, "Unable to resolve remote port")

    let server = new Server(ip, port, data)
    servers.set(server.key, server)

    return new MyResponse(200, "Ok")
}












const router = Router()

router
    .get("/", (req: Request, res: Response) => {
        let response = servers_GET(req)
        res.status(response.status)
        res.send(response.json || response.text)
    })
    .post("/", (req: Request, res: Response) => {
        let response = servers_POST(req)
        res.status(response.status)
        res.send(response.json || response.text)
    })







export = router