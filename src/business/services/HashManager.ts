import * as bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()

export class HashManager {
    private rounds: number = Number(process.env.BCRYPT_COST)

    public hash = async(
        text: string
    ):Promise<string> =>{
        const salt: string = await bcrypt.genSalt(this.rounds)
        const cypherText: string = await bcrypt.hash(text,salt)

        return cypherText
    }

    public compare = async(
        text: string,
        hash: string
    ):Promise<boolean> =>{
        return bcrypt.compare(text,hash)
    }
}