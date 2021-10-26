import { CurrencyPipe } from '@angular/common'
import { Directive, HostListener, ElementRef, OnInit } from '@angular/core'

@Directive({ selector: '[currencyFormatter]' })
export class CurrencyFormatterDirective implements OnInit {
  private el: HTMLInputElement;

  constructor (
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement
  }

  ngOnInit () {
    this.el.value = this.currencyPipe.transform(this.el.value) ?? ''
  }

  @HostListener('focus', ['$event.target.value'])
  onFocus (value: any) {
    this.el.value = Number.parseFloat(value)?.toString()
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur (value: any) {
    this.el.value = this.currencyPipe.transform(value) ?? ''
  }
}
