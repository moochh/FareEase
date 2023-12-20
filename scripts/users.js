import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBO6C24jQuAluEmq1I2aZ68f3N4COpI3Co",
  authDomain: "fareease-3e02c.firebaseapp.com",
  databaseURL: "https://fareease-3e02c-default-rtdb.firebaseio.com",
  projectId: "fareease-3e02c",
  storageBucket: "fareease-3e02c.appspot.com",
  messagingSenderId: "569286516763",
  appId: "1:569286516763:web:b374d011a475f9e3ca98be",
  measurementId: "G-LD6GQ6N0PM"
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const reference = ref(database)

const date = new Date();
const monthToday = date.getMonth() + 1
var currentDay = date.getDate() + '-' + monthToday + '-' + date.getFullYear()

var userList = document.getElementById("userList")
var totalTicketsIssued = document.getElementById("totalTicketsIssued")
var userCount = document.getElementById("userCount")

var totalTicketsCount = 0

onValue(reference, (snapshot) => {
  totalTicketsCount = 0

  snapshot.child('Commuter History').forEach((child) => {
    totalTicketsCount += child.size
  })

  totalTicketsIssued.innerHTML = totalTicketsCount.toLocaleString("en-US")
})


onValue(reference, (snapshot) => {
  var i = 1;

  userList.innerHTML = ''

  snapshot.child('Users').forEach((childSnapshot) => {
    const userUID = childSnapshot.key
    const userDetails = childSnapshot.val()

    var userItem = document.createElement("div")
    userItem.className = "list-item" 


    userItem.innerHTML += 
    '<p>' + i + '</p>' + 
    '<p>'+ userDetails.firstName + ' ' + userDetails.lastName +'</p>' +
    '<p>' + userUID +'</p>' +
    '<p>' + userDetails.commuterType + '</p>' +
    '<p> ₱' + userDetails.walletBalance.toLocaleString("en-US") + '</p>' +
    '<p>' + snapshot.child('Commuter History').child(userUID).size +  '</p>' +
    '</div>'

    userList.appendChild(userItem)

    i++
  })

  userCount.innerHTML = (i - 1).toLocaleString("en-US")
})
