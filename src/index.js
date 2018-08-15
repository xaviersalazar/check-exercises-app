/* TOP Level Imports*/
const electron = require('electron')
const path = require('path')
const $ = require('jquery')
const ScrollMagic = require('scrollmagic')
// const BrowserWindow = electron.remote.BrowserWindow
const Typed = require('typed.js')
const masterList = require('../assets/js/exercises_list.json')
/*
********************
Global DOM variables
********************
*/
const userNameInput = document.querySelector("#repo")
const passwordInput = document.querySelector('#pass')
const showPassword = document.querySelector('#show')
const errorMsgInput = document.querySelector("#errorMsg")
const exercisesBtn = document.querySelector('#check-exercises')
/*
***********************
DOM Animation Variables
***********************
*/
const frames = [{
    opacity: 0,
    easing: 'ease-in'
},
{
    opacity: 0.5,
    easing: 'ease-out'
},
{
    opacity: 1
},
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
async function getUserExercises(githubName, githubPassword) {
    const auth = 'Basic ' + new Buffer(githubName + ':' + githubPassword).toString('base64')
    const exerciseURLs = [
        `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/`,
        `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/css/`,
        `https://api.github.com/repos/${githubName}/codeup-web-exercises/contents/js/`,
        `https://api.github.com/repos/${githubName}/codeup-java-exercises/contents/src/`,
        `https://api.github.com/repos/${githubName}/codeup-java-exercises/contents/src/shapes/`,
        `https://api.github.com/repos/${githubName}/codeup-java-exercises/contents/src/movies/`,
        `https://api.github.com/repos/${githubName}/codeup-java-exercises/contents/src/util/`,
        `https://api.github.com/repos/${githubName}/codeup-java-exercises/contents/src/grades/`,
        `https://api.github.com/repos/${githubName}/database-exercises/contents/`
    ]

    const exerciseRepos = await Promise.all(exerciseURLs.map(async url => {
        let response = await fetch(url, {
            headers: {
                'Authorization': auth,
                'User-Agent': 'check-exercises-app'
            }
        })
            if (response.status == 200) {
                return await response.json()
            } else {
                showErrorMsg(response.statusText)
            }
        }
    ))

    // Filter out files by .extension
    const htmlFiles = exerciseRepos[0].filter(({ name }) => name.endsWith(".html")).map(file => file.name)
    const cssFiles = exerciseRepos[1].filter(({ name }) => name.endsWith(".css")).map(file => file.name)
    const jsFiles = exerciseRepos[2].filter(({ name }) => name.endsWith(".js")).map(file => file.name)
    const javaFilesSrc = exerciseRepos[3].filter(({ name }) => name.endsWith(".java")).map(file => file.name)
    const javaFilesShapes = exerciseRepos[4].filter(({ name }) => name.endsWith(".java")).map(file => file.name)
    const javaFilesMovies = exerciseRepos[5].filter(({ name }) => name.endsWith(".java")).map(file => file.name)
    const javaFilesUtil = exerciseRepos[6].filter(({ name }) => name.endsWith(".java")).map(file => file.name)
    const javaFilesGrades = exerciseRepos[7].filter(({ name }) => name.endsWith(".java")).map(file => file.name)
    const sqlFiles = exerciseRepos[8].filter(({ name }) => name.endsWith(".sql")).map(file => file.name)

    const allFiles = htmlFiles.concat(cssFiles, jsFiles, javaFilesSrc, javaFilesShapes, javaFilesMovies, javaFilesUtil, javaFilesGrades, sqlFiles)

    // Show the missing exercises
    getMissingExercises(allFiles)
}



/*
**************
Business Logic
**************
*/

function getMissingExercises(exercisesArr) {

    // Difference helper method
    Array.prototype.diff = function (a) {
        return this.filter(function (i) {
            return a.indexOf(i) < 0
        })
    }

    // Filter out files by extension
    const filterFiles = (arr, newArr) => {
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
    const allExercises = masterList.reduce((acc, category) =>
        acc.concat(category.files.map(file =>
            file.fileName.concat(file.extension))), [])

    // Find missing exercises using ES7 
    // https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript
    const missingExercises = allExercises.filter(file => !exercisesArr.includes(file))

    // Show no missing files if not missing any, else show files
    
    if (missingExercises.length === 0) {
        document.getElementById('get-repo').style.display = "none"
        document.getElementById('no-missing').style.display = "inline-block"
    } else {
        document.getElementById('get-repo').style.display = "none"
        document.getElementById('missing').style.display = "inline-block"

        const missingByExt = []
        filterFiles(missingExercises, missingByExt)
        displayMissingExercises(missingByExt)
    }
}

function displayMissingExercises(files){
    
    // Create the div
        const createExercise = (arr, selector) => {
            for (let item of arr) {
                let exerciseHtml = (
                    '<div class="col-6">' +
                    '<h5 class="text-center">' + item + '</h5>' +
                    '</div>'
                )
                selector.append(exerciseHtml)
            }
        }

        const rows = [$('#html'), $('#css'), $('#js'), $('#java'), $('#sql')]
        const selectors = [$('#html-row:last'), $('#css-row:last'), $('#js-row:last'), $('#java-row:last'), $('#sql-row:last')]

    // Only create div if you have missing items
        for (let ext of files) {
            if (ext.length === 0)
                rows[files.indexOf(ext)].remove()
            else
                createExercise(ext, selectors[files.indexOf(ext)])
        }

        // Animations
        scrollMagic()
        document.getElementById('arrow').animate({ opacity: 1}, 5000)
}

// Typed.js
const typed = () => {
    new Typed('#typed1', {
        strings: ['enter your github username and password'],
        typeSpeed: 75,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
    })
}

// ScrollMagic Scene
function scrollMagic() {
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


// Display and animate error message
function showErrorMsg(msg) {

    const errorMessages = [{
        id: 1,
        message: "you didn't enter a github name",
        type: "empty username"
    },
    {
        id: 2,
        message: "you didn't enter a password",
        type: "empty password"
    },
    {
        id: 3,
        message: "the github user: " + userNameInput.value + " does not appear to have a codeup-web-exercises repo. check your username spelling",
        type: "Not Found"
    },
    {
        id: 4,
        message: "the password you entered is incorrect. please enter your correct github password",
        type: "Unauthorized"
    }
    ]
    errorMessages.map(errMsg => {
        if (msg === errMsg.type) {
            errorMsgInput.innerHTML = errMsg.message
            errorMsgInput
                .animate(frames, options)
                .finished.then(() => {
                    errorMsgInput.animate(frames, options)
                })
        }
    })
}

window.addEventListener("load", function () {
    /***************
    Event Handlers
    ***************/
    showPassword.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text'
            showPassword.classList.remove('fa-eye')
            showPassword.classList.add('fa-eye-slash')
        } else {
            passwordInput.type = 'password'
            showPassword.classList.remove('fa-eye-slash')
            showPassword.classList.add('fa-eye')
        }
    })

    exercisesBtn.addEventListener('click', function () {
        if (userNameInput.value === '') {
            showErrorMsg("empty username")
        } else if (passwordInput.value === '') {
            showErrorMsg("empty password")
        } else {
            // Attempt the ajax request
            getUserExercises(userNameInput.value, passwordInput.value)
        }
    })

    userNameInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            if (userNameInput.value === '') {
                showErrorMsg("empty username")
            } else if (passwordInput.value === '') {
                showErrorMsg("empty password")
            } else {
                // Attempt the ajax request
                getUserExercises(userNameInput.value, passwordInput.value)
            }
        }
    })
    // ********************************************************

    typed()


})