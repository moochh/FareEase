import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage, getDownloadURL, ref as storageRef } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

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

const storage = getStorage(app);

const reference = ref(database)

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var id = urlParams.get('id')
var userType = urlParams.get('type')

const nextImage = document.getElementById('nextImage')
const previousImage = document.getElementById('previousImage')
const documentImage1 = document.getElementById('documentImage1')
const documentImage2 = document.getElementById('documentImage2')
const applicationDeny = document.getElementById('applicationDeny')
const applicationApprove = document.getElementById('applicationApprove')
const documentImageLink = document.getElementById('documentImageLink')

const requestID = document.getElementById('requestID')
const userName = document.getElementById('name')
const sex = document.getElementById('sex')
const birthday = document.getElementById('birthday')
const verificationNote = document.getElementById('verificationNote')

if (userType == 'Commuter') {
  nextImage.style.display = 'none'
}

var url1
var url2

nextImage.onclick = function () {
  previousImage.style.display = 'block'
  nextImage.style.display = 'none'
  documentImage1.style.display = 'none'
  documentImage2.style.display = 'block'
  documentImageLink.href = url2
}

previousImage.onclick = function () {
  nextImage.style.display = 'block'
  previousImage.style.display = 'none'
  documentImage1.style.display = 'block'
  documentImage2.style.display = 'none'
  documentImageLink.href = url1
}

onValue(ref(database, userType + ' Applicants/' + id), (snapshot) => {
  const applicantDetails = snapshot.val()

  var applicantName
  var requestID2
  var applicantSpecificVal
  var applicantSex = ''
  var applicantBirthday = ''

  if (userType == 'Driver') {
    applicantName = applicantDetails.firstName + ' ' + applicantDetails.lastName
    requestID2 = applicantDetails.applicantID
    applicantSpecificVal = applicantDetails.route
    applicantSex = applicantDetails.sex
    applicantBirthday = applicantDetails.birthday

    verificationNote.innerHTML = 'Approve ' + applicantDetails.firstName + ' as a new driver?'

    getDownloadURL(storageRef(storage, 'Driver Applicants/' + snapshot.key + '/ID')).then((url) => {
      documentImage1.src = url
      url1 = url
      documentImageLink.href = url
    })

    getDownloadURL(storageRef(storage, 'Driver Applicants/' + snapshot.key + '/License')).then((url) => {
      documentImage2.src = url
      url2 = url
    })
  } else {
    applicantName = applicantDetails.name
    requestID2 = applicantDetails.requestID
    applicantSpecificVal = applicantDetails.commuterType

    verificationNote.innerHTML = 'Approve ' + applicantName + ' as a ' + applicantDetails.commuterType + '?'

    getDownloadURL(storageRef(storage, 'Commuter Applicants/' + snapshot.key)).then((url) => {
      documentImage1.src = url

      documentImageLink.href = url
    })

    onValue(ref(database, 'Users/' + id), (user) => {
      sex.innerHTML = user.val().sex
      birthday.innerHTML = user.val().birthday
    })
  }

  requestID.innerHTML = requestID2
  userName.innerHTML = applicantName
  sex.innerHTML = applicantSex
  birthday.innerHTML = applicantBirthday

  applicationDeny.onclick = function () {
    update(ref(database, userType + ' Applicants/' + snapshot.key), { status: 'denied' })

    window.location.replace('verification.html?list=' + userType + '');
  }

  applicationApprove.onclick = function () {
    update(ref(database, userType + ' Applicants/' + snapshot.key), { status: 'approved' })

    if (userType == 'Commuter') {
      updateUser(applicantDetails.commuterID, applicantSpecificVal)
      deleteRequest(applicantDetails.commuterID)
    }

    window.location.replace('verification.html?list=' + userType + '');
  }
})

function updateUser(commuterID, commuterType) {
  update(ref(database, 'Users/' + commuterID), { commuterType: commuterType })
}

function deleteRequest(commuterID) {
  remove(ref(database, 'Commuter Applicants/' + commuterID))
}



