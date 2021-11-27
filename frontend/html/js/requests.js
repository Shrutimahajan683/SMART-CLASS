if(sessionStorage.getItem("role")!="teacher")
       window.history.back()
    const token=sessionStorage.getItem("token");
const sclass=sessionStorage.getItem("identity");
function accept(time,date){
    const capacity=document.querySelector("#capacity").value;

    //accepting class request and sending data to backend
    fetch(`http://localhost:3000/classrequest/acceptclassdata`, {
        method: "POST",
        body: JSON.stringify({
          token,
          sclass,
          time,
          date,
          capacity
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Accept': 'application/json'
        }
      })
        .then(response => {
            console.log("hey")
          return response.json()
        })
        .then(response => {
            if(response.Status==true)
            window.location.href = "/classes.html";
});
}

//decling class request and removing it from database by sending request to backend
function decline(time,date){
    const token=sessionStorage.getItem("token");
    fetch(`http://localhost:3000/classrequest/declineclassdata`, {
        method: "POST",
        body: JSON.stringify({
          token,
          sclass,
          time,
          date
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Accept': 'application/json'
        }
      })
        .then(response => {
            console.log("hey")
          return response.json()
        })
        .then(response => {
            if(response.Status==true)
            window.location.href = "/classes.html";
});
}

//fetching class requests for teacher and displaying them for teacher
 fetch(`http://localhost:3000/classrequest/classdata`, {
        method: "POST",
        body: JSON.stringify({
          token,
          sclass
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Accept': 'application/json'
        }
      })
        .then(response => {
            console.log("hey")
          return response.json()
        })
        .then(response => {
          if(response.Status==true)
          {
            let htmlCode = ``;
            const requests=response.data;
            if(requests.length==0)
            {
              document.querySelector("#substyle").innerHTML="NO REQUESTS"
             let  htmlCode =
        `
        <div class="card1 empty" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
        </div>
  `;
  const container=document.querySelector("#requests")
            container.innerHTML=htmlCode;
            }
            else{
              requests.forEach(function(request) {
              let timeconverted=request.time;
              let s='AM';
              let t1=Number(timeconverted[0]);
              let t2=Number(timeconverted[1]);
              let total=t1*10+t2;
              if(total>12)
              {
                s='PM';
                total=(total)%12;
              }
              htmlCode =
                htmlCode +
                `
                <div class="row con">
                <h6 class="rcap">Enter Capacity</h6>
                <input type="number" class="rin" id="capacity" value=100></input>
                <h6 class="rdate">Date: ${request.to_char}</h6>
                <h6 class="rtime">Time: ${total}:00 ${s}</h6>
                <h6 class="rcount">Count-${request.count}</h6>
                <button type="button" class="racc" onclick='accept("${request.time}","${request.to_char}")'>accept</button>
                <button type="button" onclick='decline("${request.time}","${request.to_char}")'>decline</button>
                </div>
              `;
            });
            
            const container=document.querySelector("#requests")
            container.innerHTML=htmlCode;
            
          }
            }
            
});
