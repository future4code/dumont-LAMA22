import { BaseDataBase } from "./BaseDataBase"
import { User } from "../business/entities/User"
import { CustomError } from "../business/error/CustomError"

export class UserDataBase extends BaseDataBase {

    private static TableName = "lama_Users"

    private static toUserModel(user: any):User{
        return new User(
            user.id,
            user.name,
            user.email,
            user.password,
            User.stringToUserRole(user.role)
        )
    }

    public createUser = async(
        user: User
    ):Promise<void> =>{
        try{
            await BaseDataBase.connection
            .insert({
                id:user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                role: User.stringToUserRole(user.role)
            }).into(UserDataBase.TableName)
        }
        catch(error){
            throw new CustomError(500,"An expected error ocurred")
        }
    }

    public selectUserByEmail = async(
        email: string
    ):Promise<User> =>{
        try{
            const result = await BaseDataBase.connection
            .select("*")
            .from(UserDataBase.TableName)
            .where({email})
        
            return UserDataBase.toUserModel(result[0])
        }
        catch(error){
            throw new CustomError(500,"An unexpected error ocurred")
        }
    }
}