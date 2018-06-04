var socket = io.connect();
var RTCPeerList = {};
var localStream;
var localVideo = document.getElementById('myCam');

var myCreateRoom = false;

/**
 * HANDLE callback
 */
function setRemoteDescriptionError(error) {
    console.log("setRemoteDescriptionError", error);
}

function setRemoteDescriptionSuccess() {

}

function addIceCandidateError(error) {
    console.log("addIceCandidateError", error);
}

function addIceCandidateSuccess() {

}

function createAnswerError(error) {
    console.log("createAnswerError", error);

}

function createOfferError(error) {
    console.log("createOfferError", error);

}

function onaddstream(userId) {
    return function (stream) {
        if ($('#videobox-for-user-' + userId).length > 0) {
            attachMediaStream(document.getElementById('item-video-for-' + userId), stream.stream);
        } else {
            var $videoBox = $("<div class='videoWrap' id='videobox-for-user-" + userId + "'></div>");
            var $video = $("<video class='videoBox' id='item-video-for-" + userId + "' autoplay></video>");
            $videoBox.append($video);
            $("#remortelist").append($videoBox);
            attachMediaStream(document.getElementById('item-video-for-' + userId), stream.stream);
        }
    }
}

function onremovestream(userId) {

}

/**
 * Lắng nghe kết quả kiểm tra room
 */

socket.on("message", function (message) {
    if (message.type === 'newparticipant') {
        if (message.from !== myId) {
            createPeerConnection(message.from, 'offer');
        }
    } else if (message.type === 'answer') {
        if (message.dest === myId) {
            RTCPeerList[ message.from ].setRemoteDescription(new RTCSessionDescription(message.sessionDescription),
                setRemoteDescriptionSuccess, setRemoteDescriptionError);
        }

    } else if (message.type === 'offer') {
        if (message.dest === myId) {
            createPeerConnection(message.from, "answer", message.sessionDescription);
        }
    } else if (message.type === 'candidate') {
        if (message.dest === myId) {
            var candidate = new RTCIceCandidate({sdpMLineIndex: message.label, candidate: message.candidate});
            RTCPeerList[ message.from ].addIceCandidate(candidate, addIceCandidateSuccess, addIceCandidateError);
        }
    }
});

socket.on("room-listening", function (roomResponse) {
    getMyMedia(function () {
        /**
         * gửu kêt nối tới thành viên trong room.
         */
        socket.emit('message', {type: 'newparticipant', from: myId});
    });
});


/**
 * Gửu yêu cầu kiểm tra room có được quền tham gia không
 * có room này chưa
 * có được quền join rôm không
 * tạo mới room
 */
socket.emit("check room", room, myId);

function getMyMedia(callback) {
    function handleUserMedia(stream) {
        localStream = stream;
        attachMediaStream(localVideo, stream);
        callback();
    }

    var constraints = {video: true, audio: true};

    getUserMedia(constraints, handleUserMedia, function (error) {
        console.log("GET UserMedia error!!", error);
        alert('GET UserMedia error!!');
    });
}

function createPeerConnection(withUserId, type, offerSPD) {
    if (RTCPeerList[ withUserId ]) {
        RTCPeerList[ withUserId ].close();
        RTCPeerList[ withUserId ] = null;
    }

    try {
        RTCPeerList[ withUserId ] = new RTCPeerConnection(iceServers, optional);
        RTCPeerList[ withUserId ].onicecandidate = function (event) {
            if (event.candidate) {
                socket.emit('message', {
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                    room: room,
                    from: myId,
                    dest: withUserId
                });
            }
        };
    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
        return;
    }

    RTCPeerList[ withUserId ].onaddstream = onaddstream(withUserId);

    RTCPeerList[ withUserId ].onremovestream = onremovestream(withUserId);

    RTCPeerList[ withUserId ].addStream(localStream);

    if (type === 'offer') {
        var constraints = {'optional': [], 'mandatory': {'MozDontOfferDataChannel': true}};
        if (webrtcDetectedBrowser === 'chrome') {
            for (var prop in constraints.mandatory) {
                if (prop.indexOf('Moz') !== -1) {
                    delete constraints.mandatory[ prop ];
                }
            }
        }

        constraints = mergeConstraints(constraints, sdpConstraints);

        RTCPeerList[ withUserId ].createOffer(function (sessionDescription) {
            sessionDescription.spd = preferOpus(sessionDescription.sdp);
            RTCPeerList[ withUserId ].setLocalDescription(sessionDescription);

            socket.emit('message', {
                sessionDescription: sessionDescription,
                from: myId,
                type: 'offer',
                dest: withUserId
            });

        }, createOfferError);

    } else if (type === 'answer') {
        RTCPeerList[ withUserId ].setRemoteDescription(new RTCSessionDescription(offerSPD), setRemoteDescriptionSuccess, setRemoteDescriptionError);

        RTCPeerList[ withUserId ].createAnswer(function (sessionDescription) {
            sessionDescription.sdp = preferOpus(sessionDescription.sdp);
            RTCPeerList[ withUserId ].setLocalDescription(sessionDescription);

            socket.emit('message', {
                sessionDescription: sessionDescription,
                from: myId,
                type: 'answer',
                dest: withUserId
            });
        }, createAnswerError)
    }
}
