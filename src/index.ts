import './settings'
import { Request, Response } from 'express'
import express from 'express'
import servers from './servers'

// basic setup
const app = express()

// logging
if (process.env.BASEURL == 'http://localhost:') {
    app.use((req: Request, res: Response, next) => {
        console.log(`Params: ${JSON.stringify(req.params)}`)
        console.log(`Query: ${JSON.stringify(req.query)}`)
        next()
    })
}

// routes setup
const V = process.env.APIVERSION
app.use(`/${V}/`, servers)

const port = process.env.PORT
app.listen(port, () => console.log("server running on port " + port))

