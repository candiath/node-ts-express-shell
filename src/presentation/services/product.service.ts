

import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";


export class ProductService {

    constructor() {}

    async createProduct( createProductDto: CreateProductDto ) {

        const producExists = await ProductModel.findOne({ name: createProductDto.name });
        if ( producExists ) throw CustomError.badRequest('Product already exists');

        try {
            
            const product = new ProductModel( createProductDto );

            await product.save();

            return product;


        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }
        
    }


    async getProducts( paginationDto: PaginationDto ) {

        // Obtengo la lista de todas las categorias
        // const total = await CategoryModel.countDocuments();
        const { page, limit } = paginationDto;

        const [total, products] = await Promise.all( [
            ProductModel.countDocuments(),
            ProductModel.find()
                .skip( (page -1) * limit )
                .limit( limit )
                // .populate('user', ['id', 'name', 'email'])
                .populate('user')
                .populate('category')
        ]);

        try {

            return {
                page: page,
                limit: limit,
                total: total,
                next: `api/products?page=${ (page + 1)}&limit=${limit}`,
                prev: ( page > 1 ) ? `api/products?page=${ (page - 1)}&limit=${limit}` : null,
                products: products
                };
        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }



    }




}