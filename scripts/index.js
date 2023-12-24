const passwordInput = document.getElementById('passwordInput')
const passwordIncorrect = document.getElementById('passwordIncorrect')
// const login = document.getElementById('login')

const passwords = ['123456', 'adminpass', 'admin123']

// login.onclick = function() {
//   
// }

passwordInput.onkeydown = function() {
  if(window.event.keyCode=='13'){
    if (passwordInput.value == '') {
      passwordIncorrect.style.display = 'block'
      passwordIncorrect.innerHTML = 'Please enter password!'
    } else if (!passwords.includes(passwordInput.value)) {
      passwordIncorrect.style.display = 'block'
      passwordIncorrect.innerHTML = 'Password is incorrect!'
    } else {
      window.location.replace("dashboard.html");
    }
  }
}