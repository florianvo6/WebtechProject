import { Person } from "./person";

export interface RealEstateItem {
    title: string;
    description: string;
    price: number | null;
    type: string;
    selltype: string;
    size: number | null;
    rooms: number | null;
    imageId: number | null;
    seller: Person;
}

export function createRealestateItem (): RealEstateItem {
    return {
        title: '',
        description: '',
        price: null,
        type: '',
        selltype: '',
        size: null,
        rooms: null,
        imageId: null,
        seller: {
            owner: '',
            name: '',
            address: ''
        }
    };
}