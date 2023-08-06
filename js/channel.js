// JavaScript (channel.html)

document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const channelName = urlParams.get('channel');

    const channelInfoUrl = `https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${encodeURIComponent(channelName)}`;
    const channelXhr = new XMLHttpRequest();

    channelXhr.onreadystatechange = function () {
        if (channelXhr.readyState === 4) {
            if (channelXhr.status === 200) {
                const channelResponse = JSON.parse(channelXhr.responseText);
                displayChannelInfo(channelResponse);

                const videoInfoUrl = `https://oreumi.appspot.com/channel/getChannelVideo?video_channel=${encodeURIComponent(channelName)}`;
                const videoXhr = new XMLHttpRequest();

                videoXhr.onreadystatechange = function () {
                    if (videoXhr.readyState === 4) {
                        if (videoXhr.status === 200) {
                            const videoResponse = JSON.parse(videoXhr.responseText);
                            const videoIds = sortVideosByViews(videoResponse);

                            // 상단 비디오 가져오기 위해 Promise.all 사용
                            Promise.all(videoIds.map(fetchVideoInfo))
                                .then(videos => {
                                    const mostViewedVideo = videos.sort((a, b) => b.views - a.views)[0];
                                    displayVideoThumbnailTop(mostViewedVideo);
                                })
                                .catch(error => {
                                    console.error('비디오 정보를 가져오는 중에 에러가 발생했습니다:', error);
                                });

                            // 비디오 정보를 병렬로 가져오기 위해 Promise.all 사용
                            Promise.all(videoIds.map(fetchVideoInfo))
                                .then(videos => {
                                    videos.forEach(displayVideoThumbnail);
                                    handleVideoScroll();
                                })
                                .catch(error => {
                                    console.error('비디오 정보를 가져오는 중에 에러가 발생했습니다:', error);
                                });
                        } else {
                            console.error('비디오 정보를 가져오는 중에 에러가 발생했습니다.');
                        }
                    }
                };

                videoXhr.open('POST', videoInfoUrl);
                videoXhr.send();
            } else {
                console.error('채널 정보를 가져오는 중에 에러가 발생했습니다. 상태:', channelXhr.status);
            }
        }
    };

    channelXhr.open('POST', channelInfoUrl);
    channelXhr.send();
});

// 채널 비디오 정보를 조회수 순으로 video_id를 저장
function sortVideosByViews(videoResponse) {
    const sortedVideos = videoResponse.sort((a, b) => b.views - a.views);
    return sortedVideos.map(video => video.video_id);
}                       

//비디오 id를 이용해 비디오 정보를 가져오고 display함수로 전달
function fetchVideoInfo(videoId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const url = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;

        xhr.open('GET', url, true);

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 400) {
                const videoInfo = JSON.parse(xhr.responseText);

                // fetchChannelInfo 함수를 호출하여 채널 프로필 이미지 URL 가져오기
                fetchChannelInfo(videoInfo.video_channel)
                    .then(channelProfileUrl => {
                        videoInfo.channel_profile = channelProfileUrl.channel_profile;
                        videoInfo.subscribers = channelProfileUrl.subscribers;
                        resolve(videoInfo);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else {
                reject('ID에 대한 비디오 정보를 가져오지 못했습니다:', videoId);
            }
        };

        xhr.onerror = function () {
            reject('네트워크 오류가 발생했습니다');
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

function sendToVideoPage(videoInfo) {
    // video_id 보내기
    window.location.href = `Video.html?video_id=${videoInfo.video_id}`;

}

function sendToChannelPage(videoInfo) {
    window.location.href = `channel.html?channel=${videoInfo.video_channel}`;
}

const videoGrid = document.querySelector('.video-grid');
const videoGridTop = document.querySelector('.video-grid-top');

document.getElementById("btn").addEventListener("click", function() {
    const imgBtn = document.querySelector(".img_btn");
  
    // 이미지 클래스에 "clicked" 클래스를 토글하여 이미지를 변경
    imgBtn.classList.toggle("clicked");
    const subscribedImage = "./res/image/UesdSvg/Subscribes-Btn-Korean-Clicked-Bell.svg";
    const defaultImage = "./res/image/UesdSvg/Subscribes-Btn-Korean.svg";
    // 이미지를 변경하는 방법:
    if (imgBtn.classList.contains("clicked")) {
        imgBtn.src = subscribedImage;
    } else {
        imgBtn.src = defaultImage;
    }
});




// 상단에 동영상 분리하여 영상 출력


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
    videoElem.autoplay = true;
    videoElem.muted = true;
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
    const videoDetail = document.createElement('p');
    videoDetail.className = "video-detail";
    videoDetail.textContent = videoInfo.video_detail;

    const viewsUploadDateContainer = document.createElement("div");
    viewsUploadDateContainer.className = "view-date";

    viewsUploadDateContainer.appendChild(videoViews);
    viewsUploadDateContainer.appendChild(uploadDate);
 
    videoInfomation.appendChild(viewsUploadDateContainer);
    videoInfomation.appendChild(videoDetail);
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