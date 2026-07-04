export interface User {
    id: string;
    email: string;
    firstname: string;
    surname: string;
    role?: string;
    location?: string | null;
}

export interface CreateUserBody {
    email: string;
    password: string;
    firstname: string;
    surname: string;
    role?: string;
    location?: string;
}

export interface UpdateUserBody {
    email?: string;
    firstname?: string;
    surname?: string;
    location?: string | null;
}
