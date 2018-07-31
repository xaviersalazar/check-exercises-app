const exercises = require('../assets/js/promise.json')
const masterList = require('../assets/js/exercises_list.json')


// const jsFiles = masterList.map( cat => cat.files.filter(file => {
//     if(file.extension == '.js'){ return file}
// }))



const htmlFiles = exercises[0].filter( ({name}) => name.endsWith(".html")).map( file => file.name)
const cssFiles =  exercises[0].filter( ({name}) => name.endsWith(".css") ).map( file => file.name)
const jsFiles = exercises[0].filter( ({name}) => name.endsWith(".js")).map( file => file.name)

const allExercises = masterList.reduce( (acc,category) => 
    acc.concat(category.files.map(file => file.fileName.concat(file.extension))
), []) 


console.log(allExercises)
console.log(htmlFiles)

const difference = allExercises.filter(file => !htmlFiles.includes(file))
difference
// const htmlFiles = masterList
//     .filter( category => category.files
//         .some( file => file.extension == '.html'))
//     .map( category => {
//         let n = Object.assign({}, category, {'files': category.files.filter(
//             file => file.extension == ".html"
//         )})
//         return n
//     })

