import { useThemeStore } from "../store/useThemeStore"

export default function PageLoading(){
    const { theme } = useThemeStore();
    
    return (
        <div className="h-screen flex items-center justify-center" data-theme={theme}>
            <div className="loading loading-spinner loading-xl"></div>
        </div>
    )
}