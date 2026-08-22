import { create } from "zustand";

interface IGuestUserStore {
    username: string | null;
    setUser: (username: string | null) => void;
}

export const useGuestUserStore = create<IGuestUserStore>((set) => ({
    username: null,
    setUser: (username) => {
        if (username){
            set({ username: username});
        } else if (username === null){
            set({ username: null });
        }
    }
}))

