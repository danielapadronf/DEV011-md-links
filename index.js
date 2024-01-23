const functions = require('./functions.js');
const init = async()=> {
  try {
    const result = await functions.mdLinks('docs/test/testing-md.md', {validate: true, stats:true});
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
 init()
