const videoGrid = document.querySelector('.video-grid');

// 0부터 20까지의 video_id
const videoIds = Array.from({length: 21}, (_, i) => i);
// video_id 값 하나씩 함수에 대입
// videoIds.forEach(videoId => {
//     fetchVideoInfo(videoId);
// });

// Promise.all를 활용하여 videoId로 정리된 값 한 번에 처리
Promise.all(videoIds.map(videoId => fetchVideoInfo(videoId)))
    .then(videos => {
        //
        videos.forEach(video => displayVideoThumbnail(video));
    })
    .catch(error => {
        console.error(error);
    });

// Mainpage Promise 사용하여 정렬
async function fetchVideoInfo(videoId) {
    return new Promise((resolve, reject) => {
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
        
            resolve(videoInfo);
        
        } else {
            console.error('ID에 대한 비디오 정보를 가져오지 못했습니다:', videoId);
        }
    };

    xhr.onerror = function() {
        console.error('네트워크 오류가 발생했습니다');
    };

    xhr.send();
    
    });
}


function sendToVideoPage(videoInfo) {
    // video_id 보내기
    window.location.href = `Video.html?video_id=${videoInfo.video_id}`;

}

function sendToChannelPage(videoInfo) {
    window.location.href = `channel.html?channel=${videoInfo.video_channel}`;
}