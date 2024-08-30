


export class FileUploadService {

    constructor() {}

    private checkFolder( folderPath: string ) {

        throw new Error('Method not implemented.');
    }

    uploadSingle(
        file: any,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ) {

    }

    uploadMultiple(
        file: any[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif'],
    ) {
        
    }
}