if(sessionStorage.getItem("role")!="student")
        window.history.back()
        function call(){
            window.location.href = "/allquiz.html";
        }
        function view(){
            window.location.href = "/studentassignment.html";
        }
        function discussion(){
            window.location.href = "/discussion.html";
        }

//taking class request from frontend and storing it to backend
function request(){
    const time=document.querySelector("#timePicker").value;
    const token=sessionStorage.getItem("token");
    const subject=sessionStorage.getItem("identity");
    const sdate=document.querySelector("#date").value;
    const date=new Date();
    const n=new Date(sdate);
    const sevendays=new Date(new Date().setDate(new Date().getDate() + 7))
    const updatesevendays=sevendays.setHours(0,0,0);
   const newsdate=n.setHours(0,0,0,0);
   const newdate=date.setHours(0,0,0,0);
   console.log(sevendays)
   if(!sdate)
   {
     alert("select date before sending request");
     return;
   }
    if(newsdate<newdate)
    {
    alert("Select valid date")
    return;
    }
    if(newsdate>updatesevendays){
      alert("Select date within 7 days")
      return;
    }
    if(newsdate==newdate){
      var d = new Date();
      if(time<d.toLocaleString('en-GB'))
      {
        alert("Select valid time")
        return;
      }
    }
    if(time<'08:00'||time>'17:00')        
   {
    console.log(time)
    alert("Select class timing in between 8 AM and 4 PM")
    return;
   } 
   //request send to backend
    data = fetch(`http://localhost:3000/classrequest/sendrequest`, {
        method: "POST",
        body: JSON.stringify({
          time,
          token,
          subject,
          sdate
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
            console.log(response.Status);
          if(response.Status==true)
          {
              alert("Request has been submitted")
              console.log("Request has been submitted")
          }
          else
          {
          alert(`${response.mssg}`)
        }
        });
}

function practicequiz(){
  console.log("hey")
  //fetching quizes from backend
  fetch(`http://localhost:3000/quiz/getquiz`, {
        method: "POST",
        body: JSON.stringify({
          token:sessionStorage.getItem("token"),
          subject:sessionStorage.getItem("identity")
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
        });
}