// 영상 전체 리스트 가져오기
function getVideoList() {
    var apiUrl = 'http://oreumi.appspot.com/video/getVideoList';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var videoList = JSON.parse(xhr.responseText);
                var videoTitle = document.getElementById('videoTitle').value.trim();

                // 영상 제목으로 videoId 찾기
                var videoId = findVideoIdByTitle(videoList, videoTitle);
                if (!videoId) {
                    displayResult('해당 영상이 존재하지 않습니다.');
                } else {
                    getVideoInfo(videoId);
                }
            } else {
                displayResult('영상 전체 리스트를 가져오는 데 실패했습니다.');
            }
        }
    };

    xhr.send();
}

// 영상 정보 가져오기 (videoId로부터)
function getVideoInfo(videoId) {
    var apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${videoId}`;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                displayResult(response);
            } else {
                displayResult('영상 정보를 가져오는 데 실패했습니다.');
            }
        }
    };

    xhr.send();
}

// 영상 제목으로 videoId 찾기
function findVideoIdByTitle(videoList, title) {
    for (var i = 0; i < videoList.length; i++) {
        if (videoList[i].video_title === title) {
            return videoList[i].video_id;
        }
    }
    return null;
}

// 영상 정보 가져오기 (사용자 입력으로부터)
function getVideoInfoFromTitle() {
    var videoTitle = document.getElementById('videoTitle').value.trim();
    if (!videoTitle) {
        alert('영상 제목을 입력해주세요.');
        return;
    }

    getVideoList();
}

// 결과를 화면에 표시
function displayResult(data) {
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = JSON.stringify(data, null, 2);
}