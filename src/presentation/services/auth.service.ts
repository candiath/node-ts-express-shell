import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";




export class AuthService {

    // DI
    constructor () {}

    public async registerUser( registerUserDto: RegisterUserDto ) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email })
        if ( existUser ) throw CustomError.badRequest('Email already exists');
        
        try {
            const user = new UserModel(registerUserDto);
            await user.save();
            // Encriptar la contraseña

            // JWT <---- para mantener la autenticación del usuario


            // Email de confirmación 
            console.log('saved')

            const { password, ...rest } = UserEntity.fromObject(user);
            
            return {
                user: rest,
                token: 'ABC'
            }
            


        } catch (error) {
            throw CustomError.internalServer(`${ error }`)
        }
    }
}