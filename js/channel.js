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


const videoGridTop = document.querySelector('.video-grid-top');
const videoGrid = document.querySelector('.video-grid');

//0부터 20까지의 video_id

const videoIds = Array.from({length: 20}, (_, i) => i);

// Promise.all을 통해 모든 Promise를 대기시킨다.
// 그다음 날짜별로 동영상 정렬한 뒤 화면에 표시한다.
// async await로 비동기 처리한 값은 .sort 해도 결국 전송되는 건 랜덤이다.
Promise.all(videoIds.map(videoId => fetchVideoInfo(videoId)))
    .then(videos => {
        
        // 조회수 별로 동영상 정렬
        const mostViewedVideo = videos.sort((a, b) => b.views - a.views)[0];

        displayVideoThumbnailTop(mostViewedVideo);

        //날짜별로 동영상 정렬
        videos = videos.filter(video => video.video_id !== mostViewedVideo.video_id);
        videos.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
        // 20개의 동영상 중 상위 6개 동영상
        const earliestVideos = videos.slice(0, 6);

        // 화면에 정렬된 비디오 표시
        earliestVideos.forEach(video => displayVideoThumbnail(video));

        // views가 가장 높은 동영상 상단에 놓는 함수(미완성)
        // organizeVideos(mostViewedVideo.video_id);

        // 이제 가장 많이 본 비디오를 그리드 맨 위에 배치합니다
        setTimeout(() => {
            // 각 비디오 요소가 해당 비디오 ID와 함께 데이터 속성을 가진다고 가정합니다
            const mostViewedElement = videoGrid.querySelector(`[data-video-id="${mostViewedVideo.video_id}"]`);
            if (mostViewedElement) {
                videoGrid.prepend(mostViewedElement);
            }
        }, 0); // setTimeout를 사용하여 DOM 업데이트 확인
    })
    .catch(error => console.error('An error occurred:', error));

function fetchVideoInfo(videoId) {
    return new Promise(async (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;

        xhr.open('GET', url, true);

        xhr.onload = async function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                const videoInfo = JSON.parse(xhr.responseText);

                // fetchChannelInfo 함수를 호출하여 채널 프로필 이미지 URL 가져오기
                try {
                    const channelProfileUrl = await fetchChannelInfo(videoInfo.video_channel);
                    videoInfo.channel_profile = channelProfileUrl.channel_profile;
                    videoInfo.subscribers = channelProfileUrl.subscribers;

                    // videoInfo로 promise resolve
                    resolve(videoInfo);
                } catch (error) {
                    reject(new Error('Failed to fetch channel info'));
                }

            } else {
                reject(new Error(`Failed to get video information for ID: ${videoId}`));
            }
        };

        xhr.onerror = function() {
            reject(new Error('A network error occurred'));
        };

        xhr.send();
    });
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





// displayVideo.js의 displayVideoThumbnail과 같은 구조

function displayVideoThumbnailTop(videoInfo) {
    // div 요소 생성해서 videoContainer에 추가
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';


    // img 요소 추가해서 썸네일 이미지 표시
    const imageElem = document.createElement('img');
    imageElem.className = "thumbnail"
    imageElem.src = videoInfo.image_link;
    imageElem.alt = "Thumbnail for " + videoInfo.video_title;
    // imageElem.width = 276;
    // imageElem.height = 155;
    videoContainer.appendChild(imageElem);
    // 비디오 요소 만들기
    const videoElem = document.createElement('video');
    videoElem.controls = true;
    // videoElem.width = 276;  // 사이즈 피그마 참고
    // videoElem.height = 155;
    videoElem.style.display = 'none';  // 초기에는 비디오 숨김
    // source 요소 생성해서 sourceElem에 추가
    const sourceElem = document.createElement('source');
    sourceElem.src = videoInfo.video_link;
    sourceElem.type = 'video/mp4';  // 비디오가 mp4 형식이라고 가정
    
    videoElem.appendChild(sourceElem);
    videoContainer.appendChild(videoElem);
    


    //채널
    const channelProfile = document.createElement("img");
    channelProfile.className = "channel-profile";
    channelProfile.src = videoInfo.channel_profile;
    channelProfile.width = 36;
    channelProfile.height = 36;


    const videoTitle = document.createElement("p");
    videoTitle.className = "video-title";
    videoTitle.textContent = videoInfo.video_title;


    const videoChannel = document.createElement("p");
    videoChannel.className = "video-channel";
    videoChannel.textContent = videoInfo.video_channel;

    const videoInfoContainer = document.createElement("div");
    videoInfoContainer.className = "video-info-container";
    videoInfoContainer.appendChild(channelProfile);
    const videoInfomation = document.createElement("div");
    videoInfomation.className = "video-info";
    videoInfomation.appendChild(videoTitle);
    videoInfomation.appendChild(videoChannel);

    const videoViews = document.createElement("p");
    videoViews.className = "video-views";
    videoViews.textContent = "조회수 " + Math.round(videoInfo.views / 10000) + "만회 •";
  
    const uploadDate = document.createElement("p");
    uploadDate.className = "upload-date";
    uploadDate.textContent = getTimeDiff(videoInfo.upload_date);

    const viewsUploadDateContainer = document.createElement("div");
    viewsUploadDateContainer.className = "view-date";
    viewsUploadDateContainer.appendChild(videoViews);
    viewsUploadDateContainer.appendChild(uploadDate);
    videoInfomation.appendChild(viewsUploadDateContainer);
    videoInfoContainer.appendChild(videoInfomation);
    videoContainer.appendChild(videoInfoContainer);


    const videoClick = () => {
        sendToVideoPage(videoInfo);
      };
      videoTitle.addEventListener('click', videoClick);
      imageElem.addEventListener('click', videoClick);
      videoElem.addEventListener('click', videoClick);
      viewsUploadDateContainer.addEventListener('click', videoClick);

    
    const channelClick = () => {
        sendToChannelPage(videoInfo);
    };
    channelProfile.addEventListener('click', channelClick);
    

    // 마우스 호버 기능
    videoContainer.addEventListener('mouseover', () => {
        imageElem.style.display = 'none';
        videoElem.style.display = 'block';
        videoElem.play();
    });

    videoContainer.addEventListener('mouseout', () => {
        imageElem.style.display = 'block';
        videoElem.style.display = 'none';
        videoElem.pause();
        videoElem.currentTime = 0;
    });
    // videoGrid>videoContainer>videoTitle>sourceElem>videoInfo 이렇게 생각하면 된다
    videoGridTop.appendChild(videoContainer);
}


//날짜 계산
function getTimeDiff(uploadDate) {
    const currentDate = new Date();
    const uploadedDate = new Date(uploadDate);
    const diffTime = currentDate - uploadedDate;
    const diffHours = diffTime / (1000 * 60 * 60);
    const diffDays = diffHours / 24;
    const diffMonths = diffDays / 30;
    
    if (diffMonths >= 1) {
        return `${Math.floor(diffMonths)}개월 전`;
    } else if (diffDays >= 1) {
        return `${Math.floor(diffDays)}일 전`;
    } else {
        return `${Math.floor(diffHours)}시간 전`;
    }
}