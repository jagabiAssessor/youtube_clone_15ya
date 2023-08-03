// JavaScript (channel.html)

document.addEventListener("DOMContentLoaded", function () {
    // URL에서 채널 이름을 가져옵니다.
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const channelName = urlParams.get('channel');

    // API 요청을 위한 URL을 생성합니다.
    const apiUrl = `http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${encodeURIComponent(channelName)}`;
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


// displayVideo.js에서 받아서 동영상 보여주는 기능까지만 완료
const videoGrid = document.querySelector('.Channel-Player');


// 0부터 20까지의 video_id
const videoIds = Array.from({length: 20}, (_, i) => i);
// video_id 값 하나씩 함수에 대입
videoIds.forEach(videoId => {
    fetchVideoInfo(videoId);
});

async function fetchVideoInfo(videoId) {
    const xhr = new XMLHttpRequest();
    const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;

    xhr.open('GET', url, true);

    xhr.onload = async function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            const videoInfo = JSON.parse(xhr.responseText);
            
        // fetchChannelInfo 함수를 호출하여 채널 프로필 이미지 URL 가져오기
        const channelProfileUrl = await fetchChannelInfo(videoInfo.video_channel);
        videoInfo.channel_profile = channelProfileUrl.channel_profile; // 프로필 이미지 URL 객체에 추가
        videoInfo.subscribers = channelProfileUrl.subscribers;
            displayVideoThumbnail(videoInfo);

            // if (index === 0) {
            //     displayVideoThumbnail(videoInfo, channelPlayerTop);
            // } else {
            //     displayVideoThumbnail(videoInfo, channelPlayerThumbnails);
            // }
            
        } else {
            console.error('ID에 대한 비디오 정보를 가져오지 못했습니다:', videoId);
        }
    };

    xhr.onerror = function() {
        console.error('네트워크 오류가 발생했습니다');
    };

    xhr.send();
}


function displayChannelInfo(channelData) {
    // 채널 정보를 받아와서 HTML 구조를 동적으로 생성합니다.
    const channelWrapper = document.getElementById("channelInfoContainer");

    // 채널 배너 받아와서 업데이트
    const channelCover = document.querySelector('.Channel-Cover img');
    if (channelCover && channelData.channel_banner) {
        channelCover.src = channelData.channel_banner;
    }

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
    const subscriberCountElement_m = Math.round(channelData.subscribers / 10000);
    subscriberCountElement.innerText = `구독자수: ${subscriberCountElement_m}명`; // API에서 받아온 구독자수를 사용

    // 채널 정보를 담는 엘리먼트를 생성합니다.
    const channelInfoElement = document.createElement("div");
    channelInfoElement.classList.add("channel-info");
    channelInfoElement.appendChild(channelNameElement);
    channelInfoElement.appendChild(subscriberCountElement);

    // 생성한 엘리먼트들을 채널 정보 컨테이너에 추가합니다.
    channelWrapper.appendChild(channelImage);
    channelWrapper.appendChild(channelInfoElement);
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



function sendToVideoPage(videoInfo) {
    // video_id 보내기
    window.location.href = `Video.html?video_id=${videoInfo.video_id}`;

}

function sendToChannelPage(videoInfo) {
    window.location.href = `channel.html?channel=${videoInfo.video_channel}`;
}



//


function displayChannelInfo(channelData) {
    // 채널 정보를 받아와서 HTML 구조를 동적으로 생성합니다.
    const channelWrapper = document.getElementById("channelInfoContainer");

    // 채널 배너 받아와서 업데이트
    const channelCover = document.querySelector('.Channel-Cover img');
    if (channelCover && channelData.channel_banner) {
        channelCover.src = channelData.channel_banner;
    }

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
    const subscriberCountElement_m = Math.round(channelData.subscribers / 10000);
    subscriberCountElement.innerText = `구독자수: ${subscriberCountElement_m}명`; // API에서 받아온 구독자수를 사용

    // 채널 정보를 담는 엘리먼트를 생성합니다.
    const channelInfoElement = document.createElement("div");
    channelInfoElement.classList.add("channel-info");
    channelInfoElement.appendChild(channelNameElement);
    channelInfoElement.appendChild(subscriberCountElement);

    // 생성한 엘리먼트들을 채널 정보 컨테이너에 추가합니다.
    channelWrapper.appendChild(channelImage);
    channelWrapper.appendChild(channelInfoElement);
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






