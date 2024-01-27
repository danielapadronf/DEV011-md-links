const functions = require('./functions.js');
const mdLinks = ()=> {
  try {
    const result = functions.mdLinks('docs/test/testing-md.md', {validate: true, stats:true});
    console.log(result)
  } catch (error) {
  }
}
 mdLinks()
