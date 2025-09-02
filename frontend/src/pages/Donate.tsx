import { useThemeStore } from "../store/useThemeStore"

export default function Donate(){
    const { theme } = useThemeStore();
    
    return (
        <div className="h-screeN" data-theme={theme}>
            
        </div>
    )
}