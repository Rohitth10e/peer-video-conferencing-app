import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';

const server_url = import.meta.env.VITE_SERVER_URL

function VideoMeet(){
    let localVideoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [video, setVideo] = useState(null);
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

    useEffect(() => {
        if(video != undefined && audio != undefined){
            getMedia();
        }
    }, [audio,video]);

    const getMedia = async () => {
        if(!stream){
            toast.error(`Error getting video stream: ${stream}`);
            return;
        }

        const videoTrack = stream.getVideoTracks();
        const audioTrack = stream.getAudioTracks();
        setVideo(videoTrack.length>0);
        setAudio(audioTrack.length>0);
        // connectToSocketServer();
    }

    return(
        <>
            {
                askUsernameAvailable ?
                <div>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <button onClick={()=>setUsernameAvailable(false)}>Join</button>
                </div> :
                <div>
                    <h2>Hello, {username}</h2>
                    <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    />
                </div>
            }
        </>
    );
}

export default VideoMeet;