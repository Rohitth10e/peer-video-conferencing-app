import {Cards} from "../Cards/Cards.tsx";

export function MeetingJoinBrandInfo() {
    return (
        <div className="bg-zinc-100">
            <div className='bg-transparent  w-full bg-blue-50 min-h-screen py-10 px-5 flex justify-around'>
                <Cards
                    text="End-to-End Encrypted"
                    icon="fa-lock"
                    color="green"
                    desc="Direct peer connections with no server storage"
                />
                <Cards
                    text="Easy to use"
                    icon="fa-globe"
                    color="blue"
                    desc="Effortless setup and intuitive controls"
                />
                <Cards
                    text="Up to 8 Participants"
                    icon="fa-users"
                    color="purple"
                    desc="High-quality video with multiple participants"
                />
            </div>
        </div>
    )
}