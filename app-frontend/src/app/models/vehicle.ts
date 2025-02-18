import { Person } from "./person";

//VehicleItem interface
export interface VehicleItem {
    title: string;
    description: string;
    price: number | null;
    brand: string;
    initialapproval: number | null;
    mileage: number | null;
    imageId: number | null;
    seller: Person;
}

export function Create(): VehicleItem {
    return {
        title: '',
        description: '',
        price: null,
        brand: '',
        initialapproval: null,
        mileage: null,
        imageId: null,
        seller: {
            owner: '',
            name: '',
            address: ''
        }
    };
}