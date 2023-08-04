// 비디오 페이지 검색창 기능 구현
// 우측 썸네일 동영상 구현 완료
// 댓글 기능 완료

async function fetchVideoInfo(videoId, isMainVideo = false) {
    const xhr = new XMLHttpRequest();
    const url = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;

    xhr.open('GET', url, true);

    xhr.onload = async function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            const videoInfo = JSON.parse(xhr.responseText);

            // fetchChannelInfo 함수를 호출하여 채널 프로필 이미지 URL 가져오기
            const channelProfileUrl = await fetchChannelInfo(videoInfo.video_channel);
            videoInfo.channel_profile = channelProfileUrl.channel_profile; // 프로필 이미지 URL 객체에 추가
            videoInfo.subscribers = channelProfileUrl.subscribers; // 구독자 수 추가

            displayVideoThumbnail(videoInfo);
            if (isMainVideo) {
                displayVideoInfo(videoInfo);
                Subscribed();
            }
        } else {
            console.error('ID에 대한 비디오 정보를 가져오지 못했습니다:', videoId);
        }
    };
    xhr.onerror = function () {
        console.error('네트워크 오류가 발생했습니다');
    };
    xhr.send();
}

//쿼리값으로 받은 id값으로 영상 정보 불러오기
document.addEventListener("DOMContentLoaded", function () {
    const receiveId = new URLSearchParams(window.location.search);
    const videoId = receiveId.get("video_id");
    if (videoId) {
        fetchVideoInfo(videoId, true);
    } else {
        console.error("비디오 정보를 찾을 수 없습니다.");
    }
});

const videoGrid = document.querySelector('.Video-Grid');

const videoIds = Array.from({ length: 21 }, (_, i) => i);

videoIds.forEach(videoId => {
    fetchVideoInfo(videoId);
});

async function fetchVideoPlayer(videoId) {
    const xhr = new XMLHttpRequest();
    const url = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;

    xhr.open('GET', url, true);

    xhr.onload = async function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            const videoInfo = JSON.parse(xhr.responseText);

            // fetchChannelInfo 함수를 호출하여 채널 프로필 이미지 URL 가져오기
            const channelProfileUrl = await fetchChannelInfo(videoInfo.video_channel);
            videoInfo.channel_profile = channelProfileUrl.channel_profile; // 프로필 이미지 URL 객체에 추가
            videoInfo.subscribers = channelProfileUrl.subscribers; // 구독자 수 추가

            displayVideoInfo(videoInfo);


        } else {
            console.error('ID에 대한 비디오 정보를 가져오지 못했습니다:', videoId);
        }
    };

    xhr.onerror = function () {
        console.error('네트워크 오류가 발생했습니다');
    };

    xhr.send();
}


// 댓글 부분
// 댓글 추가 될때 배경화면 늘려주는 코드
const mainContent = document.querySelector('.Primary');

function addComment() {
    const commentInput = document.querySelector('.CommentInput');
    let commentText = commentInput.value.trim();
    // 2000자 제한
    if (commentText.length > 2000) {
        alert('댓글은 2000자 이하여야 합니다.');
        return;
    }

    if (commentText) {
        // 댓글 컨테이너 생성
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        // 아바타 이미지 생성
        const avatarImg = document.createElement('img');
        avatarImg.src = './res/image/Video/profile-pic.svg';
        avatarImg.className = 'user-avatar';

        // 댓글 텍스트 생성
        const commentTextDiv = document.createElement('div');
        commentTextDiv.className = 'comment-text';
        commentTextDiv.innerText = commentText;

        // 사용자 아이디 생성 (Change 'user123' to the actual user ID)
        const userIDDiv = document.createElement('div');
        userIDDiv.className = 'user-id';
        userIDDiv.innerText = 'official_oreumi_15ya';

        // 댓글 작성 시간 생성
        const randomDate = getRandomDate();
        const commentTimeDiv = document.createElement('div');
        commentTimeDiv.className = 'comment-time';
        commentTimeDiv.innerText = timeSince(randomDate) + ' ago';

        // 댓글 컨테이너에 아바타, 댓글 텍스트, 아이디, 댓글 작성 시간 추가
        commentDiv.appendChild(avatarImg);
        commentDiv.appendChild(userIDDiv);
        commentDiv.appendChild(commentTimeDiv);
        commentDiv.appendChild(commentTextDiv);

        // 전체 댓글 컨테이너를 댓글 목록에 추가
        const commentsContainer = document.querySelector('.Comments');
        commentsContainer.appendChild(commentDiv);

        // input 박스 초기화
        commentInput.value = '';

        // 댓글을 추가하고 배경화면 높이를 증가
        increaseCommentsContainerHeight(commentsContainer);
    } else {
        alert('댓글을 작성해 주세요.');
    }
}


function getRandomDate() {
    const startDate = new Date('2023-08-01');
    const currentDate = new Date();
    const randomTime = startDate.getTime() + Math.random() * (currentDate.getTime() - startDate.getTime());
    return new Date(randomTime);
}

function timeSince(date) {
    const currentDate = new Date();
    const seconds = Math.floor((currentDate - date) / 1000);
    if (seconds < 60) {
        return seconds + ' seconds';
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return minutes + (minutes === 1 ? ' minute' : ' minutes');
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return hours + (hours === 1 ? ' hour' : ' hours');
    } else {
        const days = Math.floor(seconds / 86400);
        return days + (days === 1 ? ' day' : ' days');
    }
}

// 댓글 추가할 떄, 우측 동영사 메뉴 밀리는 현상 방지
function increaseCommentsContainerHeight(commentsContainer) {
    // 각 댓글마다 높이를 50px씩 올린다고 가정
    // 필요할 때 마다 값 조정
    const heightIncrease = 20;
    const currentHeight = parseInt(getComputedStyle(commentsContainer).height);
    const newHeight = currentHeight - heightIncrease;

    commentsContainer.style.height = `${newHeight}px`;
}






function displayVideoInfo(videoInfo) {
    const VideoPlayer = document.createElement('div');
    VideoPlayer.className = 'VideoPlayer';

    // 비디오 요소 만들기
    const displayVideo = document.createElement('video');
    displayVideo.className = 'Youtube-Player'
    displayVideo.controls = true;
    displayVideo.width = 1280;
    displayVideo.height = 720;
    // source 요소 생성해서 sourceElem에 추가
    const sourceElem = document.createElement('source');
    sourceElem.src = videoInfo.video_link;
    sourceElem.type = 'video/mp4';  // 비디오가 mp4 형식이라고 가정


    displayVideo.appendChild(sourceElem);
    VideoPlayer.appendChild(displayVideo);
    const VideoDesc = document.querySelector('.Video-Desc');
    VideoDesc.parentElement.insertBefore(VideoPlayer, VideoDesc);



    const VideoDescTitle = document.createElement('div');
    VideoDescTitle.className = 'Video-DescTitle';
    const videoTitle = document.createElement("h1");
    videoTitle.textContent = videoInfo.video_title;
    VideoDescTitle.appendChild(videoTitle);

    const VideoChannel = document.querySelector('.VideoChannel');
    VideoChannel.parentElement.insertBefore(VideoDescTitle, VideoChannel);


    const channelProfile = document.createElement("img");
    channelProfile.className = "Profile";
    channelProfile.src = videoInfo.channel_profile;
    channelProfile.style.borderRadius = "50%";
    channelProfile.style.marginRight = "10px";
    channelProfile.width = 36;
    channelProfile.height = 36;
    const channel = document.createElement('div');
    const channelName = document.createElement("span");
    channelName.className = "ChannelName";
    channelName.textContent = videoInfo.video_channel;
    const subscribers = document.createElement('span');
    subscribers.className = "subscribers";
    subscribers.style.marginRight = "10px";
    subscribers.textContent = "구독자 " + Math.round(videoInfo.subscribers / 10000) + "만명";
    channel.appendChild(channelName);
    channel.appendChild(document.createElement("br")); // 줄바꿈
    channel.appendChild(subscribers);


    const DescButtonsub = document.querySelector('.DescButton_sub');
    DescButtonsub.parentElement.insertBefore(channelProfile, DescButtonsub);
    DescButtonsub.parentElement.insertBefore(channel, DescButtonsub);

    const Description = document.querySelector('.Description');
    const videoViews = document.createElement("p");
    videoViews.className = "video-views";
    videoViews.textContent = "조회수 " + Math.round(videoInfo.views / 10000) + "만회";

    const uploadDate = document.createElement("p");
    uploadDate.className = "upload-date";
    uploadDate.textContent = getTimeDiff(videoInfo.upload_date);
    const videoDetail = document.createElement('p');
    videoDetail.textContent = videoInfo.video_detail;

    Description.appendChild(videoViews);
    Description.appendChild(uploadDate);
    Description.appendChild(videoDetail);

}

function sendToVideoPage(videoInfo) {
    // 비디오 정보를 로컬 스토리지에 저장하기
    window.location.href = `Video.html?video_id=${videoInfo.video_id}`;

}

//구독 버튼 클릭 시 채널 이름 로컬 스토리지에 저장 한 후 페이지 새로 고침 시나 다른 페이지로 넘어 갈 때 구독 정보를 가져옴
function Subscribed() {
    const subButton = document.querySelector('.DescButton_sub');
    var videoChannel = document.querySelector('.ChannelName').textContent;
    var sub;
    var isSub = localStorage.getItem(videoChannel) === 'subscribed';

    //구독 되어 있으면, <div>구독중</div> 추가
    if (isSub) {
        addSub();
        }

    //버튼 클릭시 구독 여부에 따라 <div>구독중</div> 추가 or 제거
    subButton.addEventListener('click', function() {
        if (!isSub) {
            addSub();
            localStorage.setItem(videoChannel, "subscribed");
        } else {
            removeSub();
            localStorage.removeItem(videoChannel);
        }
        isSub = !isSub;
    });
    function addSub() {
        sub = document.createElement('div');
        sub.textContent = '구독중';
        subButton.appendChild(sub);
    }

    function removeSub() {
        subButton.removeChild(sub);
            
    }
}