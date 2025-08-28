import { create } from 'zustand';
// "create" is a function, the function returns a custom hook

export type Theme = "light" | "dark";

interface IThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

// a custom hook
export const useThemeStore = create<IThemeStore>()((set) => ({
    theme: localStorage.getItem("theme") as Theme || "light",
    setTheme: (theme: Theme) => {
        set({ theme: theme });
        localStorage.setItem("theme", theme);
    }
}))
