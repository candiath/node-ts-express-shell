import { Request, Response } from "express";
import { CreateCategoryDto, CustomError } from "../../domain";


export class CategoryController {

    // DI
    constructor(){}

    private handleError = (error:unknown, res: Response) => {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        
        console.log(`${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    createCategory = async ( req: Request, res: Response ) => {
        // const [ error, createCategoryDto ] = CreateCategoryDto.create(req.body);
        // //! No va new porque es un metodo estático

        // if ( error ) return res.status(400).json({ error });
        // return res.json(createCategoryDto);

        res.json(req.body);
    }

    getCategories = async ( req: Request, res: Response ) => {
        return res.json('Get categories');
    }




}