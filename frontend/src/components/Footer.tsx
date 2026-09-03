interface IProps {
    children: React.ReactNode;
}

export default function Footer({ children }: IProps) {
    return (
        <div className="h-screen overflow-y-auto overflow-x-hidden">
            {children}
            <footer className="footer gap-y-2 text-base-content/50 p-4 bg-base-200 flex justify-between items-center">
                <nav className="flex flex-row items-center">
                    <a href="/privacy-policy">Privacy Policy</a> |
                    <a href="/terms-of-service">Terms of Service</a> |
                    <a>Cookie Settings</a> |
                    <a>Created by Jonathan Sirivong</a>
                </nav>

                <div className="flex flex-row items-center gap-x-4">
                    <img src="/certaminaicon.png" alt="Certamina Icon" className="size-7" />
                    <p>Copyright © {new Date().getFullYear()} - All rights reserved</p>
                </div>
            </footer>
        </div>
    )
}