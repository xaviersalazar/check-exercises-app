/* TOP Level Imports*/
const electron = require('electron')
const path = require('path')
const $ = require('jquery')
const ScrollMagic = require('scrollmagic')
// const BrowserWindow = electron.remote.BrowserWindow
const Typed = require('typed.js')
const masterClassList = require('../assets/js/exercises_list.json')
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
    const exerciseURLs = [
        `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/`,
        `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/css/`,
        `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/js/`,
        `https://api.github.com/repos/${githubName}/codeup-java-exercises/contents/`,
    ]
     
        const exerciseRepos = await Promise.all(exerciseURLs.map(
            async url => {
                let response = await fetch(url)
                if(response.status == 200) {
                    return await response.json()
                }else{
                    showErrorMsg(response.statusText)
                }
            }
        ))
       const data = exerciseRepos.map( repo => repo.map( file => ({name: file.name, path: file.path}) ))
       console.log(data)
}


/*
**************
Business Logic
**************
*/

// Typed.js
const typed = () => {
    new Typed('#typed1', {
        strings: ['enter your github username'],
        typeSpeed: 75,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
    })
}

// ScrollMagic Scene
const scrollMagic = () => {
    // Main controller for ScrollMagic
    let controller = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave'
        }
    })

    // Get all panels
    let slides = document.querySelectorAll('.panel')

    // Add panels to the controller
    for (let slide of slides) {
        new ScrollMagic.Scene({
            triggerElement: slide
        })
        .setPin(slide)
        .addTo(controller)
    }
}

// Get our repo files
const getData = (githubName) => {
    // Return ajax response
    const getAjax = (url) => {
        return $.ajax(url)
    }

    const mainUrl = `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/`
    const cssUrl = `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/css/`
    const jsUrl = `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/js/`
    let files = []

    // Make sure we get the data first
    $.when(getAjax(mainUrl), getAjax(cssUrl), getAjax(jsUrl)).then((html, css, js) => {

        // Filter out files by .extension
        const filter = (arr, ext) => {
            arr.filter(item => {
                if (item.name.endsWith(ext))
                    files.push(item.name)
            })
        }

        filter(html[0], '.html')
        filter(css[0], '.css')
        filter(js[0], '.js')

        missing(files)
    })

    // Check for missing exercises
    const missing = (exercises) => {

        // Difference helper method
        Array.prototype.diff = function(a) {
            return this.filter(function(i) {return a.indexOf(i) < 0})
        }

        // Filter out files by extension
        const filter = (arr, newArr) => {
            const ext = ['.html', '.css', '.js', '.java', '.sql']
            for (let e of ext) {
                let temp = []
                arr.filter(item => {
                    if (item.endsWith(e))
                        temp.push(item)
                })
                newArr.push(temp)
            }
        }

        // Master array of all exercises from curriculum
        const allExercises = []//fetch data from JSON file

        // Find missing exercises
        const missing = allExercises.diff(exercises)

        // Show no missing files if not missing any, else show files
        if (missing.length === 0) {
            $('#get-repo').css('display', 'none')
            $('#no-missing').css('display', 'inline-block')
        } else {
            $('#get-repo').css('display', 'none')
            $('#missing').css('display', 'inline-block')

            const missingByExt = []
            filter(missing, missingByExt)
            showMissing(missingByExt)
        }
    }
}

// Show the missing exercises
const showMissing = (all) => {
    // Create the div
    const create = (arr, selector) => {
        for (let item of arr) {
            let div = (
                '<div class="col-6">' +
                '<h5 class="text-center">' + item + '</h5>' +
                '</div>'
            )
            selector.append(div)
        }
    }

    const rows = [$('#html'), $('#css'), $('#js'), $('#java'), $('#sql')]
    const selectors = [$('#html-row:last'), $('#css-row:last'), $('#js-row:last'), $('#java-row:last'), $('#sql-row:last')]

    // Only create div if you have missing items
    for (let ext of all) {
        if (ext.length === 0)
            rows[all.indexOf(ext)].remove()
        else
            create(ext, selectors[all.indexOf(ext)])
    }

    // Animations
    scrollMagic()
    $('#arrow').animate({
        opacity: 1
    }, 5000)
}

// Display and animate error message
function showErrorMsg(msg){
    
    const errorMessages = [
        {
            id: 1,
            message: "you didn't enter a github name",
            type: "empty"
        },
        {
            id: 2,
            message: "The Github user: "+ userNameInput.value + " does not appear to have a codeup-web-exercises repo. Check your username spelling.",
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

window.addEventListener("load", function() {
 /***************
Event Handlers
***************/
exercisesBtn.addEventListener('click', function() {
    if( userNameInput.value === '' ){
        showErrorMsg("empty")
    }else {
       // Attempt the ajax request
       getUserExercises(userNameInput.value)
    }
})

userNameInput.addEventListener("keyup", function(event) {
    if(event.key === "Enter"){   
        if (userNameInput.value === '') {
            showErrorMsg("empty")
        }
        else {
            // Attempt the ajax request
            getUserExercises(userNameInput.value)
        }
    }
})
// ********************************************************

    typed()


})