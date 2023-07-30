// JavaScript (channel.html)
document.addEventListener("DOMContentLoaded", function () {
    // URL에서 채널 이름을 가져옵니다.
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const channelName = urlParams.get('channel');

    // API 요청을 위한 URL을 생성합니다.
    const apiUrl = `http://oreumi.appspot.com/channel/getChannelVideo?video_channel=${encodeURIComponent(channelName)}`;

    // XMLHttpRequest 객체를 생성합니다.
    const xhr = new XMLHttpRequest();

    // API로부터 응답을 받았을 때 처리할 이벤트 핸들러를 등록합니다.
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                displayChannelInfo(response);
            } else {
                console.error('Error fetching data. Status:', xhr.status);
            }
        }
    };

    // API에 GET 요청을 보냅니다.
    xhr.open('POST', apiUrl);
    xhr.send();
});

// 채널 정보를 화면에 표시하는 함수입니다.
function displayChannelInfo(responseData) {
    const channelInfoDiv = document.getElementById("channelInfo");

    // responseData는 이미 JSON 형식의 문자열이므로 바로 사용할 수 있습니다.
    const videoId = responseData[0].video_id;
    const videoInfoApiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${encodeURIComponent(videoId)}`;

    // 두 번째 API 요청을 보내고, 응답을 처리합니다.
    fetch(videoInfoApiUrl)
        .then(response => response.json())
        .then(videoInfo => {
            // 비디오 링크를 맨 위에 추가합니다.
            channelInfoDiv.innerHTML = `
                <p>Title: ${responseData[0].video_title}</p>
                <p>Views: ${responseData[0].views}</p>
                <p>Detail: ${responseData[0].video_detail}</p>
            `;

            // videoPlayer 태그에 영상 소스를 지정합니다
            const videoPlayer = document.getElementById("videoPlayer");
            videoPlayer.src = videoInfo.video_link; // 영상 파일 경로 설정
            videoPlayer.controls = true; // 영상 컨트롤 표시
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function displayVideoThumbnail(videoInfo) {
    // div 요소 생성해서 videoContainer에 추가
    const videoGrid = document.querySelector('.video-grid');
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    // 비디오 요소 만들기
    const videoElem = document.createElement('video');
    videoElem.controls = true;
    videoElem.width = 276;  // 사이즈 피그마 참고
    videoElem.height = 155;
    // source 요소 생성해서 sourceElem에 추가
    const sourceElem = document.createElement('source');
    sourceElem.src = videoInfo.video_link;
    sourceElem.type = 'video/mp4';  // 비디오가 mp4 형식이라고 가정
    
    videoElem.appendChild(sourceElem);
    videoContainer.appendChild(videoElem);

    // p 요소 생성해서 videoTitle에 추가
    const videoTitle = document.createElement('p');
    videoTitle.className = 'video-title';
    videoTitle.textContent = videoInfo.video_title;
    videoContainer.appendChild(videoTitle);
    
    // videoGrid>videoContainer>videoTitle>sourceElem>videoInfo 이렇게 생각하면 된다
    videoGrid.appendChild(videoContainer);
}




// function displayVideoThumbnail(videoInfo) {
//     // div 요소 생성해서 videoContainer에 추가
//     const videoContainer = document.createElement('div');
//     videoContainer.className = 'video-container';

//     // 비디오 요소 만들기
//     const videoElem = document.createElement('video');
//     videoElem.controls = true;
//     videoElem.width = 276;  // 사이즈 피그마 참고
//     videoElem.height = 155;
//     // source 요소 생성해서 sourceElem에 추가
//     const sourceElem = document.createElement('source');
//     sourceElem.src = videoInfo.video_link;
//     sourceElem.type = 'video/mp4';  // 비디오가 mp4 형식이라고 가정
    
//     videoElem.appendChild(sourceElem);
//     videoContainer.appendChild(videoElem);

//     // p 요소 생성해서 videoTitle에 추가
//     const videoTitle = document.createElement('p');
//     videoTitle.className = 'video-title';
//     videoTitle.textContent = videoInfo.video_title;
//     videoContainer.appendChild(videoTitle);
    
//     // videoGrid>videoContainer>videoTitle>sourceElem>videoInfo 이렇게 생각하면 된다
//     videoGrid.appendChild(videoContainer);
// }