/*<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>채널 검색</title>
</head>

<!-- 
채널명 : oreumi, 개조
구독자 수, 채널명, 배너
 -->

<body>
    <h1>채널 찾기</h1>
    <form id="searchForm">
        <label for="channelName">채널명:</label>
        <input type="text" id="channelName" required>
        <button type="submit">검색</button>
    </form>

    <div id="channelInfo">
        <!-- 채널 정보 띄우는 곳 -->
    </div>

    <script> */

        async function fetchChannelInfo(channelName) {
            try {
                let response = await fetch(`http://oreumi.appspot.com/channel/getChannelInfo?video_channel=${channelName}`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json'
                    },
                });
                let data = await response.json();

                //채널 정보(채널명, 프로필사진, 배너, 구독자수 띄우기)
                let channelInfoElement = document.getElementById('channelInfo');
                channelInfoElement.innerHTML = `
                    <h2>${data.channel_name}</h2>
                    <img src="${data.channel_profile}" alt="Channel Profile">
                    <img src="${data.channel_banner}" alt="Channel Banner">
                    <p>Subscribers: ${data.subscibers}</p>
                `;
            } catch (error) {
                console.error('Error fetching channel information:', error);
                let channelInfoElement = document.getElementById('channelInfo');
                channelInfoElement.innerHTML = '<p>Error fetching channel information. Please try again later.</p>';
            }
        }


        document.getElementById('searchForm').addEventListener('submit', function (event) {
            event.preventDefault();
            let channelName = document.getElementById('channelName').value;
            fetchChannelInfo(channelName);
        });
  /*  </script>
</body>

</html> */