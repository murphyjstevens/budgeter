import { Pipe, PipeTransform } from '@angular/core'

const PADDING = '000000'
const DECIMAL_SEPARATOR = '.'
const THOUSANDS_SEPARATOR = ','

@Pipe({ name: 'currency' })
export class CurrencyPipe implements PipeTransform {
  transform (value: number | string, fractionSize: number = 2): string {
    let [integer, fraction = ''] = (value || '').toString()
      .split(DECIMAL_SEPARATOR)

    fraction = fractionSize > 0
      ? DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : ''

    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR)

    return integer + fraction
  }

  parse (value: string, fractionSize: number = 2): string {
    let [integer, fraction = ''] = (value || '').split(DECIMAL_SEPARATOR)

    integer = integer.replace(new RegExp(THOUSANDS_SEPARATOR, 'g'), '')

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : ''

    return integer + fraction
  }
}
