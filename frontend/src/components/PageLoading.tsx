import { useThemeStore } from "../store/useThemeStore"
import Navbar from "./Navbar";

export default function PageLoading() {
    const { theme } = useThemeStore();

    return (
        <Navbar>
            <div className="h-screen flex items-center justify-center" data-theme={theme}>
                <div className="loading loading-spinner loading-xl"></div>
            </div>
        </Navbar>
    )
}