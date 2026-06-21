import { type ReactNode } from "react";

interface IProps {
    children?: ReactNode | null
}

export default function PlayerList({ children }: IProps) {
    return (
        <div className="bg-base-content/5 w-xs min-h-8/12 p-2 space-y-2 rounded-xl border-[0.5px] border-base-content/10">
            {children}
        </div>
    )
}