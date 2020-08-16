import firebase from "./Firebase";
import axios from "axios";

export const sendPushNotification = async (message: string) => {
  const messaging = firebase.messaging();
  messaging
    .requestPermission()
    .then(() => {
      return messaging.getToken();
    })
    .then(async (token) => {
      console.log("token: ", token);

      await axios
        .post(
          "https://fcm.googleapis.com/fcm/send",
          {
            notification: {
              title: "React Quiz by Jazzel Mehmood",
              body: `${message}`,
              icon: "https://mjm-quiz.netlify.app/images/logo.png",
              click_action: `/`,
            },
            to: token,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "key=AAAAaCsh2Lk:APA91bFd_2RfGBEvd06xcOzieUfYkgBz7MfFqckN5Tku-AlYACOn5GBa2m33MOcfdXJEBoxUZgg5Blt_6eeLreIKwlX-odQh9AQiyO7DsoOT3YjlLRcZBvS9Vi604JX-lla-Yd1K969Q",
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    });

  // return token;
};
