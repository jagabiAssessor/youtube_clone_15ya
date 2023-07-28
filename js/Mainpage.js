const videoGrid = document.querySelector('.video-grid');

// 1부터 19까지의 video_id
const videoIds = Array.from({length: 19}, (_, i) => i + 1);
// video_id 값 하나씩 함수에 대입
videoIds.forEach(videoId => {
    fetchVideoInfo(videoId);
});

function fetchVideoInfo(videoId) {
    const xhr = new XMLHttpRequest();
    const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;

    xhr.open('GET', url, true);
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            const videoInfo = JSON.parse(xhr.responseText);
            displayVideoThumbnail(videoInfo);
        } else {
            console.error('ID에 대한 비디오 정보를 가져오지 못했습니다:', videoId);
        }
    };

    xhr.onerror = function() {
        console.error('네트워크 오류가 발생했습니다');
    };

    xhr.send();
}

function displayVideoThumbnail(videoInfo) {
    // div 요소 생성해서 videoContainer에 추가
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';


        // img 요소 추가해서 썸네일 이미지 표시
    const imageElem = document.createElement('img');
    imageElem.src = videoInfo.image_link;
    imageElem.alt = "Thumbnail for " + videoInfo.video_title;
    imageElem.width = 276;
    imageElem.height = 155;
    videoContainer.appendChild(imageElem);
    // 비디오 요소 만들기
    const videoElem = document.createElement('video');
    videoElem.controls = true;
    videoElem.width = 276;  // 사이즈 피그마 참고
    videoElem.height = 155;
    videoElem.style.display = 'none';  // 초기에는 비디오 숨김
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

    //채널 이름 
    const videoChannel = document.createElement('p');
    videoChannel.className = 'video-channel';
    videoChannel.textContent = videoInfo.video_channel;
    videoContainer.appendChild(videoChannel);
    

    //조회수
    const videoViews = document.createElement('p');
    videoViews.className = 'video-views';
    videoViews.textContent = '조회수 '+ Math.round(videoInfo.views / 10000) + '만';
    videoContainer.appendChild(videoViews);
    //업로드
    const uploadDate = document.createElement('p');
    uploadDate.className = 'upload-date';
    uploadDate.textContent = getTimeDiff(videoInfo.upload_date);
    videoContainer.appendChild(uploadDate);
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

// 업로드 날짜 계산
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

    // videoGrid>videoContainer>videoTitle>sourceElem>videoInfo 이렇게 생각하면 된다
    videoGrid.appendChild(videoContainer);
}