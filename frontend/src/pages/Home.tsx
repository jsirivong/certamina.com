import { useThemeStore } from "../store/useThemeStore"

export default function Home(){
    const { theme } = useThemeStore();

    return (
        <div className="h-screen overflow-y-auto" data-theme={theme}>
            
        </div>
    )
}