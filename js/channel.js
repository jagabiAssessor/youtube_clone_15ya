// JavaScript (channel.html)
document.addEventListener("DOMContentLoaded", function () {
    // URL에서 채널 이름을 가져옵니다.
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const channelName = urlParams.get('channel');

    // API 요청을 위한 URL을 생성합니다.
    const apiUrl = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${encodeURIComponent(channelName)}`;

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

function displayChannelInfo(channelData) {
    // 채널 정보를 받아와서 HTML 구조를 동적으로 생성합니다.
    const channelWrapper = document.getElementById("channelInfoContainer");

    // 채널 사진 이미지 엘리먼트를 생성합니다.
    const channelImage = document.createElement("img");
    channelImage.classList.add("channel-image");
    channelImage.src = channelData.channel_profile; // API에서 받아온 프로필 사진 URL을 사용

    // 채널명을 표시할 엘리먼트를 생성합니다.
    const channelNameElement = document.createElement("div");
    channelNameElement.classList.add("channel-name");
    channelNameElement.innerText = channelData.channel_name; // API에서 받아온 채널명을 사용
    

    // 구독자수를 표시할 엘리먼트를 생성합니다.
    const subscriberCountElement = document.createElement("div");
    subscriberCountElement.classList.add("subscriber-count");
    subscriberCountElement.innerText = `구독자수: ${channelData.subscribers}명`; // API에서 받아온 구독자수를 사용

    // 생성한 엘리먼트들을 채널 정보 컨테이너에 추가합니다.
    channelWrapper.appendChild(channelImage);
    channelWrapper.appendChild(channelNameElement);
    channelWrapper.appendChild(subscriberCountElement);
}

document.getElementById("btn").addEventListener("click", function() {
    const imgBtn = document.querySelector(".img_btn");
  
    // 이미지 클래스에 "clicked" 클래스를 토글하여 이미지를 변경
    imgBtn.classList.toggle("clicked");
    const subscribedImage = "../res/image/UesdSvg/Subscribes-Btn-Korean-Clicked-Bell.svg";
    const defaultImage = "../res/image/UesdSvg/Subscribes-Btn-Korean.svg";
    // 이미지를 변경하는 방법:
    if (imgBtn.classList.contains("clicked")) {
        imgBtn.src = subscribedImage;
    } else {
        imgBtn.src = defaultImage;
    }
  });


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