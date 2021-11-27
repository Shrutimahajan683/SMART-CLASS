if(sessionStorage.getItem("role")!="student")
window.history.back()
 const token=sessionStorage.getItem("token")
 const subject=sessionStorage.getItem("identity");
 const quizname=sessionStorage.getItem("quizname");
 let htmlCode=``;


//diplaying the right answers of the quiz
 fetch(`http://localhost:3000/quiz/viewquiz`, {
    method: "POST",
    body: JSON.stringify({
      token,
      subject,
      quizname
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
        let count=response.data.count;
        const obj=response.data.quiz;
        console.log(response)
        console.log(count);
        console.log(obj)
        for(let c=1;c<=count;c++){
  
  let ans='';
  if(obj[c].r=='1')
   ans=obj[c].o1;
   else if(obj[c].r=='2')
   ans=obj[c].o2;
   else if(obj[c].r=='3')
   ans=obj[c].o3;
   else
   ans=obj[c].o4;
  htmlCode =
    htmlCode +
    `
    <div class="viewquiz" >
        <h3>Q${c}: ${obj[c].ques}</h3>
            <div>
        <h6>Ans${c}: ${ans}<h6>
            </div>
    </div>
`;
}


const cards = document.querySelector("#data");
console.log(htmlCode)


cards.innerHTML = htmlCode;
})
        



