function callsignin() {
    const role = document.querySelector('#role').value;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    if(!/@gmail\.com$/.test(username)){
      document.getElementById("warning").innerHTML = "Enter valid gmail id"
      return
    }
    if (!username || !password) {
      document.getElementById("warning").innerHTML = "Fill all the credentials properly"
      return
    }
    console.log(role)
    if (role == "student") {
      data = fetch(`http://localhost:3000/signin/student`, {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Accept': 'application/json'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(response => {
          console.log(response)
          if (response.status == false) {
            document.getElementById("warning").innerHTML = `${response.mssg}`;
            return
          }
          else {
            sessionStorage.setItem('token', response.mssg)
            sessionStorage.setItem('data', response.data);
            sessionStorage.setItem('role',response.role)
            // updatestudenthome(response.subjects);
            window.location.href = "/home.html";
          }
        });
    }
    else if(role=="teacher") {
      data = fetch(`http://localhost:3000/signin/teacher`, {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Accept': 'application/json'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(response => {
          if (response.status == false) {
            document.getElementById("warning").innerHTML = `${response.mssg}`;
            return
          }
          else {
            sessionStorage.setItem('token', response.mssg)
            sessionStorage.setItem('data', response.data);
            console.log(sessionStorage.getItem("data"))
            sessionStorage.setItem('role',response.role)
            // updatestudenthome(response.subjects);
            window.location.href = "/home.html";
          }
        });
    }
    else{
      data = fetch(`http://localhost:3000/signin/admin`, {
        method: "POST",
        body: JSON.stringify({
          username,
          password
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Accept': 'application/json'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(response => {
            console.log(response)
          if (response.status == false) {
            document.getElementById("warning").innerHTML = `${response.message}`;
            return
          }
          else {
            sessionStorage.setItem('role',"admin")
            // updatestudenthome(response.subjects);
            window.location.href = "/dashboard.html";
          }
        });
    }
  }
  document.querySelector('#signin').addEventListener('keypress', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      callsignin();
    }
  });