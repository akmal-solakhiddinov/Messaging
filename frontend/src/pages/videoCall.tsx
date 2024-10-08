import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useSystem } from "@/context/systemContext";
import useSocket from "@/hooks/useSocket";
import { useRef, useState, useEffect, useCallback } from "react";

const VideoCall = () => {
    const { friend, setFriend } = useSystem();
    const { user } = useAuth()
    const { isConnected, socket } = useSocket()

    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null)

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isSharingScreen, setIsSharingScreen] = useState(false);

    const [startCall, setStartCall] = useState(false)
    const [incomingCall, setIncomingCall] = useState<{ offer: RTCSessionDescriptionInit, roomId: string, myId: string } | null>(null)

    const myVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerVideoRef = useRef<HTMLVideoElement | null>(null);
    const myStreamRef = useRef<MediaStream | null>(null);


    const openMediaDevice = async (constraints: object) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            return stream;
        } catch (error) {
            console.error("Error accessing media devices:", error);
            throw error;
        }
    }
    const handleEndCall = useCallback(async () => {
        // Send signal to peer to end the call
        if (socket && friend) {
            socket.emit('endCall', { roomId: friend });
        }

        // Stop all media streams
        if (myStreamRef.current) {
            myStreamRef.current.getTracks().forEach(track => track.stop());
            myStreamRef.current = null;
        }

        // Optionally stop peer's media stream if it's active
        if (peerVideoRef.current && peerVideoRef.current.srcObject) {
            const peerStream = peerVideoRef.current.srcObject as MediaStream;
            peerStream.getTracks().forEach(track => track.stop());
            peerVideoRef.current.srcObject = null;
        }

        if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
        }

        // End the call in the app UI
        console.log('call ended');

        setFriend('');
        setIncomingCall(null);
        setStartCall(false);
    }, [friend, peerConnection, setFriend, socket]);



    const createPeerConnection = useCallback(() => {
        const configuration = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        };

        const pc = new RTCPeerConnection(configuration)

        console.log("PeerConnection created:", pc);

        pc.onicecandidate = (ev) => {
            console.log("ICE Candidate:", ev.candidate);
            if (ev.candidate && socket && user?.id) {
                socket.emit("candidate", {
                    candidate: ev.candidate,
                    roomId: friend,
                    myId: user?.id
                });
            }
        }

        pc.ontrack = event => {
            console.log("Received track:", event.streams[0]);
            if (peerVideoRef.current) {
                peerVideoRef.current.srcObject = event.streams[0];
            }
        }

        // Monitor connectionState
        pc.onconnectionstatechange = () => {
            console.log("Connection State:", pc.connectionState);
            switch (pc.connectionState) {
                case "connected":
                    console.log("Peers connected successfully.");
                    break;
                case "disconnected":
                case "failed":
                    console.log("Connection failed or disconnected.");
                    handleEndCall(); // End the call gracefully
                    break;
                case "closed":
                    console.log("Connection closed.");
                    break;
                default:
                    break;
            }
        };

        // Monitor iceConnectionState
        pc.oniceconnectionstatechange = () => {
            console.log("ICE Connection State:", pc.iceConnectionState);
            switch (pc.iceConnectionState) {
                case "connected":
                case "completed":
                    console.log("ICE negotiation completed.");
                    break;
                case "disconnected":
                case "failed":
                    console.log("ICE connection failed or disconnected.");
                    handleEndCall(); // End the call gracefully
                    break;
                case "closed":
                    console.log("ICE connection closed.");
                    break;
                default:
                    break;
            }
        };

        // Monitor signalingState
        pc.onsignalingstatechange = () => {
            console.log("Signaling State:", pc.signalingState);
            // Additional handling based on signaling state can be added here
        };

        setPeerConnection(pc)
        return pc
    }, [friend, socket])


    const handleOffer = async (offer: RTCSessionDescriptionInit, roomId: string, myId: string) => {
        setIncomingCall({ offer, roomId, myId });
    };

    const handleAnswerCall = async () => {
        if (!incomingCall) return;
        const { offer, roomId, myId } = incomingCall;
        // console.log("Handling answer call:", offer, roomId, myId)
        setFriend(roomId);
        setStartCall(true);
        try {
            const stream = await openMediaDevice({
                audio: true,
                video: true,
            });

            myStreamRef.current = stream; // Store the stream reference
            if (myVideoRef.current) {
                myVideoRef.current.srcObject = stream;
            }

            const pc = createPeerConnection();
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });
            // console.log('Remote description started')
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            // console.log("Created answer:", answer)

            await pc.setLocalDescription(answer);
            socket.emit("answer", { answer, roomId, myId });
            setIncomingCall(null);
            // console.log("Connection State after answer:", pc.connectionState)

        } catch (error) {
            console.error("Error handling offer:", error);
            alert("Failed to access camera. Please check your device settings.");
        }
    };


    // Toggle Mute/Unmute
    const handleToggleMute = () => {
        if (myStreamRef.current) {
            const audioTrack = myStreamRef.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    // Toggle Video On/Off
    const handleToggleVideo = () => {
        if (myStreamRef.current) {
            const videoTrack = myStreamRef.current.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOn(videoTrack.enabled);
        }
    };

    // Toggle Screen Sharing
    const handleToggleScreenShare = async () => {
        if (isSharingScreen) {
            // Stop screen sharing and switch back to video stream
            const videoTrack = (myStreamRef.current as MediaStream).getVideoTracks()[0];
            if (myVideoRef.current) {
                (myVideoRef.current as unknown as HTMLVideoElement).srcObject = myStreamRef.current;
            }
            videoTrack.enabled = true;
            setIsSharingScreen(false);
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });
                if (myVideoRef.current) {
                    (myVideoRef.current as unknown as HTMLVideoElement).srcObject = screenStream;
                }
                setIsSharingScreen(true);
            } catch (err) {
                console.error("Error during screen sharing: ", err);
            }
        }
    };


    useEffect(() => {
        if (socket && isConnected) {
            const handleOfferMessage = async (message: { offer: RTCSessionDescriptionInit, roomId: string, myId: string }) => {
                const { offer, roomId, myId } = message;
                await handleOffer(offer, roomId, myId);
            };

            const handleAnswerMessage = async (message: { answer: RTCSessionDescriptionInit, roomId: string, myId: string }) => {
                const { answer, roomId, myId } = message;
                console.log("Received answer:", answer, roomId, myId)

                if (peerConnection) {
                    await peerConnection.setRemoteDescription(
                        new RTCSessionDescription(answer)
                    );
                }
            };

            const handleCandidateMessage = async (message: { candidate: object, roomId: string, myId: string }) => {
                const { candidate, myId, roomId } = message;
                console.log("Received ICE Candidate:", candidate, 'my id:', myId, 'room id:', roomId)

                if (peerConnection) {
                    try {

                        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                        console.log("Added ICE Candidate:", candidate);
                    } catch (error) {
                        console.error("Error adding received ICE candidate", error);
                    }
                }
            };

            const handleEndCallMessage = () => {
                console.log("End call message received");
                handleEndCall();
            };

            socket.on("offer", handleOfferMessage);
            socket.on("answer", handleAnswerMessage);
            socket.on("candidate", handleCandidateMessage);
            socket.on("endCall", handleEndCallMessage);

            return () => {
                socket.off("offer", handleOfferMessage);
                socket.off("answer", handleAnswerMessage);
                socket.off("candidate", handleCandidateMessage);
                socket.off("endCall", handleEndCallMessage);
            };
        }
    }, [socket, peerConnection, isConnected, handleEndCall, user?.id]);

    useEffect(() => {
        const handleCall = async () => {
            setStartCall(true);
            try {
                const stream = await openMediaDevice({
                    audio: true,
                    video: true,
                });

                myStreamRef.current = stream; // Store the stream reference
                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = stream;
                }

                const pc = createPeerConnection();
                stream.getTracks().forEach(track => {
                    pc.addTrack(track, stream);
                });

                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                if (user?.id)
                    socket.emit('offer', {
                        offer,
                        roomId: friend,
                        myId: user?.id
                    });

                console.log("Offer sent:", offer);
            } catch (error) {
                console.error("Error in handleCall:", error);
            }
        };

        if (friend) {
            console.log("Initiating call...");
            handleCall();
        }
    }, [createPeerConnection, friend, socket, user?.id]
    )

    /*     // Cleanup on component unmount
        useEffect(() => {
            return () => {
                handleEndCall();
            };
        }, [handleEndCall.]);
    
     */
    if (incomingCall) return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow">
                <p>Incoming call...</p>
                <button
                    onClick={handleAnswerCall}
                    className="bg-green-500 text-white px-4 py-2 rounded m-2"
                >
                    Answer
                </button>
                <button
                    onClick={handleEndCall}
                    className="bg-red-500 text-white px-4 py-2 rounded m-2"
                >
                    Hang Up
                </button>
            </div>
        </div>
    )


    return (
        startCall && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-500">
                <div className="relative w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 transition-all duration-500 ease-in-out">
                    {/* Video Call Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-white">Video Call with {friend}</h2>
                        <Button
                            className="px-3 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg"
                            onClick={handleEndCall}
                        >
                            End Call
                        </Button>
                    </div>

                    {/* Video Display */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {/* My Video */}
                        <div className="relative aspect-video bg-gray-400 rounded-lg overflow-hidden">
                            <video
                                ref={myVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                                You
                            </div>
                        </div>

                        {/* Peer Video */}
                        <div className="relative aspect-video bg-gray-400 rounded-lg overflow-hidden">
                            <video
                                ref={peerVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                                {friend}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center mt-6">
                        {/* Mute/Unmute Button */}
                        <Button
                            className={`mx-2 px-4 py-2 ${isMuted ? 'bg-gray-500' : 'bg-green-500'} hover:bg-green-600 text-white rounded-full transition-all duration-300`}
                            onClick={handleToggleMute}
                        >
                            {isMuted ? 'Unmute' : 'Mute'}
                        </Button>

                        {/* Video On/Off Button */}
                        <Button
                            className={`mx-2 px-4 py-2 ${!isVideoOn ? 'bg-gray-500' : 'bg-blue-500'} hover:bg-blue-600 text-white rounded-full transition-all duration-300`}
                            onClick={handleToggleVideo}
                        >
                            {isVideoOn ? 'Video Off' : 'Video On'}
                        </Button>

                        {/* Screen Share Button */}
                        <Button
                            className={`mx-2 px-4 py-2 ${isSharingScreen ? 'bg-gray-500' : 'bg-yellow-500'} hover:bg-yellow-600 text-white rounded-full transition-all duration-300`}
                            onClick={handleToggleScreenShare}
                        >
                            {isSharingScreen ? 'Stop Share' : 'Screen Share'}
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
};

export default VideoCall;


// Start video streams (you would replace this with actual WebRTC logic)
/*     useEffect(() => {
        const getMediaStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
 
 
                // console.log(stream.getTracks(), '< stream my video')
                myStreamRef.current = stream; // Store the stream reference
                if (myVideoRef.current) {
                    (myVideoRef.current as unknown as HTMLVideoElement).srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing user media: ", err);
            }
 
            // Simulating peer video stream
            if (peerVideoRef.current) {
                const peerStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                (peerVideoRef.current as unknown as HTMLVideoElement).srcObject = peerStream;
            }
        };
 
        if (friend)
            getMediaStream();
    }, [friend]); */
