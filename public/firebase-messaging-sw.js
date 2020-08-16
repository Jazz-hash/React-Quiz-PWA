importScripts("https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCzUmbmJX_Den3Tn_6U6gDBLwyb_S-una4",
  authDomain: "service-push-notification.firebaseapp.com",
  databaseURL: "https://service-push-notification.firebaseio.com",
  projectId: "service-push-notification",
  storageBucket: "service-push-notification.appspot.com",
  messagingSenderId: "447400237241",
  appId: "1:447400237241:web:4baab07386431d4211e368",
  measurementId: "G-YEFF45Q97K",
});

firebase.messaging();
