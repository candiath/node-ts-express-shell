import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";




export class AuthService {

    // DI
    constructor (
        // DI - Email service
        private readonly emailService: EmailService,
    ) {}

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
            this.sendEmailValidationLink( user.email );

            console.log('saved')

            const { password, ...rest } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
            if ( !token ) throw CustomError.internalServer('Error while creating JWT');
            
            return {
                user: rest,
                token: token,
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

    private sendEmailValidationLink = async( email: string ) => {

        const token = await JwtAdapter.generateToken({ email });
        if ( !token ) throw CustomError.internalServer('Error getting token');

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${ link }">Validate your email: ${ email }</a>
            `;
        
        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options);
        if ( !isSent ) throw CustomError.internalServer('Error sending email');

        console.log('Email sent');
        return true;
    }

    public validateEmail = async( token: string ) => {

        const payload = await JwtAdapter.validateToken( token );
        if ( !payload ) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if ( !email ) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });
        if ( !user ) throw CustomError.internalServer('Email does not exist');

        user.emailValidated = true;
        await user.save();

        return true;
    }
}