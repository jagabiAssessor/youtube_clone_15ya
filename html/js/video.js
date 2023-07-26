// 일단 id 15로 고정시켜놨습니다.
document.addEventListener('DOMContentLoaded', function() {
    const videoId = 15;
    loadVideoInfo(videoId);
});


function loadVideoInfo(videoId) {
    fetch(`http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        displayVideoInfo(data);
    });
}



function displayVideoInfo(videoInfo) {
    const videoInfoContainer = document.querySelector('.youtubePlayer');
    videoInfoContainer.innerHTML = '';  // videoInfoContainer 안에 HTML 내용 모두 삭제하여 초기화

    // 영상 링크
    const videoLink = videoInfo.video_link;
    const videoFrame = document.createElement('iframe');  // videoFrame요소를 iframe 태그 생성
    videoFrame.width = 560;         // 영상 크기 임의로 설정했습니다.
    videoFrame.height = 315;
    videoFrame.src = videoLink;     
    videoInfoContainer.appendChild(videoFrame);     //youtubePlayer 안에 iframe 추가
    
    // 제목
    const videoTitle = document.createElement('h2'); // p 태그로 생성
    videoTitle.innerText = videoInfo.video_title;
    videoInfoContainer.appendChild(videoTitle);


    // 채널
    const videoChannel = document.createElement('p');
    videoChannel.innerText = `${videoInfo.video_channel}`;
    videoInfoContainer.appendChild(videoChannel);


    // 개시 일자
    const uploadDate = document.createElement('p');
    uploadDate.innerText = `Upload Date: ${videoInfo.upload_date}`;
    videoInfoContainer.appendChild(uploadDate);

    // 조회수
    const views = document.createElement('p');
    views.innerText = `Views: ${videoInfo.views}`;
    videoInfoContainer.appendChild(views);
}