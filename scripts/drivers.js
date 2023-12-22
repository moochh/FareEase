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

var driverList = document.getElementById("driverList")

onValue(reference, (snapshot) => {
  var i = 1;
  var todayRevenue = 0

  driverList.innerHTML = ''

  snapshot.child('Drivers').forEach((childSnapshot) => {
    const driverUID = childSnapshot.key
    const driverDetails = childSnapshot.val()

    var driverItem = document.createElement("div")
    driverItem.className = "list-item" 

    const driverHistoryReference = ref(database, 'Driver History/' + driverUID)

    onValue(driverHistoryReference, (snapshot) =>  {
      snapshot.forEach((childSnapshot) => {
        if(childSnapshot.val().date == currentDay) {
          todayRevenue += childSnapshot.val().price
        }
      })
    })

    console.log(todayRevenue)

    driverItem.innerHTML = 
    '<p>' + i + '</p>' + 
    '<p>'+ driverDetails.firstName + ' ' + driverDetails.lastName +'</p>' +
    '<p>' + driverUID +'</p>' +
    '<p>' + driverDetails.route +'</p>' +
    '<p> ₱' + todayRevenue + '</p>' +
    '<p> ₱' + driverDetails.revenue + '</p>' +
    '<div class="driver-status-container ' + driverDetails.scanningStatus + '">' +
    '<p>' + driverDetails.scanningStatus + '</p>' +
    '</div>'

    driverList.appendChild(driverItem)

    i++
    todayRevenue = 0
  })

  const driverCount = document.getElementById('driverCount')
  driverCount.innerHTML = (i - 1).toLocaleString("en-US")

  onValue(reference, (snapshot) => {
    const totalRevenue = snapshot.child('Admin').child("totalRevenue").val()

    const totalRevenueP = document.getElementById('totalRevenue')
  totalRevenueP.innerHTML = '₱ ' + (totalRevenue.toLocaleString("en-US"))
  });
});
