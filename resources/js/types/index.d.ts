export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles?: RoleName[];
}

export type Flash = {
    success?: string;
    error?: string;
    info?: string;
};

export type RoleName = 'admin' | 'pm' | 'dev' | 'user';

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: Flash;
};

