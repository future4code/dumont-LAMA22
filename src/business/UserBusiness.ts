import { UserDataBase } from "../data/UserDataBase";
import { LoginInputDTO, User, UserInputDTO } from "./entities/User";
import { CustomError } from "./error/CustomError";
import { Authenticator } from "./services/Authenticator";
import { HashManager } from "./services/HashManager";
import { IdGenerator } from "./services/IdGenerator";

export class UserBusiness {
    
    constructor(
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        public authenticator: Authenticator,
        private userDataBase: UserDataBase
    ){}

    public createUser = async(
        user: UserInputDTO
    ):Promise<string> =>{
        if(!user.name || !user.email || !user.password || !user.role){
            throw new CustomError(204,"Fill all the fields correctly")
        }
        if(user.password.length <6){
            throw new CustomError(411,"Enter at least 6 characters")
        }
        if(!user.email.includes("@")){
            throw new CustomError(404,"Invalid email")            
        }

        const id: string = this.idGenerator.generate()
        const hashPassword = await this.hashManager.hash(user.password)
        const input = {
            id,
            name: user.name,
            email: user.email,
            password: hashPassword,
            role: User.stringToUserRole(user.role)
        }

        await this.userDataBase.createUser(input)

        const accessToken = this.authenticator.generateToken({
            id,
            role: user.role
        })

        return accessToken
    }

    public getUserByEmail = async(
        user: LoginInputDTO
    ):Promise<any> =>{
        const userFromDb = await this.userDataBase.selectUserByEmail(user.email)

        if(!userFromDb){
            throw new CustomError(406,"Invalid Credentials")
        }

        if(!user.email || !user.password){
            throw new CustomError(404,"Enter email and password")            
        }

        const checkPassword = await this.hashManager.compare(
            user.password,
            userFromDb.password
        )

        if(!checkPassword){
            throw new CustomError(401,"Invalid Password")
        }

        const accessToken = this.authenticator.generateToken({
            id: userFromDb.id,
            role: userFromDb.role
        })

        return accessToken
    }
}