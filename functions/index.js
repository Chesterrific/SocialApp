const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const app = express();

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamID: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
});

// How to fetch collections w/out Express.
// exports.getScreams = functions.https.onRequest((request, response) => {
//   admin
//     .firestore()
//     .collection("screams")
//     .get()
//     .then((data) => {
//       let screams = [];
//       data.forEach((doc) => {
//         screams.push(doc.data());
//       });
//       return response.json(screams);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });

// Create new item in collection, in this case a new scream w/out Express.
// exports.createScream = functions.https.onRequest((req, res) => {
//   if (req.method != "POST") {
//     return res.status(400).json({ error: "method not allowed" });
//   }
//   const newScream = {
//     body: req.body.body,
//     userHandle: req.body.userHandle,
//     createdAt: admin.firestore.Timestamp.fromDate(new Date()),
//   };

//   admin
//     .firestore()
//     .collection("screams")
//     .add(newScream)
//     .then((doc) => {
//       res.json({ message: `document ${doc.id} created successfully` });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: "something went wrong" });
//       console.error(err);
//     });
// });

// https://baseurl.com/api/ formatting
exports.api = functions.https.onRequest(app);
