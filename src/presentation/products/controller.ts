import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";


export class ProductController {

    // DI
    constructor(
        // todo: private readonly productService: ProductService,
    ){}

    private handleError = (error:unknown, res: Response) => {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    createProduct = async ( req: Request, res: Response ) => {
        // const [ error, createCategoryDto ] = CreateCategoryDto.create(req.body);
        // // //! No va new porque es un metodo estático

        // if ( error ) return res.status(400).json({ error });
        
        return res.json('create products');
        // this.productService.createCategory(createCategoryDto!, req.body.user)
        //     .then( category => res.status(201).json( category ) )
        //     .catch( error => this.handleError( error, res ) );
    }

    getProducts = async ( req: Request, res: Response ) => {
        
        const { page = 1, limit = 10 } = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
        if ( error ) return res.status(400).json({ error });

        return res.json('get products');

        // this.productService.getCategories(paginationDto!)
        //     .then( categories => res.status(200).json( categories ) )
        //     .catch( error => this.handleError( error, res ) );
        
    }




}