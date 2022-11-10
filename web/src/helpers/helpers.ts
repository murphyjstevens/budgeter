export function toCurrency (value: number): string {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  return formatter.format(value)
}

export function toShortDate(value: Date, format: string = 'MM/dd/yyyy'): string {
  if (!(value instanceof Date) || !format) {
    return value.toString()
  }

  const monthString = padZeros(value.getMonth()+1, 2)
  const dayString = padZeros(value.getDate(), 2)
  const yearString = padZeros(value.getFullYear(), 4)

  let result = format 
  result = result.replace('MM', monthString)
  result = result.replace('dd', dayString)
  result = result.replace('yyyy', yearString)
  return result
}

function padZeros (value: number, numberOfDigits: number): string {
  if (value === null || value === undefined || isNaN(value) || !numberOfDigits) return ''

  const valueString = value.toString()
  const characterCount = valueString.length

  if (numberOfDigits < characterCount) return ''
  const zeroString = '0'.repeat(numberOfDigits - characterCount)

  return zeroString + valueString
}

export function getMonthString (month: number): string {
  if ((!month && month !== 0) || month < 0 || month > 11) {
    console.error(`Month is not valid: ${month ?? 'null'}`)
    return ''
  }
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return monthNames[month]
}

export function datesAreSameMonth (date: Date, date2: Date) {
  if (!date || !date2) return false

  return date.getMonth() === date2.getMonth()
    && date.getFullYear() === date2.getFullYear()
}