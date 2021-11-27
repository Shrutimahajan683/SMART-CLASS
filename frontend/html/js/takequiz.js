if(sessionStorage.getItem("role")!="student")
    window.history.back()
      let total=0;
      const token=sessionStorage.getItem("token")
     const subject=sessionStorage.getItem("identity");
     const quizname=sessionStorage.getItem("quizname");
      function call(){
          let result={};
         
            for(let c=1;c<=total;c++){
                let rname="r"+c;
                var rates = document.getElementsByName(rname);
                for(var i = 0; i < rates.length; i++){
            if(rates[i].checked){
        {
            result[c]=i+1;
            break;
        }
    }
}

//getting practice quiz result (output) and displaying it
fetch(`http://localhost:3000/quiz/quizresult`, {
        method: "POST",
        body: JSON.stringify({
          token,
          subject,
          quizname,
          result
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
         let htmlcode=`<div class="stext" >
          Your score is- ${response.result} out of ${total}
        </div>`;
          htmlcode=htmlcode+`
        <div class="card1 sc" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage"  src="/img/yay.png" alt="">
        </div>
  `
            document.querySelector("#data").innerHTML=htmlcode;
            })
            
    }
}


//fetching the quiz from backend by sending data
     fetch(`http://localhost:3000/quiz/takequiz`, {
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
            let htmlCode = ``;
           let  result=response.data;
           let count=result.count;
           total=count;
           let obj=result.quiz;
            for(let c=1;c<=count;c++) {
                let rname="r"+c;
            htmlCode =
        htmlCode +
        `
        <div >
        <div class="takequiz">
            <div >
              <h6>Q${c}: ${obj[c].ques}</h6>
            </div>
            <form>
            <div class="rtake">
             <label class="radio-inline" >
             <input type="radio" name="${rname}" id="${rname}"  class="takeoption">${obj[c].o1}
              </label>
            </div>
              <div class="rtake">
              <label class="radio-inline">
               <input type="radio" name="${rname}" id="${rname}" class="takeoption" >${obj[c].o2}
              </label>
            </div>
              <div class="rtake">
             <label class="radio-inline">
            <input type="radio" name="${rname}" id="${rname}" class="takeoption" >${obj[c].o3}
            </label>
        </div>
            <div class="rtake">
            <label class="radio-inline">
            <input type="radio" name="${rname}" id="${rname}" class="takeoption" >${obj[c].o4}
            </label>
        </div>
            </form>
        </div>
        </div >
  `;
    }
    htmlCode =htmlCode+
        `
        <button type="Submit" class="qsubmit" onclick='call()' >Submit</button>
  `;
    
    const cards = document.querySelector("#data");
    console.log(htmlCode)

    
    cards.innerHTML = htmlCode;
            
});

  