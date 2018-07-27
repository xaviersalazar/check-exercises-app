/*
********************
Global DOM variables
********************
*/
const userNameInput = document.querySelector("#repo")
const errorMsgInput = document.querySelector("#errorMsg")
const exercisesBtn = document.querySelector('#check-exercises')

/*
***********************
DOM Animation Variables
***********************
*/
const frames = [
    {opacity: 0, easing: 'ease-in'},
    {opacity: 0.5, easing: 'ease-out'},
    {opacity: 1},
  ]
  
const options = {
    duration: 2500,
    iterations: 2,
    iterationStart: 0,
    iterationEnd: 0,
    direction: 'alternate',
    delay: 0,
    fill: 'forwards',
    easing: 'ease-in-out'
  }
/*
********************
API Helper Functions
********************
*/
async function getUserExercises(githubName) {
    try {
        const exerciseURLs = [
            `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/`,
            `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/css/`,
            `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/js/`,
            `https://api.github.com/repos/${githubName}/codeup-java-exercises/contents/`,
        ] 

       const jsonPromises = exerciseURLs.map(async url => {
           const response = await fetch(url)
           console.log(response.headers.get("X-RateLimit-Remaining"))
           return response.json()
       })

       console.log(jsonPromises)
    } catch (error) {
        showErrorMsg(error)
    }
}


// function getUserExercises(username) {
    


// // let files = []

// // // Make sure we get the data first
// // $.when(getAjax(mainUrl), getAjax(cssUrl), getAjax(jsUrl)).then((html, css, js) => {

// //     // Filter out files by .extension
// //     const filter = (arr, ext) => {
// //         arr.filter(item => {
// //             if (item.name.endsWith(ext))
// //                 files.push(item.name)
// //         })
// //     }

// //     filter(html[0], '.html')
// //     filter(css[0], '.css')
// //     filter(js[0], '.js')

// //     missing(files)
// // })

// // // Check for missing exercises
// // const missing = (exercises) => {

// //     // Difference helper method
// //     Array.prototype.diff = function(a) {
// //         return this.filter(function(i) {return a.indexOf(i) < 0})
// //     }

// //     // Filter out files by extension
// //     const filter = (arr, newArr) => {
// //         const ext = ['.html', '.css', '.js', '.java', '.sql']
// //         for (let e of ext) {
// //             let temp = []
// //             arr.filter(item => {
// //                 if (item.endsWith(e))
// //                     temp.push(item)
// //             })
// //             newArr.push(temp)
// //         }
// //     }


// //  Exercises are now in JSON file. exercises_list.json
// //     // Find missing exercises
// //     const missing = allExercises.diff(exercises)

// //     // Show no missing files if not missing any, else show files
// //     if (missing.length === 0) {
// //         $('#get-repo').css('display', 'none')
// //         $('#no-missing').css('display', 'inline-block')
// //     } else {
// //         $('#get-repo').css('display', 'none')
// //         $('#missing').css('display', 'inline-block')

// //         const missingByExt = []
// //         filter(missing, missingByExt)
// //         showMissing(missingByExt)
// //     }
// // }


//      })
//      .catch( error => {
//          showErrorMsg(error)
//      })
//  }

 function apiStatus(response) {
     if (response.status >= 200 && response.status < 300) {
         console.log(response.headers.get('X-RateLimit-Remaining'))
         return Promise.resolve(response)
     }else{
         return Promise.reject(response.statusText)
     }
 }

const responseToJSON = (response) => response.json()


 // Dynamically display error message
 function showErrorMsg(msg){
    const userName = $('#repo').val()
    const errorMessages = [
        {
            id: 1,
            message: "you didn't enter a github name",
            type: "empty"
        },
        {
            id: 2,
            message: "The Github user: "+ userName + " does not appear to have a codeup-web-exercises repo. Check your username spelling.",
            type: "Not Found"
        }
   ]
    errorMessages.map( errMsg => {
        if (msg === errMsg.type){
            errorMsgInput.innerHTML = errMsg.message
            errorMsgInput
                .animate(frames, options)
                .finished.then( () => {
                    errorMsgInput.animate(frames,options)
                })
        }
    })
}


/*
**************
Exercises List
**************
*/


/*
******************
DOM Event Handlers
******************
*/
exercisesBtn.addEventListener('click', function() {
    if( userNameInput.value === '' ){
        showErrorMsg("empty")
    }else {
        getUserExercises(userNameInput.value)
    }
})

userNameInput.addEventListener("keyup", function(event) {
    if(event.key === "Enter"){   
        if (userNameInput.value === '') {
            showErrorMsg("empty")
        }
        else {
            getUserExercises(userNameInput.value)
        }
    }
})


// $(document).ready(function () is deprecated in jQuery 3.x.x
$(function () {

   
})