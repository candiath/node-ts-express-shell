import { v4 as uuidv4 } from 'uuid';

export class Uuid {

    static v4 = () => uuidv4()

    // Lo de debajo es lo mismo:
    // static v4 () {
    //     return uuidv4();
    // }
}