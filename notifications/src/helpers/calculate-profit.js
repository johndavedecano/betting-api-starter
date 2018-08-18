export default function(odd, amount) {
  // checks valid formats
  if (typeof odd !== 'number' || typeof amount !== 'number') {
    throw new Error('Invalid odd or amount format')
  }

  if (odd < 1 || amount < 1) {
    throw new Error('Odd or amount cannot be lesser than 1')
  }

  var percentage = (1 / odd) * 100

  return Number(((amount / 100) * percentage).toFixed(2))
}
