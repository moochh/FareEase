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

var verificationGrid = document.getElementById('verificationGrid')
const pageHeader = document.getElementById('pageHeader')

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var listValue = urlParams.get('list')

const driverButton = document.getElementById('driverButton')
const commuterButton = document.getElementById('commuterButton')

readDatabase()

driverButton.onclick = function() {
  listValue = 'Driver'
  readDatabase()
}

commuterButton.onclick = function() {
  listValue = 'Commuter'
  readDatabase()
}

function readDatabase() {
  if(listValue == 'Driver') {
    pageHeader.innerHTML = 'Verify Driver Applicants'

    driverButton.className = 'content-container active'
    commuterButton.className = 'content-container'
  } else {
    pageHeader.innerHTML = 'Verify Commuter Requests'

    driverButton.className = 'content-container'
    commuterButton.className = 'content-container active'
  }

  onValue(reference, (snapshot) => {
    verificationGrid.innerHTML = ''

    var i = 0

    snapshot.child(listValue + ' Applicants').forEach((applicant) => {
      var applicantItem = document.createElement('div')
      applicantItem.className = 'verification-item content-container'

      const applicantDetails = applicant.val()

      if(applicantDetails.status == 'waiting'){
        var name = applicantDetails.firstName + ' ' + applicantDetails.lastName
        var id = applicantDetails.applicantID
        var applicantSpecificVal

        if(listValue == 'Driver') {
          name = applicantDetails.firstName + ' ' + applicantDetails.lastName
          id = applicantDetails.applicantID
          applicantSpecificVal = applicantDetails.route

          getDownloadURL(storageRef(storage, 'Driver Applicants/' + applicant.key + '/ID')).then((url) => {
            const IDImg = document.getElementById('IDImg-' + applicant.key)

            IDImg.src = url
          })
        } else {
          name = applicantDetails.name
          id = applicantDetails.requestID
          applicantSpecificVal = applicantDetails.commuterType

          getDownloadURL(storageRef(storage, 'Commuter Applicants/' + applicant.key)).then((url) => {
            const IDImg = document.getElementById('IDImg-' + applicant.key)

            IDImg.src = url
          })
        }

        applicantItem.innerHTML =
          '<p class="request-id">' + id + '</p>' +
          '<p>' + name + '</p>' +

          '<a href="view-application.html?id=' + applicant.key + '&type=' + listValue + '" class="document-container">' +
            '<img src="/assets/icons/photo-27.png" id="IDImg-' + applicant.key + '">' +
          '</a>' +

          '<div class="verification-item-footer">' +
            '<p>' + applicantSpecificVal + '</p>' +

            '<div class="verification-action-container">' +
              '<button class="approve" id="approve-' + id + '">' +
                '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">' +
                  '<path ' +
                    'd="M500,116c-2.48,12.35-10.16,21.27-18.8,29.89Q346,280.81,211,416c-12.15,12.16-26.29,17.47-42.91,11.63a46.27,46.27,0,0,1-16.62-10.52Q82.42,348.69,13.9,279.71C-4.57,261.15-3,234.5,17.07,218.82c15.67-12.23,37.75-10,53.36,5.57q53,52.82,105.77,105.8c1.36,1.36,2.26,3.19,4.17,6,2.08-2.83,3-4.43,4.2-5.67Q307.38,207.6,430.22,84.75C442.09,72.87,455.87,67.88,472.31,73c14.36,4.5,22.94,14.63,26.7,29,.28,1.07.66,2.12,1,3.18Z" />' +
                '</svg>' +
              '</button>' +
              '<button class="deny" id="deny-' + id + '">' +
                '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">' +
                  '<path ' +
                    'd="M439,406.58c-1.82,4.78-2.93,10-5.58,14.25-8.38,13.42-21.27,17.22-36.32,15.6-9.32-1-16.84-5.36-23.41-11.95Q313.6,364.23,253.38,304.09c-1-1-1.93-2.22-3.13-3.61-1.43,1.36-2.48,2.32-3.48,3.32L124.59,426c-12.17,12.16-33.35,14.5-48,5.31C60,420.86,56.75,395.89,70,380.12c1.26-1.5,2.64-2.91,4-4.29Q135.2,314.6,196.44,253.4a38.62,38.62,0,0,1,3.34-2.66c-1.41-1.51-2.28-2.49-3.2-3.42Q135.37,186.11,74.15,124.88A35.64,35.64,0,0,1,119.7,70.4,40.17,40.17,0,0,1,125,75q60.65,60.24,121.23,120.52c1.22,1.21,2.35,2.5,3.84,4.1,1.25-1.19,2.3-2.13,3.3-3.12q60.3-60.3,120.62-120.6C393.79,56.08,426.3,63.72,434,90.09c3.88,13.26,1.09,25.31-8.84,35.26Q364.8,185.83,304.32,246.23c-1,1-2.26,1.89-3.72,3.09,1.38,1.46,2.33,2.51,3.33,3.5Q364,312.56,424.19,372.23C431.37,379.32,436.93,387,439,397Z" />' +
                '</svg>' +
              '</button>' +
            '</div>' +
          '</div>' 

        verificationGrid.appendChild(applicantItem)

        const approve = document.getElementById('approve-' + id)
        const deny = document.getElementById('deny-' + id)

        approve.onclick = function() {
          update(ref(database, listValue + ' Applicants/' + applicant.key), {status: 'approved'})

          if (listValue == 'Commuter') {
            updateUser(applicantDetails.commuterID, applicantSpecificVal)
            deleteRequest(applicantDetails.commuterID)
          }
        }
        
        deny.onclick = function() {
          update(ref(database, listValue + ' Applicants/' + applicant.key), {status: 'denied'})
        }

        i++
      }
    })

    const applicantCount = document.getElementById('applicantCount')
    applicantCount.innerHTML = 'Showing ' + i + ' result(s)'

    for(var j = 0; j < ((i % 3) + 2); j++) {
      const verificationItemSpaceholder = document.createElement('div')
      verificationItemSpaceholder.className = 'verification-item'

      verificationGrid.appendChild(verificationItemSpaceholder)
    }
  })
}

function updateUser(commuterID, commuterType) {
  update(ref(database, 'Users/' + commuterID), {commuterType : commuterType, verified : true})
  
}

function deleteRequest(commuterID) {
  remove(ref(database, 'Commuter Applicants/' + commuterID))
}



