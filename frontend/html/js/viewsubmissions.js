if(sessionStorage.getItem("role")!="teacher")
window.history.back()
 function call(id,name){
     const marks=document.querySelector("#marks").value
     fetch(`http://localhost:3000/anotherfeature/updatemarks`, {
  method: "POST",
  body: JSON.stringify({
 marks,
  id,
  name
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
document.querySelector("#var").innerHTML=`<label for="date" class="lmarks">Enter Marks-${response.marks}</label>`
})
 }
  const assignment=sessionStorage.getItem("assignment")
 fetch(`http://localhost:3000/anotherfeature/fetchsubmissions`, {
method: "POST",
body: JSON.stringify({
assignment
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
for(let c=0;c<result.length;c++) {
   if(!result[c].marks){
     htmlCode =
 htmlCode +
 
 `
         <div class="row sub justify-content-center">
         <h6 class="fname">Name- ${result[c].full_name}</h6>
         <h6 class="rollno">Roll No- ${result[c].rollno}</h6>
         <a href="${result[c].filepath}")' class="assi">Assignment</a>
         <div id="var">
         <label for="date" class="lmarks">Enter Marks-</label>
         <input type="number" class="marks" id="marks"> 
         <button type="button" id="${result[c].id}" onclick='call("${result[c].id}","${result[c].full_name}")' class="abutton">Submit</button>
         </div>
         </div>
       `;
   }
else{
 htmlCode =
 htmlCode +
 
 `
         <div class="row sub justify-content-center">
         <h6 class="fname">Name- ${result[c].full_name}</h6>
         <h6 class="rollno">Roll No- ${result[c].rollno}</h6>
         <a href="${result[c].filepath}")' class="assi">Assignment</a>
         <div id="var">
             <label for="date" class="lmarks">Enter Marks-${result[c].marks}</label>
         </div>
         </div>
       `;
}
}


const cards = document.querySelector("#data");
console.log(htmlCode)

cards.innerHTML = htmlCode;
});