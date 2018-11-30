const args = process.argv
const command = process.argv[2]
console.log('calling energy.js with args: ', args.slice(2))

const fs = require('fs')
const data = JSON.parse(fs.readFileSync('./plans.json', 'utf8'));
console.log('loading data: ', data)

console.log('getting keys...', data.forEach(item => console.log(Object.keys(item))))

const price = annualUsage => {

}

const usage = (supplierName, planNameSpend) => {

}

const exit = () => {}
//
// const funcDictionary = {
//   'price' : price,
//   'usage' : usage
//   'exit'  : exit
// }
