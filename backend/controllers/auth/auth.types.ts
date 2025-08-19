export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}