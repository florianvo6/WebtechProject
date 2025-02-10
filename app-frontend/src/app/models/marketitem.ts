import { Person } from "./person";

export interface MarketItem {
    title: string;
    description: string;
    price: number | null;
    condition: string;
    handover: string;
    imageId: number | null;
    seller: Person;
}

export function createMarketItem (): MarketItem {
    return {
        title: '',
        description: '',
        price: null,
        condition: '',
        handover: '',
        imageId: null,
        seller: {
            owner: '',
            name: '',
            address: ''
        }
    };
}
