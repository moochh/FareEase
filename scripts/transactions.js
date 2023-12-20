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

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var transactionList = document.getElementById("transactionList")
var totalAmount = document.getElementById("totalAmount")
var transactionCount = document.getElementById("transactionCount")

onValue(reference, (snapshot => {
  transactionCount.innerHTML = snapshot.child('Admin Transaction History').size.toLocaleString("en-US")

  totalAmount.innerHTML = '₱ ' + snapshot.child('Admin').child('totalTransactions').val().toLocaleString("en-US")

  var i = 1;

  transactionList.innerHTML = ''

  snapshot.child('Admin Transaction History').forEach((childSnapshot) => {
    const transactionDetails = childSnapshot.val()

    var transactionItem = document.createElement("div")
    transactionItem.className = "list-item" 

    var dateArray = transactionDetails.date.split('-')

    var date = months[dateArray[1] - 1] + ' ' + dateArray[0] + ', ' + dateArray[2]

    transactionItem.innerHTML += 
    '<p>' + i + '</p>' + 
    '<p>'+ transactionDetails.name + '</p>' +
    '<p>' + transactionDetails.transactionID +'</p>' +
    '<p>' + date + '</p>' +
    '<p> ₱' + (transactionDetails.amount * 1).toLocaleString("en-US") +  '</p>' +
    '</div>'

    transactionList.appendChild(transactionItem)

    i++
  })
}))
