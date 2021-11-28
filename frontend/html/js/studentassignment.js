if(sessionStorage.getItem("role")!="student")
      window.history.back()
         sessionStorage.removeItem("assignment");
        function call(data){
            sessionStorage.setItem("assignment",data);
        }
        const token=sessionStorage.getItem("token");
        const subject=sessionStorage.getItem("identity")
  
  //fetching assignments for student
        fetch(`http://localhost:3000/anotherfeature/studentassignment`, {
  method: "POST",
  body: JSON.stringify({
    token,
    subject
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
      if(result.length==0)
            {
              document.querySelector("#hometext1").innerHTML="NO PENDING ASSIGNMENT"
             let  htmlCode =
        `
        <div class="card1" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
        </div>
  `;
  const container=document.querySelector("#data")
            container.innerHTML=htmlCode;
            }
      else{
      for(let c=0;c<result.length;c++) {
  //displaying assignments for students
      htmlCode =
        htmlCode +
        
        `
                <div class="row subm justify-content-center mt-6">
                <h6 class="apath">Name- ${result[c].assignmentname}</h6>
                <a href="/submitassignment.html" onclick='call("${result[c].id}")' class="apath">Submit Assignment</a>
                </div>
              `;
    }

    
    const cards = document.querySelector("#data");
    console.log(htmlCode)

    cards.innerHTML = htmlCode;
  }
  });

  fetch(`http://localhost:3000/anotherfeature/studentsubmittedassignment`, {
  method: "POST",
  body: JSON.stringify({
    token,
    subject
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
      const result=response.data;
      let htmlcode=``;
      if(result.length==0)
            {
              document.querySelector("#hometext2").innerHTML="NO ASSIGNMENT"
             let  htmlCode =
        `
        <div class="card1" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
        </div>
  `;
  const container=document.querySelector("#submitassignment")
            container.innerHTML=htmlCode;
            }
      else{
      for(let c=0;c<result.length;c++) {
      htmlcode =
        htmlcode +
        
        `
                <div class="row subm justify-content-center mt-6">
                  <h6 class="apath">Name- ${result[c].assignmentname}</h6>
                <a href="${result[c].filepath}" class="apath">Submitted Assignment</a>
                <a href="${result[c].assignmentpath}" class="apath">Assignment</a>
                <h6 class="apath">Marks- ${result[c].marks}</h6>
                </div>
              `;
    }

    
    const cards = document.querySelector("#submitassignment");
    console.log(htmlcode)

    cards.innerHTML = htmlcode;
  }
  });