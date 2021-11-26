if(sessionStorage.getItem("role")!="student"&&sessionStorage.getItem("role")!="teacher")
      window.history.back()
      sessionStorage.removeItem("topic")
      function store(id){
          sessionStorage.setItem("topic",id);
      }
      const role=sessionStorage.getItem("role");
      let sclass=0;
      if(role=="teacher")
      sclass=sessionStorage.getItem("identity");
    fetch(`http://localhost:3000/discussion/fetchtopics`, {
        method: "POST",
        body: JSON.stringify({
          token:sessionStorage.getItem("token"),
          role,
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
            let htmlCode=``;
            const result=response.data;
            if(result.length==0)
            {
              document.querySelector("#top").innerHTML="NO TOPIC"
             let  htmlCode =
        `
        <div class="card1 empty" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage" src="/img/empty.png" alt="">
        </div>
  `;
  const container=document.querySelector("#data1")
            container.innerHTML=htmlCode;
            }
            else{
            for(let c=0;c<result.length;c++) {
      htmlCode =
        htmlCode +
        `
        <li class="row dis">
                <a href="posts.html" onclick='store("${result[c].id}")'>
                    <h4 class="title">
                     ${result[c].title}
                    </h4>
                    <h6 class="title">
                        ${result[c].description}
                    </h6>
                    <div class="bottom">
                        <p class="timestamp create">
                            Author: ${result[c].author}
                        </p>
                        <p class="comment-count">
                            Created at: ${result[c].created_at}
                        </p>
                    </div>
                </a>
        </li>
  `;
    }
    const cards = document.querySelector("#data1");
    cards.innerHTML=htmlCode
            }
        })
      function call(){
        if(!document.querySelector("#title").value)
        {
            alert("Enter Title");
            return;
        }
        fetch(`http://localhost:3000/discussion/submittopic`, {
        method: "POST",
        body: JSON.stringify({
          title:document.querySelector("#title").value.replace(/'/g,''),
          description:document.querySelector("#description").value.replace(/'/g,''),
          token:sessionStorage.getItem("token"),
          role,
          sclass:sessionStorage.getItem("identity")
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
            console.log(response)
});
    
          alert("Topic Submitted");
          window.location.href = "/discussion.html";
      }