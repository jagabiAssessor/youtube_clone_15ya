const toolBar = document.querySelector('.Channel-Toolbar');
const scrollRight = document.getElementById('rightArrow');
const scrollLeft = document.getElementById('leftArrow');
const videogrid = document.querySelector('.video-grid');
const channelScrollRight = document.getElementById('channelRightArrow');
const channelScrollLeft = document.getElementById('channelLeftArrow');


//버튼을 클릭하면 현재 스크롤 위치에서 +200
scrollRight.addEventListener('click', () => {
  toolBar.scroll({
    left: toolBar.scrollLeft + 300,
    behavior: 'smooth'
  });

});
channelScrollRight.addEventListener('click', () => {
  videogrid.scroll({
    left: videogrid.scrollLeft + 200,
    behavior: 'smooth'
  });

});

//버튼을 클릭하면 현재 스크롤 위치에서 -200
scrollLeft.addEventListener('click', () => {
  toolBar.scroll({
    left: toolBar.scrollLeft - 200,
    behavior: 'smooth'
  });
});
channelScrollLeft.addEventListener('click', () => {
  videogrid.scroll({
    left: videogrid.scrollLeft - 200,
    behavior: 'smooth'
  });
});

function handleScroll() {
  //최대 스크롤값 = 실제 요소의 너비값-보이는 요소의 너비값
  const scrollMax = toolBar.scrollWidth - toolBar.clientWidth;

  //최대 스크롤 값이 0이면 버튼을 숨김
  if (toolBar.scrollLeft <= 0) {
    scrollLeft.style.visibility = "hidden";
  } else {
    scrollLeft.style.visibility = "visible";
  }

  if (toolBar.scrollLeft >= scrollMax) {
    scrollRight.style.visibility = "hidden";
  } else {
    scrollRight.style.visibility = "visible";
  }
}
 toolBar.addEventListener("scroll", handleScroll);
 window.addEventListener('load', handleScroll);

 // 화면 크기가 변경될 때 스크롤바 상태 업데이트
 window.addEventListener('resize', handleScroll);