const menu = document.querySelector('#menu'); // menu 버튼
const sidebar = document.querySelector('.sidebar'); // 사이드바

// 클릭시 사이드바 토글
menu.addEventListener('click', () => {
  document.body.classList.toggle('show-sidebar');
});

// 화면 크기가 변경될 때 사이드바 상태 업데이트
const mediaQuery = window.matchMedia('(min-width: 769px)');
mediaQuery.addEventListener('change', (event) => {
  if (event.matches) {
    document.body.classList.remove('show-sidebar');
  }
});

// 사이드 바와 메뉴 버튼 외 영역 클릭시 사이드바 숨김
document.addEventListener('click', (event) => {
  if (!sidebar.contains(event.target) && !menu.contains(event.target)) {
    document.body.classList.remove('show-sidebar');
  }
});
