interface IProps {
    username: string;
    profile_picture?: string;
}

export default function PlayerCard({username, profile_picture}: IProps ){
    return (
        <div className="bg-base-100 shadow-sm w-full max-h-15 rounded-2xl">
            <div className="flex flex-row space-x-4 items-center">
                <div className="avatar">
                    <div className="rounded-full size-13">
                        <img src="/avatar-placeholder.jpg" alt={`User ${username}'s profile picture.`}/>
                    </div>
                </div>
                <h2 className="card-title">{username}</h2>
            </div>
        </div>
    )
}