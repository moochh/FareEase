import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, set, update, remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const routeKey = urlParams.get('route')

const inputError = document.getElementById('inputError')
const routeNameInput = document.getElementById('routeNameInput')

routeNameInput.value = routeKey

var landmarkCount = 0

const addAnotherLandmarkButton = document.getElementById('addAnotherLandmarkButton')
const addRouteButton = document.getElementById('addRouteButton')
const newRouteContainer = document.getElementById('newRouteContainer')

onValue(reference, (snapshot) => {
  newRouteContainer.innerHTML = ''

  snapshot.child('Routes/' + routeKey).forEach((landmark) => {
    const landmarkItem = document.createElement('div')
    landmarkItem.className = 'list-item'  
    landmarkItem.id = landmark.key

    const landmarkName = landmark.key.split(': ')[1].replaceAll('*', '')

    landmarkItem.innerHTML = 
    '<input type="text" id="" placeholder="Landmark Name" value="' + landmarkName + '">' +
    '<input type="text" id="" placeholder="Coordinates" value="' + landmark.val() + '">' +
    '<button class="delete-landmark-button" id="deleteLandmark' + landmark.key + '">' +
      '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">' +
        '<path ' +
          'd="M7,242.89c3.07-7,5.16-14.65,9.41-20.83C25.5,208.83,39,202.91,54.93,202.54c.94,0,1.89,0,2.84,0q191.77,0,383.55,0c13.3,0,25,3.65,35.25,12.42,20.2,17.31,20.21,52,0,69.25a49.64,49.64,0,0,1-33.36,12.37q-193.66,0-387.34,0c-24.69,0-42.44-14.6-48.07-38.69a8.21,8.21,0,0,0-.8-1.63Z" />' +
      '</svg>' +
    '</button>'

    newRouteContainer.appendChild(landmarkItem)

    const deleteLandmarkButton = document.getElementById('deleteLandmark' + landmark.key)

    deleteLandmarkButton.onclick = function () {
      landmarkItem.remove()
    }
  })

  newRouteContainer.appendChild(addAnotherLandmarkButton)
})

addAnotherLandmarkButton.onclick = function () {
  landmarkCount++

  const newLandmarkItem = document.createElement('div')
  newLandmarkItem.className = 'list-item'
  newLandmarkItem.id = 'landmarkItem' + landmarkCount

  newLandmarkItem.innerHTML = 
    '<input type="text" id="" placeholder="Landmark Name">' +
    '<input type="text" id="" placeholder="Coordinates">' +
    '<button class="delete-landmark-button" id="deleteLandmark' + landmarkCount + '">' +
      '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">' +
        '<path ' +
          'd="M7,242.89c3.07-7,5.16-14.65,9.41-20.83C25.5,208.83,39,202.91,54.93,202.54c.94,0,1.89,0,2.84,0q191.77,0,383.55,0c13.3,0,25,3.65,35.25,12.42,20.2,17.31,20.21,52,0,69.25a49.64,49.64,0,0,1-33.36,12.37q-193.66,0-387.34,0c-24.69,0-42.44-14.6-48.07-38.69a8.21,8.21,0,0,0-.8-1.63Z" />' +
      '</svg>' +
    '</button>'

  newRouteContainer.insertBefore(newLandmarkItem, addAnotherLandmarkButton)

  const deleteLandmarkButton = document.getElementById('deleteLandmark' + landmarkCount)

  deleteLandmarkButton.onclick = function () {
    newLandmarkItem.remove()
  }
}


addRouteButton.onclick = function() {
  const allInputs = newRouteContainer.children
  const format = new RegExp(/^[0-9]*[\.]{1}[0-9]*$/)
  const specialCharacters = new RegExp(/[A-Za-z\!\@\#\$\%\^\&\*\)\(+\=_-\s]/)
  var invalidFormat = true
  var inputsComplete = true

  var newRouteValues = {}
  
  var beginningChar = 'a'
  var beginningIndex = 0
  var previousLandmark = ''
  var previousLandmarkCounter = 0


  for (var i = 0; i < allInputs.length - 1; i++) {
    const inputContainer = allInputs[i]
    const input1 = inputContainer.getElementsByTagName('input')[0]
    const input2 = inputContainer.getElementsByTagName('input')[1]
    const landmarkName = input1.value
    const coordinates = input2.value

    if (previousLandmark != landmarkName) {
      previousLandmark = landmarkName
      previousLandmarkCounter = 0
    } else {
      previousLandmarkCounter++
    }
    
    var newLandmarkName = beginningChar + beginningIndex + ': ' + landmarkName

    for (var j = 0; j < previousLandmarkCounter; j++) {
      newLandmarkName += '*'
    }

    newRouteValues[newLandmarkName] = coordinates

    if (coordinates != '') {
      const lat = coordinates.split(', ')[0]
      const long = coordinates.split(', ')[1]

      if (long != undefined) {
        if(lat.match(format) && long.match(format)) {
          invalidFormat = false
        }
      }
    }

    if(landmarkName == '') {
      input1.style.border = '1px solid var(--red_dark)'
      inputError.style.display = 'block'
      inputsComplete = false
    } else {
      input1.style.border = '1px solid var(--light)'
      inputError.style.display = 'none'
    }

    if(coordinates == '') {
      input2.style.border = '1px solid var(--red_dark)'
      inputError.style.display = 'block'
      inputsComplete = false
    } else {
      input2.style.border = '1px solid var(--light)'
      inputError.style.display = 'none'
    }

    if (invalidFormat) {
      input2.style.border = '1px solid var(--red_dark)'
      inputError.style.display = 'block'
    } else {
      input2.style.border = '1px solid var(--light)'
      inputError.style.display = 'none'
    }

    beginningIndex++

    if (beginningIndex == 10) {
      beginningIndex = 0
      beginningChar = String.fromCharCode(beginningChar.charCodeAt(0) + 1)
    }
  }

  if (routeNameInput.value == '') {
    routeNameInput.style.border = '1px solid var(--red_dark)'
    inputsComplete = false
  } else {
    routeNameInput.style.border = '1px solid var(--light)'
  }

  if (!invalidFormat && inputsComplete) {
    remove(ref(database, 'Routes/' + routeKey))
    set(ref(database, 'Routes/' + routeNameInput.value), newRouteValues)

    console.log('add')

    window.location.replace("routes.html");
  } else {
    console.log('not update')
  }

  console.log(newRouteValues)
}
