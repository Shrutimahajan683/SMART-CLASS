if(sessionStorage.getItem("role")!="student"&&sessionStorage.getItem("role")!="teacher")
      window.history.back()
     sessionStorage.removeItem("identity")
    const apiResult = sessionStorage.getItem("data");
    const result = apiResult.split(',')

    let htmlCode = ``;
    if (isNaN(result[0]))
    document.querySelector("#hometext").innerHTML="Subjects"
    else
    document.querySelector("#hometext").innerHTML="Classes"
    function call(data) {
      sessionStorage.setItem("identity", data);
      if (isNaN(data))
        window.location.href = "/course.html";
      else
        window.location.href = "/classes.html";
    }


    //rendering home page like classes/courses
    result.forEach(function (card) {
      htmlCode =
        htmlCode +
        `
        <div class="card1" style="width: 18rem;">
            <img class="card-img-top img-fluid thumbnailImage" onclick='call("${card}")' src="/img/books.png" alt="">
            <div class="card-body">
              <button type="button" class="books justify-content-center" onclick='call("${card}")'>${card}</button>
            </div>
        </div>
  `;
    });

    const cards = document.querySelector("#data");
    console.log(htmlCode)

    cards.innerHTML = htmlCode;