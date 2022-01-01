import React from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { videoWindowCallState, videoCallState, currentChatState } from '../../atoms/modalAtom'
import { useContext } from 'react'
import SocketContext from '../../SocketContext'
function VideoCallWindow() {
    const [videCallState, setVideCallState] = useRecoilState(videoCallState)
    const [open, setOpen] = useRecoilState(videoWindowCallState)
    const { data: session } = useSession()
    const socket = useContext(SocketContext)

    var peerVideo = useRef(null)
    var userVideo = useRef(null)
    var rtcPeerConnection;
    var userStream;
    var constraints = {
        audio: true,
        video: { width: 1280, height: 720 }
    }
    console.log(videCallState);

    var creator = false;
    var iceServers = {
        iceServer: [
            {
                urls: 'stun:stun.l.google.com:19302'
            },
            {
                urls: 'stun:stun4.l.google.com: 1930'
            }
        ]
    }


    const join = () => {
        console.log(videCallState);

        socket.emit('join', {
            receiverId: videCallState.roomName,

        })




    }
    socket.on('full', () => {
        console.log('busy');
    })





    // const join = () => {
    //     socket.emit('join', roomName);

    // }

    socket.on('created', () => {
        console.log('created');
        creator = true;
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                userStream = stream;
                console.log(stream);
                userVideo.current.srcObject = stream;
                userVideo.current.onloadedmetadata = function (e) {
                    userVideo.current.play();
                };


            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
                alert(err.name + ": " + err.message);
            });
    });

    socket.on('joined', () => {
        creator = false;
        console.log('joined room  ' + videCallState.roomName);



        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
                userStream = stream;
                console.log(stream.id);
                userVideo.current.srcObject = stream;
                userVideo.current.onloadedmetadata = function (e) {
                    userVideo.current.play();
                };
                socket.emit('ready', videCallState.roomName);

            })
            .catch(function (err) {
                alert(err.name + ": " + err.message);
                console.log(err.name + ": " + err.message)
            });
    });

    socket.on('full', () => {
        alert('Room is full');
    });

    socket.on("ready", function () {
        console.log("ready from server");
        //after two users are ready, the creator(if creator===true) will create the offer peer connection
        if (creator) {
            // Create RTCPeerConnection using the configuration object obtained from the server==1
            rtcPeerConnection = new RTCPeerConnection(iceServers);
            //createing and emitting self icecandidate==2  
            rtcPeerConnection.onicecandidate = onIceCandidate;//#######
            //add peer stream to peer video==3
            rtcPeerConnection.ontrack = onTrack;
            //add self video to the peer connection==4
            console.log(userStream?.getTracks()[1]);
            rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
            rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
            //finnaly creating offer ==4
            rtcPeerConnection
                .createOffer()
                .then((offer) => {
                    rtcPeerConnection.setLocalDescription(offer);
                    //send offer to the server==5
                    socket.emit("offer", offer, videCallState.roomName);
                })

                .catch((error) => {
                    console.log(error);
                });
        }
    });
    //after server recive candidate , server will emit the candidate to the client==2.3
    //add the candidate to the peer connection==2.4
    socket.on('candidate', (candidate) => {
        console.log('candidate');
        rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });


    // after creator create peer connection, and sned it as offer to the server, ==5
    // the server will send the offer to the  peer connections 
    socket.on('offer', (offer) => {
        //if the user is not the creator, the recived offer will be added to the peer connection=6

        if (!creator) {
            rtcPeerConnection = new RTCPeerConnection(iceServers);
            rtcPeerConnection.onicecandidate = onIceCandidate;
            rtcPeerConnection.ontrack = onTrack;
            rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
            rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
            //and offer will be set as remote description=7
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            ///then the peer connection will create answer==8
            rtcPeerConnection
                .createAnswer()
                .then((answer) => {
                    rtcPeerConnection.setLocalDescription(answer);
                    //send answer to the server as answer event==9
                    socket.emit("answer", answer, videCallState.roomName);
                })
                .catch((error) => {
                    console.log(error);
                });


        }
    })


    //when the joning reciver create answer and send to server, server will send it back, and 
    //the creator will add it to the peer connection as remote descriptin ==10
    socket.on('answer', (answer) => {
        console.log("answer from server");
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });








    const onIceCandidate = (event) => {
        /// after creatin rtc peer connection, the icecandidate event will be fired  ==2.1
        //and the icecandidate will be sent to the server with event icecandidate
        if (event.candidate) {
            console.log(event.candidate);
            //send icecandidate to the server 2.2
            socket.emit('candidate', event.candidate, videCallState.roomName);
        }
    }

    const onTrack = (event) => {
        /// whene there is a track from peer connection, the event track will be fired ==3.1
        //and the track will be added to the peer video
        peerVideo.current.srcObject = event.streams[0];
        peerVideo.current.onloadedmetadata = function (e) {
            peerVideo.current.play();
        };
    }


    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="fixed flex itmes-center   bg-grey-200 w-screen h-screen z-10 inset-0 overflow-y-auto">

            <div className="my-auto mx-auto bg-red-500 w-4/5 h-3/4 rounded-md ">
                <button onClick={() => setOpen(false)}>End Call</button>
                <button onClick={() => join()}> Join</button>
                <p>{videCallState.otherUserId}</p><p>Room Name {videCallState.roomName}</p>
                <p>{videCallState.isIncoming.toString()}</p>
                <div className="flex justify-around my-auto mx-auto bg-red-500 w-4/5 h-3/4">
                    <video ref={peerVideo} className="object-contained w-2/4" typeof="video/mp4" autoPlay></video>
                    <video ref={userVideo} className="object-contained w-2/4" typeof="video/mp4" autoPlay></video>
                </div>






            </div>
        </Dialog>

    )
}

export default VideoCallWindow
