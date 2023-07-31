// 비디오 페이지 검색창 기능 구현
// 우측 썸네일 동영상 구현 완료
// 댓글 기능 완료
// tag값을 검색어로 id값으로 변환해서 동영상 불러오는 코드
function fetchVideoAndInfo() {
    let videoTagInput = document.querySelector('.SearchBox').value;
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
                        let videoPlayer = document.querySelector('.Youtube-Player');
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
const videoGrid = document.querySelector('.Video-Grid');

// 1부터 19까지의 video_id
let videoIdsLength = 6;
const videoIds = Array.from({length: videoIdsLength}, (_, i) => i + 1);
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
    videoContainer.className = 'Video-Container';

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
    const videoTitle = document.createElement('span'); // 원래는 p. 제목을 영상아래에 놓고 싶으면 p, 오른쪽에 놓고 싶으면 span
    videoTitle.className = 'Video-Title';
    
    // 우측 동영상 리스트 코드
    // 우측 동영상 이름
    const titleText = document.createElement('span');
    titleText.className = 'Video-Title-Text'; // 클래스 추가
    titleText.textContent = videoInfo.video_title;
    videoTitle.appendChild(titleText);
    videoTitle.appendChild(document.createElement('br'));

    // 중간중간에 br 들어감
    // 우측 동영상 채널명
    const channelText = document.createElement('span');
    channelText.className = 'Video-Channel-Text'; // 클래스 추가
    channelText.textContent = videoInfo.video_channel;
    videoTitle.appendChild(channelText);
    videoTitle.appendChild(document.createElement('br'));

    // 우측 동영상 날짜
    const dateText = document.createElement('span');
    dateText.className = 'Video-Date-Text'; // 클래스 추가
    dateText.textContent = videoInfo.upload_date;
    videoTitle.appendChild(dateText);

    videoContainer.appendChild(videoTitle);
    // videoGrid>videoContainer>videoTitle>sourceElem>videoInfo 이렇게 생각하면 된다
    videoGrid.appendChild(videoContainer);
}

// 댓글 부분
// 댓글 추가 될때 배경화면 늘려주는 코드
const mainContent = document.querySelector('.Primary');

function increaseBackgroundHeight() {
    // 각 댓글마다 높이를 50px씩 올린다고 가정
    // 필요할때 마다 값 조정
    const heightIncrease = 50; 
    const currentHeight = parseInt(getComputedStyle(mainContent).height);
    const newHeight = currentHeight + heightIncrease;

    mainContent.style.height = `${newHeight}px`;
}

// 댓글, user-avatar 추가하는 코드
function addComment() {
    const commentInput = document.querySelector('.CommentInput');
    const commentText = commentInput.value.trim();

    if (commentText) {
        // 댓글 컨테이너 생성
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        // 아바타 이미지 생성
        const avatarImg = document.createElement('img');
        avatarImg.src = '../res/image/Video/profile-pic.svg';
        avatarImg.className = 'user-avatar';

        // 댓글 텍스트 생성
        const commentTextDiv = document.createElement('div');
        commentTextDiv.className = 'comment-text';
        commentTextDiv.innerText = commentText;

        // 댓글 컨테이너에 아바타 및 댓글 텍스트 추가
        commentDiv.appendChild(avatarImg);
        commentDiv.appendChild(commentTextDiv);

        // 전체 댓글 컨테이너를 댓글 목록에 추가
        document.querySelector('.Comments').appendChild(commentDiv);

        // input 박스 초기화
        commentInput.value = '';

        // 댓글을 추가하고 배경화면 높이를 증가
        increaseBackgroundHeight();
    } else {
        alert('댓글을 작성해 주세요.');
    }
}