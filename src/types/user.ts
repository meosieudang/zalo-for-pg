// src/types.ts
interface User {
    username: string;
    token: string;
}

interface AuthContextValue {
    user: {
        id: string;
        name: string;
        avatar: string;
        idByOA?: string;
        isSensitive?: boolean;
        followedOA?: boolean;
    } | null;
    login: (data: { username: string; password: string }) => void;
    logout: () => void;
    showModalPermission: () => void;
    checkAuthorize: () => void;
    phoneNumberZalo: string;
    hasAuthor: boolean;
}
