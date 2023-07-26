const sidebar = document.querySelector('.sidebar'); // 사이드바
const menu = document.querySelector('#menu'); // menu 버튼

// 비디오 페이지에 들어갈 유튜브 플레이어
var player;
    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: '',                                  // Video ID 입력
        events: {
          'onReady': onPlayerReady
        }
      });
    }

    function onPlayerReady(event) {
      event.target.playVideo();
    }

    function playVideo() {
      player.playVideo();
    }

    function pauseVideo() {
      player.pauseVideo();
    }

    function stopVideo() {
      player.stopVideo();
    }


  
//  -------------------- 은진님 하신부분 -----------------------------------------
const updateSidebarState = () => {
  const isLargeScreen = window.matchMedia('(min-width: 769px)').matches; // 화면 크기 확인

  if (isLargeScreen) {  // showSidebar 클래스를 body에서 제거하여 사이드바를 숨깁
    document.body.classList.remove('showSidebar');
    menu.removeEventListener('click', toggleSidebarOnSmallScreen); // 작은 화면에서 사용하던 이벤트 리스너를 제거
    menu.addEventListener('click', toggleSidebarOnLargeScreen);     // 큰 화면에서 사용할 이벤트 리스너를 추가
  } else {
    menu.removeEventListener('click', toggleSidebarOnLargeScreen);
    menu.addEventListener('click', toggleSidebarOnSmallScreen);
  }
};

const toggleSidebarOnLargeScreen = () => {  //화면이 클 때에는 슬라이드X
  document.body.classList.toggle('hideSidebar');
};

const toggleSidebarOnSmallScreen = () => { //화면이 작을 때에는 슬라이드
  document.body.classList.toggle('showSidebar');
};

// 초기 상태 호출
updateSidebarState();

// 화면 크기가 변경될 때 사이드바 상태 업데이트
const mediaQuery = window.matchMedia('(min-width: 769px)');
mediaQuery.addEventListener('change', updateSidebarState);


// 사이드 바, 메뉴 외 클릭시 사이드바 닫힘
document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && !menu.contains(event.target)) {
    document.body.classList.remove('showSidebar');
  }
});
// -----------------------------------------------------------------------------



// 메인으로 비디오 가져오기

// 비디오 리스트                               홈페이지에 나와있는 비디오 갯수가 20개인데 
for (var i=0; i<videos.length; i++){     //이부분을 반복문으로 만들어주시면 코드가 깔끔해질거 같습니다.
  var videos = [
  {title: 'Video 1', id: 'video1'},
  {title: 'Video 2', id: 'video2'},
  {title: 'Video 3', id: 'video3'},
  {title: 'Video 4', id: 'video4'},
  {title: 'Video 5', id: 'video5'},
  {title: 'Video 6', id: 'video6'},
  {title: 'Video 7', id: 'video7'},
  {title: 'Video 8', id: 'video8'},
  {title: 'Video 9', id: 'video9'},
]};

// 비디오 가져오기 
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
  if (xhr.readState === XMLHttpRequest.DONE){
    if (xhr.status === 200){                      // 비디오가 잘 받아와 졌으면 실행
      function loadVideos() {
        var videoList = document.getElementById('videoList');
        videoList.innerHTML = '';
      
        for(var i=0; i<videos.length; i++) {
            var video = document.createElement('div');
            video.innerHTML = '<h3>' + videos[i].title + '</h3><button onclick="playVideo(\'' + videos[i].id + '\')">Play</button>';
            videoList.appendChild(video);
        }
      }
    } else {                                     // 비디오 가져오기 실패 했을때 실행 
        alert('새로고침 해주세요.')
    }
  };
  xhr.open('GET','http://oreumi.appspot.com/video/getVideoList&t=')
}

// 비디오 플레이
function playVideo(id) {
  alert('Playing video: ' + id);
}




