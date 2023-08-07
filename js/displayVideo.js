//displayVideo.js가 html에서 Mainpage.js와 SearchPage.js 보다 상단에 위치해야합니다



//채널 정보
async function fetchChannelInfo(channelName) {
    try {
        let response = await fetch(`https://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channelName}`, {
            method: 'POST',
            headers: {
                'accept': 'application/json'
            },
        });
        let data = await response.json();

        return data;

    } catch (error) {
        console.error('Error fetching channel information:', error);

    }
}


//영상 출력
function displayVideoThumbnail(videoInfo) {
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
        const imgHeight = imageElem.offsetHeight;
        imageElem.style.display = 'none';
        videoElem.style.display = 'block';

        // 비디오 높이 확인 및 수정
        if (videoElem.offsetHeight != imgHeight) {
            videoElem.style.height = `${imgHeight}px`;
        }
        videoElem.play();
    });

    videoContainer.addEventListener('mouseout', () => {
        imageElem.style.display = 'block';
        videoElem.style.display = 'none';
        videoElem.pause();
        videoElem.currentTime = 0;
    });
    // videoGrid>videoContainer>videoTitle>sourceElem>videoInfo 이렇게 생각하면 된다
    videoGrid.appendChild(videoContainer);
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




//전역개체로 선언하여 다른 js에서도 접근 가능

window.displayVideoThumbnail = displayVideoThumbnail;
window.fetchChannelInfo = fetchChannelInfo;
window.getTimeDiff = getTimeDiff;


