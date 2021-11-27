if(sessionStorage.getItem("role")!="student")
window.history.back()
   const id=sessionStorage.getItem("assignment");
//storing assignments to database
  fetch(`http://localhost:3000/anotherfeature/submitassignment`, {
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
console.log(response);
const result=response.data;
let htmlCode=``;
htmlCode =
  htmlCode +
  
  `
          <div class="row assiassi justify-content-center">
          <h6 class="name">Assignment- ${result[0].assignmentname}</h6>
          <a href="${result[0].filepath}" class="role_btn">Assignment</a>
          </div>
        `;
htmlCode=htmlCode+ `<div class="assicontainer">
  <h1>Upload Your File</h1>
  <form id='form'>
      <div class="input-group">
          <label for='name'>File Name</label>
          <input name='name' id='name' placeholder="Enter your name" />
      </div>
      <div class="input-group">
          <label for='files'>Select files(only pdf)</label>
          <input id='files' type="file" multiple accept="application/pdf">
      </div>
      <button class="submit-btn"  value="${result[0].id}" type='submit' id="upload">Upload</button>
  </form>
</div>
`

const cards = document.querySelector("#data");
console.log(htmlCode)

cards.innerHTML = htmlCode;
const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
e.preventDefault();
const name = document.getElementById("name");
const files = document.getElementById("files");
const id=document.getElementById("upload").value;
console.log(id);
const formData = new FormData();
formData.append("name", name.value);
  for(let i =0; i < files.files.length; i++) {
      formData.append("files", files.files[i]);
}
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
    fetch(`http://localhost:3000/anotherfeature/submission`, {
   method: "POST",
   body: JSON.stringify({
  id,
  token:sessionStorage.getItem("token"),
  path:filename,
  assignmentname:file,
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
  window.location.href = "/submitassignment.html";
}

});