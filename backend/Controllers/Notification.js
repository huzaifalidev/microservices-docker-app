const axios = require('axios');

const sendNotification = async (playerId, heading, content, dataType, sendAfter = null) => {
  let send_time = null;
  
  if (sendAfter && typeof sendAfter === 'number') {
    const now = new Date();
    send_time = (new Date(now.getTime() + sendAfter * 60 * 1000)).toUTCString();
  }
  
  if (!playerId) return;
  
  try {
    const payload = {
      app_id: process.env.ONESIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { en: heading } || { en: "Notification" },
      contents: { en: content },
      small_icon: "ic_stat_notify",
      large_icon: "https://res.cloudinary.com/dwixz6xjj/image/upload/v1749462889/ic_launcher_grmcbd.png",
      priority: 10,
      ledColor: "#0052cc",
      android_visibility: 1,
      data: {
        type: dataType,
      }
    };

    if (send_time) { 
      payload.send_after = send_time;
    }

    await axios.post(process.env.ONESIGNAL_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + process.env.ONESIGNAL_REST_API_KEY
      }
    });
  } catch (err) {
    console.error('❌ Notification error:', err.response?.data || err.message);
  }
};

module.exports = sendNotification;
