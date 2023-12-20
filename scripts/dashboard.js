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

const userCount = document.getElementById('userCount')
const driverCount = document.getElementById('driverCount')

onValue(reference, (snapshot) => {
  userCount.innerHTML = snapshot.child('Users').size
  driverCount.innerHTML = snapshot.child('Drivers').size
})

// Driver List

const date = new Date();
const monthToday = date.getMonth() + 1
var currentDay = date.getDate() + '-' + monthToday + '-' + date.getFullYear()

var driverList = document.getElementById("driverList")

onValue(reference, (snapshot) => {
  var totalTodayRevenue = 0
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

    totalTodayRevenue += todayRevenue

    driverItem.innerHTML += 
    '<p>'+ driverDetails.firstName + ' ' + driverDetails.lastName +'</p>' +
    '<p> ₱' + todayRevenue + '</p>' +
    '<div class="driver-status-container">' +
    '<p> Active </p>' +
    '</div>'

    driverList.appendChild(driverItem)

    i++
    todayRevenue = 0

    if(i == 4) {
      return true
    }
  })


  const totalTodayRevenueP = document.getElementById('todayRevenue')
  totalTodayRevenueP.innerHTML = '₱ ' + totalTodayRevenue.toLocaleString("en-US")

  onValue(reference, (snapshot) => {
    const totalRevenue = snapshot.child('Admin').child("totalRevenue").val()

    const totalRevenueP = document.getElementById('totalRevenue')
    totalRevenueP.innerHTML = '₱ ' + (totalRevenue.toLocaleString("en-US"))
  });
});

// User List

var userList = document.getElementById("userList")

var totalTicketsCount = 0

onValue(reference, (snapshot) => {
  totalTicketsCount = 0

  snapshot.child('Commuter History').forEach((child) => {
    totalTicketsCount += child.size
  })
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
    '<p>'+ userDetails.firstName + ' ' + userDetails.lastName +'</p>' +
    '<p>' + userDetails.commuterType + '</p>' +
    '<p> ₱' + userDetails.walletBalance.toLocaleString("en-US") + '</p>' +
    '<p>' + snapshot.child('Commuter History').child(userUID).size +  '</p>' +
    '</div>'

    userList.appendChild(userItem)

    i++

    if(i == 4) {
      return true
    }
  })
})


// Transaction List

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var transactionList = document.getElementById("transactionList")

onValue(reference, (snapshot => {
  var i = 1;

  transactionList.innerHTML = ''

  snapshot.child('Admin Transaction History').forEach((childSnapshot) => {
    const transactionDetails = childSnapshot.val()

    var transactionItem = document.createElement("div")
    transactionItem.className = "list-item" 

    var dateArray = transactionDetails.date.split('-')

    var date = months[dateArray[1] - 1] + ' ' + dateArray[0] + ', ' + dateArray[2]

    transactionItem.innerHTML += 
    '<p>'+ transactionDetails.name + '</p>' +
    '<p> ₱' + (transactionDetails.amount * 1).toLocaleString("en-US") +  '</p>' +
    '</div>'

    transactionList.appendChild(transactionItem)

    i++

    if(i == 9) {
      return true
    }
  })
}))
