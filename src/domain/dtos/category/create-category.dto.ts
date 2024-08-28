export class CreateCategoryDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
    ) {}

    static create( object: { [key: string]: any } ): [string?, CreateCategoryDto?] {

        const { name, available = false } = object;
        if ( !name ) return ['Missing name'];

        let availableBoolean = available;
        if ( typeof available !== 'boolean' ) {
            availableBoolean = (available === 'true');
        }

        return [undefined, new CreateCategoryDto(name, availableBoolean)];



        
    }
}