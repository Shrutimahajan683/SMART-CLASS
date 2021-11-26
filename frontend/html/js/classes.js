if(sessionStorage.getItem("role")!="teacher")
window.history.back()
 function requestcall(){
     window.location.href = "/requests.html";
 }
 function assignmentcall(){
     window.location.href = "/assignment.html";
 }
 function quizcall(){
     window.location.href = "/quiz.html";
 }
 function discussion(){
     window.location.href = "/discussion.html";
 }