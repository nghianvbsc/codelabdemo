var sendChannel;
window.moz = !!navigator.mozGetUserMedia;
var chromeVersion = !!navigator.mozGetUserMedia ? 0 : parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);

var iceServers = [];

if (moz) {
    iceServers.push({
        url: 'stun:23.21.150.121'
    });

    iceServers.push({
        url: 'stun:stun.services.mozilla.com'
    });
}

if (!moz) {
    iceServers.push({
        url: 'stun:stun.l.google.com:19302'
    });

    iceServers.push({
        url: 'stun:stun.anyfirewall.com:3478'
    });
}

if (!moz && chromeVersion < 28) {
    iceServers.push({
        url: 'turn:homeo@turn.bistri.com:80',
        credential: 'homeo'
    });
}

if (!moz && chromeVersion >= 28) {
    iceServers.push({
        url: 'turn:turn.bistri.com:80',
        credential: 'homeo',
        username: 'homeo'
    });

    iceServers.push({
        url: 'turn:turn.anyfirewall.com:443?transport=tcp',
        credential: 'webrtc',
        username: 'webrtc'
    });
}

iceServers.push({
    urls: 'stun:stun.l.google.com:19302'
});

iceServers.push({
    urls: 'turn:webrtcweb.com:80',
    credential: 'muazkh',
    username: 'muazkh'
});

iceServers.push({
    urls: 'turn:webrtcweb.com:443',
    credential: 'muazkh',
    username: 'muazkh'
});

iceServers.push({
    urls: 'turn:webrtcweb.com:3344',
    credential: 'muazkh',
    username: 'muazkh'
});

iceServers.push({
    urls: 'turn:webrtcweb.com:4433',
    credential: 'muazkh',
    username: 'muazkh'
});

iceServers.push({
    urls: 'turn:webrtcweb.com:4455',
    credential: 'muazkh',
    username: 'muazkh'
});

iceServers.push({
    urls: 'turn:webrtcweb.com:5544?transport=tcp',
    credential: 'muazkh',
    username: 'muazkh'
});

iceServers = {
    iceServers: iceServers
};

var optional = {
    optional: []
};

if (!moz) {
    optional.optional = [{
        DtlsSrtpKeyAgreement: true
    }];
}

var sdpConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': true,
        'OfferToReceiveVideo': true
    },
};

////////////////////////////////////////////////
// CODEC
////////////////////////////////////////////////

// Set Opus as the default audio codec if it's present.
function preferOpus(sdp) {
    var sdpLines = sdp.split('\r\n');
    var mLineIndex;
    // Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('m=audio') !== -1) {
            mLineIndex = i;
            break;
        }
    }
    if (mLineIndex === null || mLineIndex === undefined) {
        return sdp;
    }

    // If Opus is available, set it as the default in m line.
    for (i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('opus/48000') !== -1) {
            var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
            if (opusPayload) {
                sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
            }
            break;
        }
    }

    // Remove CN in m line and sdp.
    sdpLines = removeCN(sdpLines, mLineIndex);

    sdp = sdpLines.join('\r\n');
    return sdp;
}

function extractSdp(sdpLine, pattern) {
    var result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;
}

// Set the selected codec to the first in m line.
function setDefaultCodec(mLine, payload) {
    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
        if (index === 3) { // Format of media starts from the fourth.
            newLine[index++] = payload; // Put target payload to the first.
        }
        if (elements[i] !== payload) {
            newLine[index++] = elements[i];
        }
    }
    return newLine.join(' ');
}

// Strip CN from sdp before CN constraints is ready.
function removeCN(sdpLines, mLineIndex) {
    var mLineElements = sdpLines[mLineIndex].split(' ');
    // Scan from end for the convenience of removing an item.
    for (var i = sdpLines.length - 1; i >= 0; i--) {
        var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
        if (payload) {
            var cnPos = mLineElements.indexOf(payload);
            if (cnPos !== -1) {
                // Remove CN payload from m line.
                mLineElements.splice(cnPos, 1);
            }
            // Remove CN line in sdp
            sdpLines.splice(i, 1);
        }
    }

    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;
}

function mergeConstraints(cons1, cons2) {
    var merged = cons1;
    for (var name in cons2.mandatory) {
        merged.mandatory[name] = cons2.mandatory[name];
    }
    merged.optional.concat(cons2.optional);
    return merged;
}