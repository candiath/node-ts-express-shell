import { bcryptAdapter, JwtAdapter } from "../../config";
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
        const user = await UserModel.findOne({ email: loginUserDto.email })
        if ( !user ) throw CustomError.notFound('Email does not exist');

        // Verificar la contraseña
        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
        if ( !isMatching ) throw CustomError.badRequest('Password is not valid');

        // JWT <---- para mantener la autenticación del usuario
        // Email de confirmación
        console.log(`User ${user.email} logged in`);

        const { password, ...rest } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
        if ( !token ) throw CustomError.internalServer('Error while creating JWT');

        return {
            user: rest,
            token: token
        }

        
    }
}