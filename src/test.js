const exercises = require('../assets/js/promise.json')


const data = exercises.map( repo => repo.map( file => ({name: file.name, path: file.path}) ))
    
console.log(data)
