const sidebar = document.querySelector('.Sidebar_Large'); // 사이드바
const menu = document.querySelector('.icon'); // menu 버튼
const overlay = document.querySelector('.overlay');  // overlay
const body = document.body; // body 선택

menu.addEventListener('click', function () {
    sidebar.classList.toggle('showSidebar');
    overlay.classList.toggle('showOverlay');

    // 사이드바 토글 시 화면 스크롤 방지
    if (overlay.classList.contains('showOverlay')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }

  });

// 사이드 바, 메뉴 외 클릭시 사이드바 닫힘
document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && !menu.contains(event.target)) {
    sidebar.classList.remove('showSidebar');
    overlay.classList.remove('showOverlay');
    
    if (overlay.classList.contains('showOverlay')) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
  }
});

function openChannel(element) {
  var channelName = element.getAttribute("data-channel");
  window.location.href = "test_channel.html?channel=" + encodeURIComponent(channelName);
}


