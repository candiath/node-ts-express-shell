

export class LoginUserDto {
    private constructor(
        public email: string,
        public password: string,
    ) {}

    static login( object: { [key:string]: any }): [string?, LoginUserDto?] {

        const { email, password } = object;

        if ( !email ) return ['Missing email', undefined];
        if ( !password ) return ['Missing password', undefined];

        return [undefined, new LoginUserDto(email, password)];

        

        
    }
}