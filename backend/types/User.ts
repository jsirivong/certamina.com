export default interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}
