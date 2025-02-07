export interface User {
    login: string;
    password: string;
    name: string;
    email: string;
    address: string;
}

export function createUser (): User {
    return {
        login: '',
        password: '',
        name: '',
        email: '',
        address: ''
    };
}