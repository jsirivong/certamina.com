import { create } from 'zustand';

interface IUserStore {
    user: {email: string, username: string} | null;
    setUser: (user: ({email: string, username: string} | null)) => void;
}

export const useUserStore = create<IUserStore>()((set) => ({
    user: null,
    setUser: (user) => {
        if (user?.email && user?.username){
            set({ user: {email: user.email, username: user.username}})
        } else if (user === null){
            set({ user: null })
        }
    }
}))
