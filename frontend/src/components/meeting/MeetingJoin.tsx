import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.tsx";
import { useState, useEffect } from "react";
import {MeetingJoinBrandInfo} from "./MeetingJoinBrandInfo.tsx";
import {toast} from "react-toastify";

export function MeetingJoin({videoRef, mic, vid, setMic, setVid}) {
    const navigate = useNavigate();
    const { user } = useUser();
    const [meetingSelection, setMeetingSelection] = useState<"create" | "join">("create");
    const [meetingName, setMeetingName] = useState("");
    const [meetingId, setMeetingId] = useState("");
    const [scheduledAt, setScheduledAt] = useState("");
    const [duration, setDuration] = useState(30);

    const username = user?.username || "User";
    const initials = user?.name
        ?.split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("") || "U";

    const handleCreate = async() => {
        const token = localStorage.getItem("authToken");
        console.log(token);
        try {
            const response =await fetch("/api/v1/users/create-meet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ meeting_name: meetingName, scheduledAt: scheduledAt, duration: duration }),
            });


            const data = await response.json();

            if(data.meetingCode){
                navigate(`/meeting/${data.meetingCode}`);
            }
            console.log(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleJoin = async() => {
        const token = localStorage.getItem("authToken");
        try{
            const response = await fetch(`api/v1/users/join-meet`,{
                method: "POST",
                headers:{
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ meetingCode: meetingId }),
            });
            const data = await response.json();
            console.log(data);

            if(response.status!=201){
                alert(data.error)
                return;
            }

            const now = new Date();
            const start = new Date(data.scheduledAt);
            const end = new Date(start.getTime() + data.duration * 60000);

            if(now< start){
                toast.warn("Meeting hasn't started yet")
                return;
            }

            if(now>end){
                toast.error("Meeting has ended")
                return;
            }

            if (data.meeting_id) {
                navigate(`/meeting/${data.meeting_id}`);
            } else {
                toast.error("Invalid meeting response");
            }

        } catch (err) {
            console.error(err.message);
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Navbar */}
            <div
                className="w-full bg-white flex justify-between items-center border-b border-zinc-200 py-2 px-36 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        className="fas fa-arrow-left text-zinc-600 hover:text-zinc-800"
                        onClick={() => navigate("/dashboard")}
                    />
                    <h3 className="font-semibold text-xl text-blue-500">PeerLink</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 hover:bg-blue-50 px-2 py-1 rounded-md">
                        <div
                            className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold cursor-pointer">
                            {initials}
                        </div>
                        <span className="hidden sm:inline font-medium text-zinc-700">{username}</span>
                    </button>
                </div>
            </div>

            {/* Main Layout */}
            <div
                className="main-layout w-full bg-zinc-100 py-10 px-36 flex justify-between">
                <div className='left-container'>
                    <div className='flex items-center gap-8'>
                        <p
                            className={meetingSelection === "create" ? 'text-blue-500 cursor-pointer' : 'cursor-pointer'}
                            onClick={() => setMeetingSelection("create")}
                        >
                            Create
                        </p>
                        <p
                            className={meetingSelection === "join" ? 'text-blue-500 cursor-pointer' : 'cursor-pointer'}
                            onClick={() => setMeetingSelection("join")}
                        >
                            Join
                        </p>
                    </div>
                    {
                        meetingSelection === "create" ?
                            <div
                                className={"flex flex-col items-start w-[350px] rounded-md bg-white p-4 h-auto mt-8 gap-8"}>
                                <div className="card-head">
                                    <p className='font-semibold tracking-tighter mb-5'>Create a meeting</p>
                                    <div className="flex flex-col items-start mb-2">
                                        <label htmlFor='meeting-name' className='meeting-input-label'>Meeting name</label>
                                        <input
                                            type='text'
                                            value={meetingName}
                                            onChange={(e) => setMeetingName(e.target.value)}
                                            placeholder='Meeting name(optional)'
                                            className='text-sm w-[320px] outline-none rounded-md border-zinc-300 border-[1px] p-2 mt-2'
                                        />
                                    </div>
                                    <div className="flex flex-col items-start mb-2">
                                        <label htmlFor="meeting-schedule" className='meeting-input-label'>Schedule your
                                            meet</label>
                                        <input
                                            type="datetime-local"
                                            value={scheduledAt}
                                            min={new Date().toISOString().slice(0, 16)}
                                            onChange={(e) => setScheduledAt(e.target.value)}
                                            className='text-sm w-[320px] outline-none rounded-md border border-zinc-300 p-2 mt-2
             focus:ring-2 focus:ring-blue-400 focus:border-blue-400
             [color-scheme:light] cursor-pointer'
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col items-start mb-2">
                                        <label htmlFor="duration" className="meeting-input-label">
                                            Meeting duration
                                        </label>
                                        <div className="relative w-[320px] mt-2">
                                            <input
                                                id="duration"
                                                type="number"
                                                value={duration}
                                                onChange={(e) => setDuration(parseInt(e.target.value))}
                                                placeholder="Duration"
                                                className="text-sm w-full outline-none rounded-md border border-zinc-300 border-[1px] p-2 pr-12"
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
      mins
    </span>
                                        </div>
                                    </div>

                                </div>
                                <div className='card-foot'>
                                    <button
                                        className='px-2 w-[320px] py-1 bg-blue-500 text-white rounded-sm font-semibold cursor-pointer'
                                        onClick={handleCreate}>
                                        create
                                    </button>
                                </div>
                            </div> :

                            <div
                                className={"flex flex-col items-start w-[350px] rounded-md bg-white p-4 h-auto mt-8 gap-8"}>
                                <div className="card-head">
                                    <p className='font-semibold tracking-tighter'>Join a meeting</p>
                                    <input
                                        type='text'
                                        value={meetingId}
                                        onChange={(e) => setMeetingId(e.target.value)}
                                        placeholder='Meeting ID'
                                        className='w-[320px] text-sm outline-none rounded-md border-zinc-300 border-[1px] p-2 mt-2'
                                    />
                                </div>
                                <div className='card-foot'>
                                    <button
                                        className='px-2 py-1 w-[320px] bg-blue-500 text-white rounded-sm font-semibold cursor-pointer'
                                        onClick={handleJoin}>
                                        Join
                                    </button>
                                    <p className='text-xs text-zinc-500 tracking-tighter mt-2'>Room IDs are 10
                                        characters long (letters and numbers)</p>
                                </div>
                            </div>
                    }
                </div>
                <div className='right-container'>
                    <video
                        ref={videoRef}
                        muted
                        autoPlay
                        playsInline
                        className="rounded-xl max-h-80"
                    />
                    <div className='flex items-center gap-5 my-2'>
                        <button
                            className={`fa-solid fa-microphone text-2xl ${mic ? 'text-green-500' : 'text-red-500'}`}
                            onClick={() => setMic((prev) => !prev)}
                        />
                        <button
                            className={`fa-solid fa-video text-2xl ${vid ? 'text-green-500' : 'text-red-500'}`}
                            onClick={() => setVid((prev) => !prev)}
                        />
                    </div>
                </div>
            </div>
            <MeetingJoinBrandInfo/>
        </div>
    );
}
