/*<!DOCTYPE html>
<html>
<head>
  <title>채널 비디오 정보</title>
</head>
<body>
  <h1>채널 비디오 정보</h1>
  <label for="channelName">채널명을 입력하세요:</label>
  <input type="text" id="channelName">
  <button onclick="getChannelVideos()">검색</button>
  <div id="result"></div>

  <script> */
function getChannelVideos() {
  const channelName = document.getElementById('channelName').value;
  const apiUrl = `http://oreumi.appspot.com/video/getVideoList`;

  fetch(apiUrl, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }
      return response.json();
    })
    .then(data => {
      // 요청에 성공한 경우 데이터를 가지고 작업 수행
      const filteredData = data.filter(item => item.video_channel === channelName);
      if (filteredData.length > 0) {
        const videoIds = filteredData.map(item => item.video_id);
        return Promise.all(videoIds.map(videoId => getVideoInfo(videoId)));
      } else {
        throw new Error('해당 채널에 대한 데이터가 없습니다.');
      }
    })
    .then(videoInfos => {
      displayResults(videoInfos);
    })
    .catch(error => {
      // 요청에 실패한 경우 에러 처리
      console.error('오류:', error);
    });
}

function getVideoInfo(videoId) {
  const apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;

  return fetch(apiUrl, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('네트워크 응답이 올바르지 않습니다.');
      }
      return response.json();
    });
}

function displayResults(data) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (data && data.length > 0) {
    const ul = document.createElement('ul');

    data.forEach(videoInfo => {
      const li = document.createElement('li');
      li.innerHTML = `
            <h2>${videoInfo.video_title}</h2>
            <p>조회수: ${videoInfo.views}, 업로드 날짜: ${videoInfo.upload_date}</p>
            <p>동영상 설명: ${videoInfo.video_detail}</p>
            <iframe width="560" height="315" src="${videoInfo.video_link}" frameborder="0" allowfullscreen></iframe>
          `;
      ul.appendChild(li);
    });

    resultDiv.appendChild(ul);
  } else {
    resultDiv.textContent = '해당 채널에 대한 데이터가 없습니다.';
  }
}
  /* </script>
</body>
</html> */
