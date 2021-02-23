import * as jwt from "jsonwebtoken"
import { AuthenticationData } from "../entities/User"
import dotenv from "dotenv"

dotenv.config()

export class Authenticator {

    public generateToken= async (
        input: AuthenticationData,
        expiresIn: string = "1d"
    ):Promise<string> => {
        const token = jwt.sign(
            input,
            process.env.JWT_KEY as string,
            {expiresIn}
        )
        return token
    }

    public getTokendata = async(
        token: string
    ):Promise<AuthenticationData> =>{
        const payload = jwt.verify(
            token,
            process.env.JWT_KEY as string
        ) as any
        const result = { id: payload.id }
        return result
    }
}