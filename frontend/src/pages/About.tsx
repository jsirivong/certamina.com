export default function About(){
    return (
        <div className="h-screen overflow-y-auto" data-theme="light">
            <div className="max-w-screen relative">
                <img src="/aboutbackground.jpg" alt="Black background for about page." className="h-[95vh] w-full"/>
                <h2 className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-8xl text-white font-bold">About</h2>
            </div>
            <div className="divider divider-neutral mx-10"></div>
            <div className="mt-20 p-10 max-w-9xl grid grid-cols-2 justify-between">
                <p className="text-lg" id="about-paragraph"><span className="font-semibold text-2xl">Certamina.com</span>, or simply <span className="font-semibold text-2xl">Certamina</span>
                , is a dedicated website toward the classics-themed quiz bowl-styled game, Certamen. Certamina.com fills in for the missing person you need when you need certamen questioning.</p>
                <img src="/certaminaicon.png" className="size-96 mx-auto" alt="Certamina Website Icon"/>
            </div>
            <div className="divider divider-neutral w-[25vw] mx-auto"></div>
            <div className="mt-32 max-w-9xl">
                <h2 className="font-bold font-[Open Sans] text-7xl text-center" id="about-me-paragraph">About Me</h2>
                <p className="text-lg font-[Open Sans] text-center m-20"><span className="font-semibold text-2xl">Hello!</span> My name is Jonathan Sirivong and I'm a rising high-school sophomore
                    in a small town in New Hampshire. Ever since I entered high school, I've always been captivated by not only the field of classics and the history and culture of Rome, but 
                    the amazing and competitive nature of the community within the trivia game, Certamen. So much so that I participate in Certamen myself on a national level on behalf of New Hampshire. By creating this website, I
                    hope to not only provide practice and resources for myself and others interested in Certamen, but to spread the love and accepting community of the classics to a much greater scale.
                </p>
            </div>
        </div>
    )
}