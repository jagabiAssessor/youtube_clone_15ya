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

async function fetchVideoInfo(videoId) {
    const xhr = new XMLHttpRequest();
    const url = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
  
    xhr.open('GET', url, true);
  
    xhr.onload = async function() {
      if (xhr.status >= 200 && xhr.status < 400) {
        const videoInfo = JSON.parse(xhr.responseText);
  
        // fetchChannelInfo 함수를 호출하여 채널 프로필 이미지 URL 가져오기
        const channelProfileUrl = await fetchChannelInfo(videoInfo.video_channel);
        videoInfo.channel_profile = channelProfileUrl; // 프로필 이미지 URL 객체에 추가
  
        // 검색어와 videoInfo.video_tag,video_title의 일치 여부를 비교하여, 일치하면 displayVideoThumbnail 함수 실행
        // 배열을 순회하며 키워드 검사
        if (videoInfo.video_tag.some(tag => tag === keyword) || videoInfo.video_title.includes(keyword) 
        || videoInfo.video_channel.includes(keyword)) {
            displayVideoThumbnail(videoInfo);
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

  function sendToVideoPage(videoInfo) {
    // video_id 보내기
    window.location.href = `Video.html?video_id=${videoInfo.video_id}`;
  
  }