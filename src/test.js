const exercises = require('../assets/js/promise.json')
const masterList = require('../assets/js/exercises_list.json')
const elements = require('../assets/js/test.json')


// const jsFiles = masterList.map( cat => cat.files.filter(file => {
//     if(file.extension == '.js'){ return file}
// }))



const htmlFiles = exercises[0].filter( ({name}) => name.endsWith(".html")).map( file => file.name)
const cssFiles =  exercises[0].filter( ({name}) => name.endsWith(".css") ).map( file => file.name)
const jsFiles = exercises[0].filter( ({name}) => name.endsWith(".js")).map( file => file.name)

htmlFiles//?
cssFiles//?
jsFiles//?
// const htmlFiles = masterList
//     .filter( category => category.files
//         .some( file => file.extension == '.html'))
//     .map( category => {
//         let n = Object.assign({}, category, {'files': category.files.filter(
//             file => file.extension == ".html"
//         )})
//         return n
//     })

