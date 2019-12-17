import {Directive, ElementRef, HostListener} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Directive({
  selector: '[ngxPrettyNumber]'
})
export class PrettyNumberDirective {

  acceptedKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'Backspace', 'ArrowLeft', 'ArrowRight'];
  navigationKeys = ['Backspace', 'ArrowLeft', 'ArrowRight'];

  constructor(private el: ElementRef, private num: DecimalPipe) {
  }

  @HostListener('keyup', ['$event']) onKeyup() {
    let inputValue: string = this.el.nativeElement.value;
    const cursorPosition = this.el.nativeElement.selectionStart;
    inputValue = inputValue.replace(/,/g, '');
    if (inputValue.includes('.')) {
      const splitValue = inputValue.split('.');
      splitValue[0] = this.num.transform(+splitValue[0]); // Format with commas the value before decimal
      if (splitValue[1] === '') { // Value after dot is empty, consider only the value before dot
        this.el.nativeElement.value = splitValue[0].concat('.00');
      } else {
        this.el.nativeElement.value = splitValue.join('.');
      }
      // Maintaining cursor position
      this.el.nativeElement.setSelectionRange(cursorPosition, cursorPosition);
    } else {
      if (inputValue !== '') {
        // Append '.00' if user enter something like $1 to show $1.00
        this.el.nativeElement.value = this.num.transform(+inputValue).concat('.00');
        this.el.nativeElement.setSelectionRange(cursorPosition, cursorPosition); // Maintaining cursor position
      }
    }
  }

  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    const inputValue: string = this.el.nativeElement.value;
    const cursorPosition = this.el.nativeElement.selectionStart;
    if (this.acceptedKeys.includes(event.key)) {
      // If user pressed dot and there is no dot already in the field
      if (event.key === '.' && inputValue.indexOf('.') === -1 && inputValue === '') {
        this.el.nativeElement.value = inputValue.concat('0');
      } else if (event.key === '.' && inputValue.includes('.')) {
        // Prevent two dot
        event.preventDefault();
      }
      if (inputValue.includes('.')) {
        const dotIndex = inputValue.indexOf('.');
        const split = inputValue.split('.');
        // NavigationKeys => Allowing left arrow, right arrow and backspace
        if (split[1].length >= 2 && (cursorPosition - 1) === (dotIndex + 2) && !this.navigationKeys.includes(event.key)) {
          event.preventDefault();
        }
      }
      // Skip dot (automatically move cursor to next number after decimal)
      if (inputValue.includes('.') && event.key === '.' && (cursorPosition) === inputValue.indexOf('.')) {
        this.el.nativeElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
      }
      // Skip dot on backspace (keep decimal)
      if (inputValue.includes('.') && event.key === 'Backspace' && (cursorPosition) === inputValue.indexOf('.') + 1) {
        this.el.nativeElement.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
      }
      // If user entered $12.<cursor>56, and cursor is at middle of dot and 5, then if user presses '9' then it will update the
      // value to $12.96
      if (event.key !== '.' && inputValue.includes('.')
        && (cursorPosition) === (inputValue.indexOf('.') + 1) && !this.navigationKeys.includes(event.key)) {
        this.el.nativeElement.value = this.replaceAt(inputValue, cursorPosition, event.key);
        this.el.nativeElement.dispatchEvent(new Event('input'));
        this.el.nativeElement.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
        event.preventDefault();
      }
      // If user entered $12.5<cursor>6, and cursor is at middle of 5 and 6, then if user presses '9' then it will update the
      // value to $12.59
      if (event.key !== '.' && inputValue.includes('.')
        && (cursorPosition) === (inputValue.indexOf('.') + 2) && !this.navigationKeys.includes(event.key)) {
        this.el.nativeElement.value = this.replaceAt(inputValue, cursorPosition, event.key);
        this.el.nativeElement.dispatchEvent(new Event('input'));
        this.el.nativeElement.setSelectionRange(cursorPosition + 2, cursorPosition + 2);
        event.preventDefault();
      }


    } else {
      event.preventDefault();
    }
  }

  /**
   * Replace specific character in a string at specified index
   * @param str String
   * @param index Number
   * @param replacement any
   */
  replaceAt(str: string, index, replacement) {
    return str.substr(0, index) + replacement + str.substr(index + replacement.length);
  }


}
