import { bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";




export class AuthService {

    // DI
    constructor () {}

    public async registerUser( registerUserDto: RegisterUserDto ) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email })
        if ( existUser ) throw CustomError.badRequest('Email already exists');
        
        try {
            const user = new UserModel(registerUserDto);

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();
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

    public async loginUser( loginUserDto: LoginUserDto ) {
        const existUser = await UserModel.findOne({ email: loginUserDto.email })
        if ( !existUser ) throw CustomError.notFound('User not found');

        // Verificar la contraseña
        const isValid = bcryptAdapter.compare(loginUserDto.password, existUser.password);
        if ( !isValid ) throw CustomError.badRequest('Invalid password');

        // JWT <---- para mantener la autenticación del usuario
        // Email de confirmación
        console.log(`User ${existUser.email} logged in`);

        const { password, ...rest } = UserEntity.fromObject(existUser);
        return {
            user: rest,
            token: 'ABC'
        }

        
    }
}