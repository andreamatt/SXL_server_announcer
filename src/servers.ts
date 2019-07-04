import { Router, Request, Response } from 'express'
import { MyResponse, isString, toInt, isInteger } from './utility'

class Server {
    ip: string
    name: string
    n_players: number
    map: string
    last_seen: Date

    constructor(ip: string, name: string, n_players: number, map: string) {
        this.ip = ip
        this.name = name
        this.n_players = n_players
        this.map = map
        this.last_seen = new Date()
    }
}



const servers: Map<string, Server> = new Map<string, Server>()

function delete_dead(): void {
    Array.from(servers.values())
        .filter(s => {
            return Date.now() - s.last_seen.getTime() > 1000 * 20 // older than 20 seconds
        })
        .forEach(s => servers.delete(s.ip))
}

function servers_GET(req: Request): MyResponse {
    delete_dead()
    return new MyResponse(200, Array.from(servers.values()))
}

function servers_POST(req: Request): MyResponse {
    let { ip, name, n_players, map } = req.body
    if (!isString(ip) || !isString(name) || !isInteger(n_players) || !isString(map)) return new MyResponse(400, "bad request")

    servers.set(ip, new Server(ip, name, n_players, map))

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