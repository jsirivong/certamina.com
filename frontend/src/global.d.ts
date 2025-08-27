export {};

declare global {
    const puter: {
        ai: {
            chat: (prompt: string) => Promise<string>;
            txt2img: (prompt: string) => Promise<Blob>;
            txt2speech: (text: string, options?: {
                language: string,
                voice: string,
                engine: string,
                generative: "standard" = "standard"
            }) => Promise<>;
        };
        fs: {
            write: (path: string, content: string) => Promise<void>;
            read: (path: string) => Promise<{ text: () => Promise<string> }>;
            upload: (files: FileList | File[]) => Promise<{ path: string }>;
        };
        auth: {
            isSignedIn: () => boolean;
            signIn: () => Promise<void>;
            signOut: () => Promise<void>;
            getUser: () => Promise<any>;
        };
        kv: {
            set: (key: string, value: any) => Promise<void>;
            get: (key: string) => Promise<any>;
        };
        hosting: {
            create: (options: { name: string; files: any }) => Promise<any>;
        };
    };
}
