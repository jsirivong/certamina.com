import { HashLink } from 'react-router-hash-link'

interface IProps {
    children: React.ReactNode;
}

export default function Footer({ children }: IProps) {
    return (
        <div>
            {children}
            <footer className="footer gap-y-2 sm:footer-horizontal footer-center text-base-content/50 p-4 bg-base-200">
                <aside className="">
                    <img src="/certaminaicon.png" alt="Certamina Icon" className="size-7" />
                </aside>
                <aside>
                    <p>Copyright © {new Date().getFullYear()} - All rights reserved | <HashLink to={"/about#about-me-paragraph"} smooth className="hover:underline hover:cursor-pointer">Jonathan Sirivong</HashLink> | <a className="hover:underline hover:cursor-pointer" href="/contact">Contact</a></p>
                </aside>
            </footer>
        </div>
    )
}