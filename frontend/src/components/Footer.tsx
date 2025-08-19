interface IProps {
    children: React.ReactNode;
}

export default function Footer({ children }: IProps) {
    return (
        <div>
            {children}
            <footer className="footer gap-y-2 sm:footer-horizontal footer-center text-base-content/50 p-4 bg-base-200">
                <img src="certaminaicon.png" alt="Certamina Icon" className="size-7"/>
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All rights reserved.</p>
                </aside>
            </footer>
        </div>
    )
}