export interface AuthResponse {
    user: any | null;
    session: any | null;
}

export type LoginParams = {
    email: string;
    password: string;
};

export type SignUpParams = {
    email: string;
    password: string;
    username: string;
    role: userRole;
};

export enum userRole {
    COUPLE = 'Couple',
    Vendor = 'Vendor',
    Admin = 'Admin'
}

