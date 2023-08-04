const videoGrid = document.querySelector('.video-grid');
let keyword = ""; // 글로벌 변수로 keyword를 설정

//검색어를 받아 저장
window.onload = function() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  keyword = urlParams.get("keyword");
  document.querySelector(".SearchBox").value = keyword;
  console.log("검색어: ", keyword);

  // video_id 값 하나씩 함수에 대입
  const videoIds = Array.from({length: 21}, (_, i) => i);
  videoIds.forEach(videoId => {
    fetchVideoInfo(videoId);
  });
  
};

let channelInfoDisplayed = false;

async function fetchVideoInfo(videoId) {
    const xhr = new XMLHttpRequest();
    const url = `https://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
  
    xhr.open('GET', url, true);
  
    xhr.onload = async function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        const videoInfo = JSON.parse(xhr.responseText);
  
        // fetchChannelInfo 함수를 호출하여 채널 프로필 이미지 URL 가져오기
        const channelProfileUrl = await fetchChannelInfo(videoInfo.video_channel);
        videoInfo.channel_profile = channelProfileUrl.channel_profile; // 프로필 이미지 URL 객체에 추가
        videoInfo.subscribers = channelProfileUrl.subscribers;
  
        // 검색어와 videoInfo.video_tag,video_title의 일치 여부를 비교하여, 일치하면 displayVideoThumbnail 함수 실행
        // 배열을 순회하며 키워드 검사
        if (videoInfo.video_tag.some(tag => tag === keyword) || videoInfo.video_title.includes(keyword) || videoInfo.video_channel.includes(keyword)) {
          displayVideoThumbnail(videoInfo);

          
        //채널 정보 추가
        if (!channelInfoDisplayed && videoInfo.video_channel.includes(keyword)){    //검색어에 채널명이 포함되어 있을경우 표시
          displaychannelInfo(videoInfo);
          channelInfoDisplayed = true;
        }
      }
      } else {
        console.error('ID에 대한 비디오 정보를 가져오지 못했습니다:', videoId);
      }
    };
  
    xhr.onerror = function() {
      console.error('네트워크 오류가 발생했습니다');
    };
  
    xhr.send();
}


const channel= document.querySelector('.channel');

//채널 정보 표시하는 함수
function displaychannelInfo(videoInfo) {
    
    const channelContainer = document.createElement('div');
    channelContainer.className = 'channel-Container';
    //채널
    const channelProfile = document.createElement("img");
    channelProfile.className = "profile";
    channelProfile.src = videoInfo.channel_profile;
    channelProfile.width = 136;
    channelProfile.height = 136;
  
    const channelInfo = document.createElement('div');
    const videoChannel = document.createElement("p");
    videoChannel.className = "channelName";
    videoChannel.textContent = videoInfo.video_channel;
  
    const subscribers = document.createElement('p');
    subscribers.className = "subscribers";
    subscribers.textContent = "구독자수 " + Math.round(videoInfo.subscribers/10000)+"만명";
  
    channelInfo.appendChild(videoChannel);
    channelInfo.appendChild(subscribers);
    channelContainer.appendChild(channelProfile);
    channelContainer.appendChild(channelInfo);
  
    channel.appendChild(channelContainer);
};


function sendToVideoPage(videoInfo) {
  // video_id 보내기
  window.location.href = `Video.html?video_id=${videoInfo.video_id}`;

}

function sendToChannelPage(videoInfo) {
  window.location.href = `channel.html?channel=${videoInfo.video_channel}`;
}

