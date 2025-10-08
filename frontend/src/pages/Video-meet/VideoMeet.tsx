import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import {server} from "../../env.ts";
import {MeetingJoin} from "../../components/meeting/MeetingJoin.tsx";
import {useParams} from "react-router-dom";
import {useUser} from "../../context/UserContext.tsx";
import api from "../../api/api.ts";
import {
    Mic, MicOff, Video, VideoOff, Monitor, MessageCircle, LogOut
} from 'lucide-react';

const server_url = server
const connections = {};
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

// const TopBar = ({ meetingName, meetingId }) => (
//     <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
//         <h2 className="font-semibold text-lg">{meetingName || 'Meeting'}</h2>
//         <div className="flex items-center gap-4">
//             <span className="flex items-center gap-2 text-sm">
//                 <Users size={20} />
//                 {/* Placeholder for participant count */}
//                 <span>{video.length + 1}</span>
//             </span>
//             <button
//                 onClick={() => {
//                     navigator.clipboard.writeText(window.location.href)
//                         .then(() => toast.success("Meeting link copied!"))
//                         .catch(() => toast.error("Failed to copy link"));
//                 }}
//                 className="flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-sm px-4 py-2 rounded-full font-medium transition"
//             >
//                 <Copy size={16} />
//                 Copy Link
//             </button>
//         </div>
//     </div>
// );

function VideoMeet(){
    const localVideoRef = useRef(null);
    const socketRef = useRef(null);
    const socketIdRef = useRef(null);
    const videoRef = useRef([]);               // <-- changed: initialize as array
    const videoEnabled = useRef(true);
    const audioEnabled = useRef(true);
    const [stream, setStream] = useState(null);
    const [video, setVideo] = useState([]);   // keep ONLY for remote videos
    const [askUsernameAvailable, setUsernameAvailable] = useState(true);
    const [mic, setMic] = useState(false);
    const [vid, setVid] = useState(false);
    const [meeting, setMeeting] = useState([]);

    const { id } = useParams();
    console.log("Meeting ID:", id);
    const {user} = useUser()

    function handleJoinMicToggle(){
        const audioTrack = window.localStream?.getAudioTracks()[0];
        if (audioTrack) {
            const newEnabled = !audioTrack.enabled;
            audioTrack.enabled = newEnabled;
            setMic(newEnabled);
        }
    }

    function handleJoinVideoToggle(){
        const videoTrack = window.localStream?.getVideoTracks()[0];
        if (videoTrack) {
            const newEnabled = !videoTrack.enabled;
            videoTrack.enabled = newEnabled;
            setVid(newEnabled);
        }
    }

    // useEffect(() => {
    //     if (localVideoRef.current && stream) {
    //         localVideoRef.current.srcObject = stream;
    //     }
    // }, [stream]);

    useEffect(() => {
        async function getMeetingInfo(){
            try{
                const response = await api.get(`users/meeting/${id}`);
                setMeeting(response.data);
            } catch(err){
                console.error(err.message);
            }
        }

        if(id){
            getMeetingInfo()
        }

    }, [id]);

    console.log(meeting.meetingData?.meeting_name);


    useEffect(()=> {
        if(id && stream) {
            connect();
        }
    }, [id, stream])

    const getPermissions = async () => {
        try{
            const mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            setStream(mediaStream);
            window.localStream = mediaStream;
            setMic(true);
            setVid(true);
            // show local immediately if mounted
            if (localVideoRef.current) localVideoRef.current.srcObject = mediaStream;
            return mediaStream;
        } catch(err) {
            console.log(err);
            toast.error(`Error getting video stream: ${err.message}`);
            return null;
        }
    }

    useEffect(()=>{
        // run once
        getPermissions();
    },[])

    useEffect(() => {
        if(localVideoRef.current && stream){
            localVideoRef.current.srcObject = stream;
        }
    }, [stream, askUsernameAvailable]);

    // if any i.e video or audio is unmuted connect to that unmuted stream
    const getUserMediaSuccess = (s) =>{
        try {
            window.localStream?.getTracks().forEach((track)=>{ track.stop() });
        } catch(err) {
            console.log(err);
        }

        window.localStream = s;
        if (localVideoRef.current) localVideoRef.current.srcObject = s;

        for(const id in connections) {
            if( id == socketIdRef.current ) continue;

            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((desc)=>{
                connections[id].setLocalDescription(desc)
                    .then(()=>{
                        socketRef.current.emit("signal", id, JSON.stringify({"sdp":connections[id].localDescription}));
                    })
                    .catch(err => console.log(err));
            })
        }

        s.getTracks().forEach(track => track.onended=()=>{
            videoEnabled.current = false;
            audioEnabled.current = false;

            try{
                const tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop() );
            } catch (e) { console.log(e) }

            // BlackSilence fallback
            const blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence();
            if (localVideoRef.current) localVideoRef.current.srcObject = window.localStream;

            for (const id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((desc)=>{
                    connections[id].setLocalDescription(desc).then(()=>{
                        socketRef.current.emit("signal", id, JSON.stringify({"sdp":connections[id].localDescription}));
                    }).catch( err => console.log(err) );
                })
            }
        })
    }

    const silence = () => {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();

        const dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], {enabled: false});
    }

    const black = ({width = 640, height = 640}={}) => {
        const canvas = Object.assign(document.createElement('canvas'), {width,height});
        canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);
        const stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], {enabled: false});
    }

    const getUserMedia = async () => {
        // if mute or unmute or video on or off
        if(videoEnabled.current && audioEnabled.current){
            navigator.mediaDevices.getUserMedia({video: true, audio: true})
                .then((s)=>{ getUserMediaSuccess(s) }) // pass stream
                .catch((err)=>{console.log(err)})
        } else {
            try {
                const tracks = localVideoRef.current?.srcObject?.getTracks() || [];
                tracks.forEach((track)=> track.stop())
            } catch (e) { console.log(e) }
        }
    }

    // <-- removed the old useEffect that used ref.current in deps (it doesn't react to ref changes)

    const gotMessageFromServer = (fromId,message) => {
        let signal;
        try {
            signal = typeof message === "string" ? JSON.parse(message) : message;
        } catch(e) {
            console.error("Invalid signal message:", message);
            return;
        }

        if(fromId != socketIdRef.current) {
            if(signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
                    if(signal.sdp.type=="offer"){
                        connections[fromId].createAnswer().then((description)=>{
                            connections[fromId].setLocalDescription(description).then(()=>{
                                socketRef.current.emit("signal", fromId, JSON.stringify({"sdp":description}));
                            })
                        }).catch((e)=>{console.log(e)})
                    }
                }).catch((e)=>{console.log(e)})
            }

            if(signal.ice){
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch((e)=>{console.log(e)});
            }
        }
    }

    //TODO
    const addMessage = (message) => {}

    const connectToSocketServer = () => {
        socketRef.current = io(server_url,{ transports: ["websocket"], withCredentials: true });
        socketRef.current.on('signal', gotMessageFromServer);
        socketRef.current.on('connect', ()=>{
            socketRef.current.emit("join-call", {
                room:window.location.href,
                username: user?.username
            });
            socketIdRef.current = socketRef.current.id;
            socketRef.current.on("chat-message", addMessage)
            socketRef.current.on("user-left", (id)=>{
                setVideo((videos)=> videos.filter((video)=>video.socketId !== id))
                // also ensure videoRef mirror is cleaned
                videoRef.current = (videoRef.current || []).filter(v => v.socketId !== id);
            })
            socketRef.current.on('user-joined', (id, clients, username)=>{
                clients.forEach((socketListId)=> {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    connections[socketListId].onicecandidate = (event) => {
                        if(event.candidate!= null){
                            socketRef.current.emit("signal", socketListId, JSON.stringify({'ice':event.candidate}));
                        }
                    };

                    // set onaddstream separately (outside onicecandidate — your previous code nested it)
                    connections[socketListId].onaddstream = (event) => {
                        const videoExists = (videoRef.current || []).find(video => video.socketId == socketListId);

                        if(videoExists) {
                            setVideo(videos => {
                                const updateVideos = videos.map(video =>
                                    video.socketId == socketListId ? {...video, stream: event.stream} : video
                                );
                                videoRef.current = updateVideos;
                                return updateVideos;
                            })
                        } else {
                            const newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsInline: true
                            };

                            setVideo(video=>{
                                const updatedVideos = [...video, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    // Add the local stream if available
                    if(window.localStream != undefined && window.localStream != null){
                        try { connections[socketListId].addStream(window.localStream); } catch(e) { console.warn(e) }
                    } else {
                        const blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if(id == socketIdRef.current){
                    for(const id2 in connections) {
                        if(id2 === socketIdRef.current) continue
                        try{
                            connections[id2].addStream(window.localStream);
                        } catch(e) {}
                        connections[id2].createOffer().then((desc)=>{
                            connections[id2].setLocalDescription(desc)
                                .then(()=>{
                                    socketRef.current.emit("signal", id2, JSON.stringify({"sdp":connections[id2].localDescription}));
                                })
                                .catch((err)=>{console.log(err)});
                        })
                    }
                }
            });
        });
    }

    const getMedia = async () => {
        // ensure we have a stream before proceeding
        if(!stream){
            // try to obtain permissions synchronously here
            const s = await getPermissions();
            if(!s){
                toast.error(`Cannot access camera/mic.`);
                return;
            }
            // update local stream var used by rest of flow
            setStream(s);
            window.localStream = s;
            if(localVideoRef.current) localVideoRef.current.srcObject = s;
        }

        // now stream exists — set refs based on actual tracks
        const videoTrack = window.localStream.getVideoTracks();
        const audioTrack = window.localStream.getAudioTracks();

        videoEnabled.current = videoTrack.length > 0;
        audioEnabled.current = audioTrack.length > 0;

        // call getUserMedia to (re)apply behavior if needed
        getUserMedia();

        connectToSocketServer();
    }

    const connect = () => {
        setUsernameAvailable(false);
        getMedia();
    }

    return (
        <>
            {askUsernameAvailable ? (
                <div className='flex flex-col items-center justify-center h-screen bg-zinc-900'>
                    <MeetingJoin
                        videoRef={localVideoRef}
                        mic={mic}
                        vid={vid}
                        onMictoggle={handleJoinMicToggle}
                        onVidtoggle={handleJoinVideoToggle}
                    />
                </div>
            ) : (
                <div className="w-full h-screen bg-zinc-900 text-white flex flex-col">
                    {/* Top Bar */}
                    <div className="flex justify-between items-center px-6 py-3 bg-transparent">
                        <h2 className="font-semibold text-md">{meeting.meetingData?.meeting_name}</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const meetingCode = id;
                                    navigator.clipboard.writeText(meetingCode)
                                        .then(() => toast.success("Meeting link copied!"))
                                        .catch(() => toast.error("Failed to copy link"));
                                }}
                                className="text-blue-500 text-xs px-4 py-2 rounded-md font-medium transition"
                            >
                                Copy Meet Code
                            </button>

                            <button
                                onClick={() => window.location.href = "/dashboard"}
                                className="bg-red-600 hover:bg-red-700 text-sm p-2 rounded-md font-medium transition text-white flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                <p className='text-xs'>Leave Meeting</p>
                            </button>
                        </div>
                    </div>

                    {/* Video Grid */}
                    <div className="flex-1 grid gap-2 p-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-auto">
                        {/* Local Video */}
                        <div className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm">
                You
              </span>
                        </div>

                        {/* Remote Videos */}
                        {video.map((vid) => (
                            <div key={vid.socketId} className="relative bg-black rounded-lg overflow-hidden flex items-center justify-center">
                                <video
                                    autoPlay
                                    playsInline
                                    ref={(ref) => { if (ref && vid.stream) ref.srcObject = vid.stream; }}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <span className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm">
                  {vid.username || vid.socketId}
                </span>
                            </div>
                        ))}
                    </div>

                    {/* Control Bar */}
                    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-zinc-800/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-zinc-700">
                        {/* Mic */}
                        <button
                            onClick={handleJoinMicToggle}
                            className="p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 transition"
                        >
                            {mic ? <Mic size={20} color="#34D399" /> : <MicOff size={20} color="#F87171" />}
                        </button>

                        {/* Video */}
                        <button
                            onClick={handleJoinVideoToggle}
                            className="p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 transition"
                        >
                            {vid ? <Video size={20} color="#34D399" /> : <VideoOff size={20} color="#F87171" />}
                        </button>

                        {/* Screen Share */}
                        <button className="p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 transition">
                            <Monitor size={20} color="#fff" />
                        </button>

                        {/* Chat */}
                        <button className="p-3 rounded-full bg-zinc-700 hover:bg-zinc-600 transition">
                            <MessageCircle size={20} color="#fff" />
                        </button>

                        {/* Leave */}
                        <button
                            onClick={() => window.location.href = "/dashboard"}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-medium transition flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Leave
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default VideoMeet;
