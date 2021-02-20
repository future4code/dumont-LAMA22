import express from "express"
import cors from "cors"
import { ppid } from "process"
import { userRouter } from "./controller/routes/UserRouter"
import { AddressInfo } from "net"

const app = express()
app.use(express.json())
app.use(cors())

app.use("/users",userRouter)

const server = app.listen(process.env.PORT || 3003, () =>{
    if(server){
        const address = server.address() as AddressInfo
        console.log(`Server is running in http://localhost:${address.port}`)
    }else{
        console.log("Failure upon starting server")
    }
})