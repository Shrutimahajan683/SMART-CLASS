//Anyone who want to access this UI will be redirected to the back UI expect any teacher of this website
if(sessionStorage.getItem("role")!="teacher")
window.history.back()
sessionStorage.removeItem("assignment");
function call(data){
sessionStorage.setItem("assignment",data);
}

//end submission by sending id of assignment division to backend
function updatevalid(id){
fetch(`http://localhost:3000/anotherfeature/updatevalid`, {
  method: "POST",
  body: JSON.stringify({
 id
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
alert("Ended submission")
})
}

//form div
const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
e.preventDefault();
const name = document.getElementById("name");
const files = document.getElementById("files");
const formData = new FormData();
formData.append("name", name.value);
 for(let i =0; i < files.files.length; i++) {
     formData.append("files", files.files[i]);
}
//uploading assignment to backend
fetch(`http://localhost:3000/feature/uploadassignment`, {
 method: 'post',
 body: formData,
 headers: {
'Accept': 'application/json'
}
})
.then(response => {
 return response.json()
})
.then(response => {
 const filename=response.data.filename
 const file=document.querySelector("#name").value;
  console.log(filename)
   fetch(`http://localhost:3000/anotherfeature/assignment`, {
  method: "POST",
  body: JSON.stringify({
 token:sessionStorage.getItem("token"),
 path:filename,
 assignmentname:file,
 sclass:sessionStorage.getItem("identity")
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
fetch(`http://localhost:3000/image/${filename}`, {
   })
   .catch((err)=>console.log(err))
});
 })

 // .catch((err) => ("Error occured", err));
 alert("file uploaded")
 window.location.href = "/assignment.html";
}

//fetching assignments from backend
fetch(`http://localhost:3000/anotherfeature/fetchassignments`, {
  method: "POST",
  body: JSON.stringify({
 token:sessionStorage.getItem("token"),
 sclass:sessionStorage.getItem("identity")
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
const result=response.data;
let htmlCode=``;
console.log(response);
if(result.length==0)
 {
   document.querySelector("#all").innerHTML="NO ASSIGNMENT"
      let  htmlCode =
 `
 <div class="card1" style="width: 18rem;">
     <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
 </div>
`;
const container=document.querySelector("#assignments")
     container.innerHTML=htmlCode;
     }

else{
  //rendring assignments for teacher view
for(let c=0;c<result.length;c++) {
htmlCode =
 htmlCode +
 
 `
         <div class="row subassi">
         <h6 class="ml-0 mt-6">Name- ${result[c].assignmentname}</h6>
         <a href="/viewsubmissions.html" onclick='call("${result[c].id}")' class="v">View Submissions</a>
         <button type="button" onclick='updatevalid("${result[c].id}")' class="end">End submission</button>
         </div>
       `;
}


const cards = document.querySelector("#assignments");
console.log(htmlCode)

cards.innerHTML = htmlCode;
}
})