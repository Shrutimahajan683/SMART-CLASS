if(sessionStorage.getItem("role")!="student"&&sessionStorage.getItem("role")!="teacher")
window.history.back()
  let parent=``;
 const id=sessionStorage.getItem("topic");
 //fetcing posts for discussion
 fetch(`http://localhost:3000/discussion/fetchposts`, {
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
      console.log(response)
      const result=response.data;
     let htmlCode=``;
      if(result.length==0)
      {
        document.querySelector("#allposts").innerHTML="NO POST"
       let  htmlCode =
  `
  <div class="card1 empty pt" style="width: 18rem;">
      <img class="card-img-top img-fluid thumbnailImage " src="/img/empty.png" alt="">
  </div>
`;
const container=document.querySelector("#data")
      container.innerHTML=htmlCode;
      }
      else{
//displaying all the posts
      for(let c=0;c<result.length;c++) {
htmlCode =
  htmlCode +
  `
  <div class="posts">
      <div class="row bottom">
                  <h6 class="timestamp create">
                       ${result[c].author}
                  </h6>
                  <p class="createpost">
                      Created at: ${result[c].created_at}
                  </p>
              </div>
              <h6 class="parentpost">${result[c].parent}<h6>
              <h6 class="descpost">
                  ${result[c].description}
              </h6>
              <button style="font-size:12px" class="reply" onclick='place("${result[c].author}","${result[c].description}","#topic")' >Reply<i class="fa fa-mail-reply"></i></button>
  </div>
`;
}
const cards = document.querySelector("#data");
cards.innerHTML=htmlCode
      }
  })

  function place(author,description,url){
      document.getElementById("tdesc").innerHTML=`<h6>${author} - ${description}<h6>`
       parent=`${author} - ${description}`;
        document.getElementById("topic").scrollIntoView();
  }

  //submitting posts
  function call(){
      fetch(`http://localhost:3000/discussion/submitposts`, {
  method: "POST",
  body: JSON.stringify({
   topic_id:id,
   role:sessionStorage.getItem("role"),
   token:sessionStorage.getItem("token"),
   description:document.querySelector("#description").value.replace(/'/g,''),
   parent
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
      window.location.href = "/posts.html";
  })
  }