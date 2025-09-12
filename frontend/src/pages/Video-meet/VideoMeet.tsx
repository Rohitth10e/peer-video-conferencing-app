import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import {server} from "../../env.ts";

const server_url = server
var connections = {};
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

function VideoMeet(){
    let localVideoRef = useRef(null);
    let socketRef = useRef(null);
    let socketIdRef = useRef(null);
    let videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [video, setVideo] = useState([]);
    const [audio,setAudio]= useState(null);
    const [askUsernameAvailable, setUsernameAvailable] = useState(true);
    const [username, setUsername] = useState("");

    const getPermissions = async () => {
        try{
            const mediaStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            setStream(mediaStream);
            window.localStream = await mediaStream;
        } catch(err) {
            console.log(err);
            toast.error(`Error getting video stream: ${err.message}`);
        }
    }

    useEffect(()=>{
        getPermissions();
    },[])

    useEffect(() => {
        if(localVideoRef.current && stream){
            localVideoRef.current.srcObject = stream;
        }
    }, [stream, askUsernameAvailable]);

    // if any i.e video or audio is unmuted connect to that unmuted stream
    let getUserMediaSuccess = (stream) =>{
        try {
            window.localStream?.getTracks().forEach((track)=>{ track.stop() });
        } catch(err) {
            console.log(err);
        }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for(let id in connections) {
            if( id == socketIdRef.current ) continue;

            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((desc)=>{
                connections[id].setLocalDescription(desc)
                    .then(()=>{
                        socketIdRef.current.emit("signal", id, JSON.stringify({"sdp":connections[id].localDescription}));
                    })
                    .catch(err => console.log(err));
            })
        }

        stream.getTracks().forEach(track => track.onended=()=>{
            setStream()
            setAudio(false);

            try{
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop() );
            } catch (e) { console.log(e) }

            // TODO BlackSilence
            let blackSilence = (...args) => new MediaStream([black(...args), silence])
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            for (let id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((desc)=>{
                    connections[id].setLocalDescription(desc).then(()=>{
                        socketRef.current.emit("signal", id, JSON.stringify({"sdp":connections[id].localDescription})).catch( err => console.log(err) );
                    })
                })
            }
        })
    }

    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();

        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], {enabled: false});
    }

    let black = ({width = 640, height = 640}={}) => {
        let canvas = Object.assign(document.createElement('canvas'), {width,height});
        canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], {enabled: false});
    }

    let getUserMedia = async () => {
        // if mute or unmute or video on or off
        if(video && audio){
            navigator.mediaDevices.getUserMedia({video: video, audio: audio})
                .then(()=>{getUserMediaSuccess()}) // getUserMediaSuccess
                .then((stream)=>{})
                .catch((err)=>{console.log(err)})
        } else {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track)=> track.stop())
        }
    }

    useEffect(() => {
        if(video != undefined && audio != undefined){
            getUserMedia();
        }
    }, [audio,video]);

    // TODO
    let gotMessageFromServer = (fromId,message) => {
        var signal = JSON.stringify(message);

        if(fromId != socketIdRef.current) {
            if(signal.spd) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
                    if(signal.sdp.type=="offer"){
                        connections[fromId].createAnswer().then((description)=>{
                            socketRef.current.emit("signal", fromId, JSON.stringify({"sdp":connections[fromId].localDescription})).catch((e)=>{
                                console.log(e)
                            })
                        }).catch((e)=>{console.log(e)})
                    }
                }).catch((e)=>{console.log(e)})
            }

            if(signal.ice){
                connections[fromId].addIce(new RTCIceCandidate(signal.ice)).catch((e)=>{console.log(e)});
            }
        }

    }

    //TODO
    let addMessage = (message) => {}

    let connectToSocketServer = () => {
        // socket ka khel yahi se shuru hotha hai
        socketRef.current = io(server_url,{ transports: ["websocket"], withCredentials: true });
        socketRef.current.on('signal', gotMessageFromServer);
        socketRef.current.on('connect', ()=>{
            socketRef.current.emit("join-call", window.location.href);
            socketIdRef.current = socketRef.current.id;
            socketRef.current.on("chat-message", addMessage)
            socketRef.current.on("user-left", (id)=>{
                setVideo((videos)=> videos.filter((video)=>video.socketId !== id))
            })
            socketRef.current.on('user-joined', (id, clients)=>{
                clients.forEach((socketListId)=> {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    // ice protocol
                    // direct connection bw you and other client
                    connections[socketListId].onicecandidate = (event) => {
                        if(event.candidate!= null){
                            socketRef.current.emit("signal", socketListId, JSON.stringify({'ice':event.candidate}));
                        }

                        connections[socketListId].onaddstream = (event) => {
                            let videoExists = videoRef.current.find(video => video.socketId == socketListId);

                            if(videoExists) {
                                setVideo(videos => {
                                    const updateVideos = videos.map(video =>
                                        video.socketId == socketListId ? {...video, stream: event.stream} : video
                                    );
                                    videoRef.current = updateVideos;
                                    return updateVideos;
                                })
                            } else {
                                let newVideo = {
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

                        if(window.localStream != undefined && window.localStream != null){
                            connections[socketListId].addStream(window.localStream);
                        } else {
                            // TODO BLACKSILENCE
                            let blackSilence = (...args) => new MediaStream([black(...args), silence])
                            window.localStream = blackSilence();
                            connections[socketListId].addStream(window.localStream)
                        }


                        if(id == socketIdRef.current){
                            for(let id2 in connections) {
                                if(id2 === socketIdRef.current) continue

                                try{
                                    connections[id2].addStream(window.localStream);
                                } catch(e) {
                                }

                                connections[id2].createOffer().then((desc)=>{
                                    connections[id2].setLocalDescription(desc)
                                        .then(()=>{
                                            socketRef.current.emit("signal", id2, JSON.stringify({"sdp":connections[id2].localDescription}));
                                        })
                                        .catch((err)=>{console.log(err)});
                                })
                            }
                        }
                    }
                })
            });
        });
    }

    const getMedia = async () => {
        if(!stream){
            toast.error(`Error getting video stream: ${stream}`);
            return;
        }

        const videoTrack = stream.getVideoTracks();
        const audioTrack = stream.getAudioTracks();
        setVideo(videoTrack.length>0);
        setAudio(audioTrack.length>0);
        connectToSocketServer();
    }

    let connect = () => {
        setUsernameAvailable(false);
        getMedia();
    }


    return(
        <>
            {
                askUsernameAvailable ?
                    <div>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                               placeholder="Username"/>
                        <button
                            onClick={() =>connect()} >
                            Join
                        </button>
                        <div>
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                            />
                        </div>
                    </div> :
                    <div>
                        <h2>Hello, {username}, {server_url}</h2>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                        />

                        <div>
                            {video.map((vid) => (
                                <div key={vid.socketId}>
                                    <video
                                        autoPlay
                                        playsInline
                                        ref={(ref) => {
                                            if (ref) ref.srcObject = vid.stream;
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                    </div>
            }
        </>
    );
}

export default VideoMeet;