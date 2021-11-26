if(!sessionStorage.getItem("username"))
window.history.back()
function call(){
    fetch(`http://localhost:3000/otp/verify`, {
method: "POST",
body: JSON.stringify({
otp:document.querySelector("#otp").value,
hash:sessionStorage.getItem("hash"),
username:sessionStorage.getItem("username"),
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
if(response.status==false)
document.querySelector("#warning").innerHTML=response.message;
else
{
fetch(`http://localhost:3000/otp/verifygmail`, {
method: "POST",
body: JSON.stringify({
username:sessionStorage.getItem("username")
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
alert("Account Verified")
sessionStorage.removeItem("hash");
sessionStorage.removeItem("username");
window.location.href = "/signin.html";
});
}
});
}