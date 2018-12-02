const args = process.argv
const command = process.argv[2]
console.log('calling energy.js with args: ', args.slice(2))

const fs = require('fs')
const plans = JSON.parse(fs.readFileSync('./plans.json', 'utf8'))
console.log('loading plans: ', plans)

// console.log('getting keys...', data.forEach(item => console.log(Object.keys(item))))

const VAT = 0.05
const DAYS_IN_YEAR = 365

// 1 PRICE ANNUAL_USAGE --------------------------------------------------------
// For a given annual kWh consumption
// produces an annual inclusive of VAT price for all plans available on the market
// sorted by cheapest first
// and prints to stdout.
// Each plan will be printed on its own line in the format SUPPLIER,PLAN,TOTAL_COST.
// Total cost should be rounded to 2 decimal places, i.e. pounds and pence.

350

200

250

const getPricesForAnnualUsage = function(annualUsage) {

  const getTotalForPlan = function(plan) {
    let total = 0
    let leftOver = annualUsage
    let lastThreshold = 0

    // sanitize the rate array - get array of prices sorted downward by thresholdVal,
    // with the top band at the end.
    const ratesSortedByThreshold = plan =>
      Array.from(plan.rates).sort((a, b) => {
      if (!a.threshold) return 1
      if (!b.threshold) return -1
      return b.threshold - a.threshold
    })

    const {total} = ratesSortedByThreshold.reduce((acc, rate, index) => {
      // are we in a threshold ?
      if (rate.threshold) {
        const amountAtThisThreshold = acc.lastThreshold - rate.threshold

      }


      if (ratesSortedByThreshold[index + 1].threshold) {
        const
      }
    }, {
      total: 0,
      lastThreshold: annualUsage
    })

    ratesSortedByThreshold.forEach((rate, index) => {




      if (leftOver > 0) {
        if (!rate.threshold) {
          total += leftOver * rate.price

        // usage gets into threshold
        } else if (leftOver <= rate.threshold) {
          total += leftOver * rate.price
          leftOver = 0

        } else {
          total += rate.threshold * rate.price
          leftOver -= rate.threshold
        }
      } else return
    })
  }

    // is there a standing charge?
    if (plan.standing_charge) {
      total += plan.standing_charge * DAYS_IN_YEAR
    }
  }
  // how many rates are there?

  //

  //


  plans.sort((planA, planB) => {

  })

// sort the array of options by cheapest first.


}
// 2 ---------------------------------------------------------------------------
// For the specified plan from a supplier calculates how much energy (in kWh) would be used
// annually from a monthly spend in pounds (inclusive of VAT)
// rounded to the nearest kWh and prints this value to stdout

const usage = (supplierName, planNameSpend) => {

}

// 3 ---------------------------------------------------------------------------

const exit = () => {}
//
// const funcDictionary = {
//   'price' : price,
//   'usage' : usage
//   'exit'  : exit
// }
