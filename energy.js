const args = process.argv
const command = process.argv[2]
console.log('calling energy.js with args: ', args.slice(2))

const fs = require('fs')
const plans = JSON.parse(fs.readFileSync('./plans.json', 'utf8'))
// console.log('loading plans: ', plans)


const VAT_MULTIPLIER = 1.05
const DAYS_IN_YEAR   = 365
const MONTHS_IN_YEAR = 12

// 1 PRICE ANNUAL_USAGE --------------------------------------------------------
// For a given annual kWh consumption
// produces an annual inclusive of VAT price for all plans available on the market
// sorted by cheapest first
// and prints to stdout.
// Each plan will be printed on its own line in the format SUPPLIER,PLAN,TOTAL_COST.
// Total cost should be rounded to 2 decimal places, i.e. pounds and pence.

// sanitize the rate array - get array of prices sorted ascending by thresholdVal,
// with the top (thresholdless) band at the end.
const ratesSortedByThreshold = plan =>
  Array.from(plan.rates).sort((a, b) => {
    if (!a.threshold) return 1
    if (!b.threshold) return -1
    return a.threshold - b.threshold
  })


const getPricesForAnnualUsage = annualUsage => {

  const getTotalForPlan = plan => {

    let {total} = ratesSortedByThreshold(plan).reduce((accumulator, rate) => {

      let {total, remainingUsage} = accumulator

      // we only need to limit the amount we apply if there is a threshold
      // and there is enough remaining usage to cross this threshold.
      const usageAtThisRate = rate.threshold && remainingUsage > rate.threshold
      ? rate.threshold
      : remainingUsage

      const costAtThisRate = usageAtThisRate * rate.price

      total += costAtThisRate
      remainingUsage -= usageAtThisRate

      return { total, remainingUsage }

    },
      {
        // accumulator start val
        total: 0,
        remainingUsage: annualUsage
      }
    )

    // is there a standing charge?
    if (plan.standing_charge) {
      total += plan.standing_charge * DAYS_IN_YEAR
    }

    // apply VAT
    total = total * VAT_MULTIPLIER

    return total / 100 // convert pence to £
  }

  const plansWithTotals = plans
    .map(plan => Object.assign(plan, {total: getTotalForPlan(plan)}))  // add totals
    .sort((a, b) => a.total - b.total)                                      // sort by total
    .map(plan => {
      // round to 2dp
      plan.total = Math.round(plan.total * 100) / 100
      return plan
    })

  plansWithTotals.forEach(plan => {
    console.log(`${plan.supplier}, ${plan.plan}, ${plan.total}`)
  })

}

//
// getPricesForAnnualUsage(1000)


// 2 ---------------------------------------------------------------------------
// For the specified plan from a supplier calculates how much energy (in kWh) would be used
// annually from a monthly spend in pounds (inclusive of VAT)
// rounded to the nearest kWh and prints this value to stdout

const usage = (supplierName, planName, spend) => {

  const plan = plans.find(plan => plan.supplier === supplierName && plan.plan === planName)
  if (!plan) return console.error("no plan with those arguments found in the data provided.")

  const spendInPence = spend * 100 * MONTHS_IN_YEAR

  // if there's a standing charge we take it off first.
  const startingPence = plan.standing_charge
    ? spendInPence - plan.standing_charge * DAYS_IN_YEAR * VAT_MULTIPLIER
    : spendInPence

  // console.log('startingPence', startingPence)

  const {usage} = ratesSortedByThreshold(plan).reduce((accumulator, rate) => {

    let {usage, spendLeft} = accumulator

    const priceIncVAT = rate.price * VAT_MULTIPLIER

    const usageLeftAtThisRate = spendLeft / priceIncVAT
    
    console.log('rate.threshold', rate.threshold)
    console.log('spendLeft', spendLeft, 'priceIncVAT', priceIncVAT)
    console.log('usageLeftAtThisRate', usageLeftAtThisRate)

    // do we cross a threshold with this amount of usage ?
    if (rate.threshold && usageLeftAtThisRate >= rate.threshold) {
      accumulator.usage += rate.threshold
      spendLeft -= rate.threshold * priceIncVAT
    }

    else {
      accumulator.usage += usageLeftAtThisRate
    }

    return accumulator
  },
    {
      usage: 0,
      spendLeft: startingPence
    }
  )

  console.log('usage is: ', Math.round(usage))

  return Math.round(usage)
}

console.log('usage edf fixed 350')
usage('edf', 'fixed', 350)
//
// console.log('usage ovo standard 1000')
// usage('ovo', 'standard', '1000')
//
// console.log('usage bg standing-charge 120')
// usage('bg', 'standing-charge', 120)
// 3 ---------------------------------------------------------------------------

// const exit = () => {}
//
// const funcDictionary = {
//   'price' : price,
//   'usage' : usage
//   'exit'  : exit
// }
