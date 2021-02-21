import { Request, Response } from "express"
import { LoginInputDTO, UserInputDTO } from "../business/entities/User"
import { Authenticator } from "../business/services/Authenticator"
import { HashManager } from "../business/services/HashManager"
import { IdGenerator } from "../business/services/IdGenerator"
import { UserBusiness } from "../business/UserBusiness"
import { UserDataBase } from "../data/UserDataBase"

const userBusiness = new UserBusiness(
    new IdGenerator,
    new HashManager,
    new Authenticator,
    new UserDataBase
)

export class UserController {
    public signup = async(
        req:Request,
        res:Response
    ):Promise<void> =>{
        try{
            const input: UserInputDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            }
            const token = await userBusiness.createUser(input)
            res.status(200).send({
                message:"User created successfully !",
                token
            })
        }
        catch(error){
            res.status(error.statusCode || 400).send({
                error:error.message
            })
        }
    }

    public login = async(
        req: Request,
        res: Response
    ):Promise<void> =>{
        try{
            const loginData: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            }
            const token = await userBusiness.getUserByEmail(loginData)
            res.status(200).send({
                message: "User logged in",
                token
            })
        }
        catch(error){
            res.status(error.statusCode).send({
                error:error.message
            })
        }
    }
}