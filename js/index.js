const sidebar = document.querySelector('.Sidebar_Large'); // 사이드바
const menu = document.querySelector('.icon'); // menu 버튼


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

function openChannel(element) {
  var channelName = element.getAttribute("data-channel");
  window.location.href = "test_channel.html?channel=" + encodeURIComponent(channelName);
}


