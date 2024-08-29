

export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string, // ID
        public readonly category: string, // ID
    ) {}

    static create( props: { [key: string ]: any }: [string?, CreateProductDto?]) {

        const {
            name,
            available,
            price,
            description,
            user,
            category,
        } = props;
    }
}