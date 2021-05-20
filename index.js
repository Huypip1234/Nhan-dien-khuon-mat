const video = document.getElementById('videoElm');

//tai model
const loadFaceAPI = async () => {
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models'); //bieu cam khuon mat
}

//khoi dong camera
function getCameraStream() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: {}
        })
        .then(stream => {
            video.srcObject = stream;
        })
    }
}

//bat su kien khi video dang playing -> thuc hien nhan dien
video.addEventListener('playing', () => {
    //khoi tao canvas
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
    };
    //chuc nang chinh dc thuc hien tai day
    setInterval(async () => {
        const detects = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        const resizedDetects = faceapi.resizeResults(detects, displaySize);
        //xoa di canvas cu
        canvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
        //ve canvas moi
        faceapi.draw.drawDetections(canvas, resizedDetects);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetects);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetects);
    }, 300);
}); 

//tai xong model roi moi khoi dong camera
loadFaceAPI().then(getCameraStream);