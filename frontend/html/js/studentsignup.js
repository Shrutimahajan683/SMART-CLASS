function callstudentsignup() {
    const fullname = document.querySelector('#fullname').value;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const cpassword = document.querySelector('#cpassword').value;
    const rollno = document.querySelector('#rollno').value;
    const allinput = document.querySelectorAll('input[name="x"]');
    let sclass;
    for (const rb of allinput) {
        if (rb.checked) {
            sclass = rb.value;
            break;
        }
        console.log(sclass)
    }
    if(!/@gmail\.com$/.test(username)){
        document.getElementById("warning").innerHTML = "Enter valid gmail.com"
        return
    }
    if(cpassword !== password){
        document.getElementById("warning").innerHTML = "Enter same password and confirm password"
        return
    }
    if (!fullname || !username || !password || !cpassword  ) {
        document.getElementById("warning").innerHTML = "Fill all the credentials properly"
        return
    }
    if (cpassword.length < 6) {
        document.getElementById("warning").innerHTML = "Password must be of length greater than 5"
        return
    }
    if (cpassword.length < 6) {
        document.getElementById("warning").innerHTML = "Password must be of length greater than 5"
        return
    }
    data = fetch(`http://localhost:3000/signup/student`, {
        method: "POST",
        body: JSON.stringify({
            fullname,
            username,
            password,
            rollno,
            sclass
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
                console.log(response.mssg)
                document.getElementById("warning").innerHTML = `${response.mssg}`;
                return
            }
            else{
                window.location.href = "/username.html";
            }
        });
}
document.querySelector('#studentsignup').addEventListener('keypress', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
        callstudentsignup();
    }
});