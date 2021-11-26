if(sessionStorage.getItem("role")!="teacher")
       window.history.back()
     const count=Number(sessionStorage.getItem("count"))
    const quizname = sessionStorage.getItem("nquiz");

    let htmlCode = ``;
    document.querySelector("#hometext").innerHTML=quizname
    let obj={};
    function call(data) {
         for(let c=1;c<=count;c++){
             inobj={}
             console.log("#i"+c);
             inobj.ques=document.querySelector("#i"+c).value;
             inobj.o1=document.querySelector("#o1"+c).value;
             inobj.o2=document.querySelector("#o2"+c).value;
             inobj.o3=document.querySelector("#o3"+c).value;
             inobj.o4=document.querySelector("#o4"+c).value;
             inobj.r=document.querySelector("#r"+c).value;
             obj[c]=inobj;
        }
        fetch(`http://localhost:3000/signin/createquiz`, {
      method: "POST",
      body: JSON.stringify({
        token:sessionStorage.getItem("token"),
        obj,
        count:count,
        quizname:quizname,
        sclass:sessionStorage.getItem("identity")
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
       window.location.href = "/quiz.html";
    }

    

    for(let c=1;c<=count;c++) {
      let input="i"+c;
      let op1="o1"+c;
      let op2="o2"+c;
      let op3="o3"+c;
      let op4="o4"+c;
      let ri="r"+c;

      htmlCode =
        htmlCode +
        `
        <div  class="quiz">
            <h6>Enter question with options<h6>
            <h6>Q${c}: </h6>
            <input type="text" class="ques" id="${input}">
            <div class="row">
            <h6 class="mt-3">1 : </h6> 
            <input type="text" class="option" id="${op1}">
            </div>
            <div class="row">
            <h6 class="mt-3">2: </h6> 
            <input type="text" class="option" id="${op2}">
            </div>
            <div class="row">
            <h6 class="mt-3">3: </h6> 
            <input type="text" class="option" id="${op3}">
            </div>
            <div class="row">
            <h6 class="mt-3">4: </h6> 
            <input type="text" class="option" id="${op4}">
            </div>
            <h6 class="mt-3">Enter correct option: </h6>
            <input type="number" class="option" placeholder="1" id="${ri}">
        </div>
  `;
    }
    htmlCode =htmlCode+
        `
        <button type="Submit" class="qsubmit" onclick='call()'>Submit</button>
  `;
    const cards = document.querySelector("#data");
    console.log(htmlCode)

    cards.innerHTML = htmlCode;