export const filters = {
  toCurrency (value) {
    if (typeof value !== 'number') {
      return value
    }
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
    return formatter.format(value)
  },

  toShortDate (value) {
    if (!(value instanceof Date)) {
      return value
    }

    const monthString = this.padZeros(value.getMonth(), 2)
    const dayString = this.padZeros(value.getDate(), 2)
    const yearString = this.padZeros(value.getFullYear(), 4)

    return `${monthString}/${dayString}/${yearString}`
  },

  padZeros (value, numberOfDigits) {
    if (value === null || value === undefined || isNaN(value) || !numberOfDigits) return

    const valueString = value.toString()
    const characterCount = valueString.length

    if (numberOfDigits < characterCount) return
    const zeroString = '0'.repeat(numberOfDigits - characterCount)

    return zeroString + valueString
  }
}