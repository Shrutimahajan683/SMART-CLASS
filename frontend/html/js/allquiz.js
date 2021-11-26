if(sessionStorage.getItem("role")!="student")
  window.history.back()
const token=sessionStorage.getItem("token");
const subject=sessionStorage.getItem("identity");
function take(data){
    sessionStorage.setItem("quizname",data)
    window.location.href = "/takequiz.html";
}

function view(data){
    sessionStorage.setItem("quizname",data)
    window.location.href = "/viewquiz.html";
}

 fetch(`http://localhost:3000/signin/getquiz`, {
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
                document.querySelector("#substyle").innerHTML="NO PRACTICE QUIZ"
             let  htmlCode =
        `
        <div class="card1 empty" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
        </div>
  `;
  const container=document.querySelector("#quizes")
            container.innerHTML=htmlCode;
            }
            else{
              requests.forEach(function(request) {
              htmlCode =
                htmlCode +
                `
                <div class="row con">
                <h6 class="rdate">Quiz name : ${request}</h6>
                <button type="button" class="racc" onclick='take("${request}")'>Take Quiz<button>
                <button type="button" onclick='view("${request}")'>View Correct Answers<button>
                </div>
              `;
            });
            
            const container=document.querySelector("#quizes")
            container.innerHTML=htmlCode;
            
          }
            }
            
});
