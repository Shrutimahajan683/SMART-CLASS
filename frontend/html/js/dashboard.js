if(sessionStorage.getItem("role")!="admin")
  window.history.back()
    function studentaccept(data){
        fetch(`http://localhost:3000/signin/studentaccept`, {
      method: "POST",
      body: JSON.stringify({
        data
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
        window.location.href = "/dashboard.html";
      });
    }
    
    function studentdecline(data){
        fetch(`http://localhost:3000/signin/studentdecline`, {
      method: "POST",
      body: JSON.stringify({
        data
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
        window.location.href = "/dashboard.html";
      });
    }

    function teacheraccept(data){
        fetch(`http://localhost:3000/signin/teacheraccept`, {
      method: "POST",
      body: JSON.stringify({
        data
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
        window.location.href = "/dashboard.html";
      });
    }

    function teacherdecline(data){
        fetch(`http://localhost:3000/signin/teacherdecline`, {
      method: "POST",
      body: JSON.stringify({
        data
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
        window.location.href = "/dashboard.html";
      });
    }

    fetch(`http://localhost:3000/signin/studentrequests`)
        .then(response => {
          return response.json()
        })
        .then(response => {
            let htmlCode=``;
            if(response.data.length==0)
            {
              htmlCode =htmlCode+
        `
        <div class="card1 empty" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
        </div>
  `;
  const container=document.querySelector("#srequests")
  console.log(htmlCode)
            container.innerHTML=htmlCode;
            }
            else{
                for(let c=0;c<response.data.length;c++) {
              htmlCode =
                htmlCode +
                `
                <div class="row con justify-content-center">
                <h6 class="name">Name- ${response.data[c].full_name}</h6>
                <h6 class="username">Username- ${response.data[c].username}</h6>
                <h6 class="rollno">Roll No-${response.data[c].rollno}</h6>
                <h6 class="sclass">Class-${response.data[c].sclass}</h6>
                <button type="button" class="racc" onclick='studentaccept("${response.data[c].username}")'>accept<button>
                <button type="button" onclick='studentdecline("${response.data[c].username}")'>decline<button>
                </div>
              `;
            }
            console.log(htmlCode)
          document.querySelector("#srequests").innerHTML=htmlCode
            }
});
fetch(`http://localhost:3000/signin/teacherrequests`)
        .then(response => {
          return response.json()
        })
        .then(response => {
           let  htmlCode=``;
           if(response.data.length==0)
            {
              htmlCode =htmlCode+
        `
        <div class="card1 empty" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
        </div>
  `;
  const container=document.querySelector("#trequests")
  console.log(htmlCode)
            container.innerHTML=htmlCode;
            }
            else{
                for(let c=0;c<response.data.length;c++) {
              htmlCode =
                htmlCode +
                `
                <div class="row con justify-content-center">
                <h6 class="name">Name- ${response.data[c].full_name}</h6>
                <h6 class="username">Username- ${response.data[c].username}</h6>
                <h6 class="subject">Subject-${response.data[c].subject}</h6>
                <h6 class="classlist">Classes-${response.data[c].classlist}</h6>
                <button type="button" class="racc" onclick='teacheraccept("${response.data[c].username}")'>accept<button>
                <button type="button" onclick='teacherdecline("${response.data[c].username}")'>decline<button>
                </div>
              `;
            }
            console.log(htmlCode)
          document.querySelector("#trequests").innerHTML=htmlCode
            }
            
});


//  fetch(`http://localhost:3000/signin/studentrequests`, {
//         method: "POST",
//         body: JSON.stringify({
//           token,
//           sclass
//         }),
//         headers: {
//           "Content-type": "application/json; charset=UTF-8",
//           'Accept': 'application/json'
//         }
//       })
//         .then(response => {
//             console.log("hey")
//           return response.json()
//         })
//         .then(response => {
//           if(response.Status==true)
//           {
//             document.querySelector("#substyle").innerHTML="NO REQUESTS"
//             let htmlCode = ``;
//             const requests=response.data;
//             if(requests.length==0)
//             {
//              let  htmlCode =
//         `
//         <div class="card1 empty" style="width: 18rem;">
//             <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
//         </div>
//   `;
//   const container=document.querySelector("#requests")
//             container.innerHTML=htmlCode;
//             }
//             else{
//               requests.forEach(function(request) {
//               let timeconverted=request.time;
//               let s='AM';
//               let t1=Number(timeconverted[0]);
//               let t2=Number(timeconverted[1]);
//               let total=t1*10+t2;
//               if(total>12)
//               {
//                 s='PM';
//                 total=(total)%12;
//               }
//               htmlCode =
//                 htmlCode +
//                 `
//                 <div class="row con">
//                 <h6 class="rcap">Enter Capacity</h6>
//                 <input type="number" class="rin" id="capacity" value=100></input>
//                 <h6 class="rdate">Date: ${request.to_char}</h6>
//                 <h6 class="rtime">Time: ${total}:00 ${s}</h6>
//                 <h6 class="rcount">Count-${request.count}</h6>
//                 <button type="button" class="racc" onclick='accept("${request.time}","${request.to_char}")'>accept<button>
//                 <button type="button" onclick='decline("${request.time}","${request.to_char}")'>decline<button>
//                 </div>
//               `;
//             });
            
//             const container=document.querySelector("#requests")
//             container.innerHTML=htmlCode;
            
//           }
//             }
            
// });