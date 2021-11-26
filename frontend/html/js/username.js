sessionStorage.removeItem("hash")
    function call(){
        const username=document.querySelector('#username').value;
        sessionStorage.setItem("username",username);
        fetch(`http://localhost:3000/otp/otpverify`, {
  method: "POST",
  body: JSON.stringify({
    username
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
    if(response.status==true){
      fetch(`http://localhost:3000/otp/send`, {
  method: "POST",
  body: JSON.stringify({
    username
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
      sessionStorage.setItem("hash",response.hash);
      alert("Check otp which we sent on entered gmail account")
    window.location.href = "/otp.html";
  });
    }
    else{
     document.querySelector("#warning").innerHTML="Firstly singup before verifying account";
    }
})
    }