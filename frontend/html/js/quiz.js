if(sessionStorage.getItem("role")!="teacher")
window.history.back()
 sessionStorage.removeItem("count");
 sessionStorage.removeItem("nquiz");
 function call(){
     let count=document.querySelector("#count").value;
     let qname=document.querySelector("#nquiz").value;
     if(!qname)
     {
         alert("Enter quiz name");
         return;
     }
     if(count>100)
     {alert("Enter no of questions less than or equal to 100");
     return;
     }
     if(count<1)
     {alert("Enter atleast 1 in no of questions");
     return;
     }
     sessionStorage.setItem("count",count);
     sessionStorage.setItem("nquiz",qname);
     window.location.href = "/createquiz.html";
 }