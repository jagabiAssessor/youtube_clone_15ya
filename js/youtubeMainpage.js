// 메인 페이지 검색창 기능 구현
// tag값을 검색어로 id값으로 변환해서 동영상 불러오는 코드
function fetchVideoAndInfo() {
    let videoTagInput = document.getElementById('videoTagInput').value;
    let videoListUrl = 'http://oreumi.appspot.com/video/getVideoList';
    
    let xhr = new XMLHttpRequest();
    
    xhr.open('GET', videoListUrl, true);
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            let videoList = JSON.parse(xhr.responseText);
            
            // video_ids에 video_tags 맵을 만듭니다
            let tagToVideoMap = {};
            videoList.forEach(video => {
                video.video_tag.forEach(tag => {
                    if (tagToVideoMap[tag]) {
                        tagToVideoMap[tag].push(video.video_id);
                    } else {
                        tagToVideoMap[tag] = [video.video_id];
                    }
                });
            });
            
            // 입력 video_tag에 대한 최소 video_id 찾기
            let videoIdsForTag = tagToVideoMap[videoTagInput];
            if (videoIdsForTag && videoIdsForTag.length > 0) {
                videoIdsForTag.sort((a, b) => a - b);
                let smallestVideoId = videoIdsForTag[0];
                
                // 이 video_id에 대한 세부 정보 가져오기
                let videoInfoUrl = 'http://oreumi.appspot.com/video/getVideoInfo?video_id=' + smallestVideoId;
                let xhr2 = new XMLHttpRequest();
    
                xhr2.open('GET', videoInfoUrl, true);
                // video_id 값 받아서 video_link 동영상 소스에 넣기
                xhr2.onload = function() {
                    if (xhr2.status >= 200 && xhr2.status < 400) {
                        let videoDetails = JSON.parse(xhr2.responseText);
                        let videoPlayer = document.getElementById('videoPlayer');
                        videoPlayer.src = videoDetails.video_link;
                        videoPlayer.load();
                    } else {
                        console.error('비디오 정보를 가져오는 중 오류가 발생했습니다:', xhr2.status);
                    }
                };
                xhr2.onerror = function() {
                    console.error('비디오 정보를 가져오는 동안 네트워크 오류가 발생했습니다');
                };
                xhr2.send();

            } else {
                console.error('지정된 video_tag에 대한 비디오를 찾을 수 없습니다');
            }
        } else {
            console.error('비디오 목록을 가져오는 중 오류가 발생했습니다:', xhr.status);
        }
    };
    xhr.onerror = function() {
        console.error('비디오 목록을 가져오는 동안 네트워크 오류가 발생했습니다');
    };
    xhr.send();
}


//---------------------------------------------------------------------


// 메인페이지 썸네일 동영상 불러오기 기능
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

