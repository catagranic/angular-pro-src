import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const COUNTER_CONTROL_ACCESOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => StockCounterComponent),
  multi: true
};

@Component({
  selector: 'stock-counter',
  providers: [COUNTER_CONTROL_ACCESOR],
  styleUrls: ['stock-counter.component.scss'],
  template: `
    <div
      [class.focused]="focus"
      class="stock-counter">
      <div>
        <div
          tabindex="0"
          (keydown)="onKeyDown($event)"
          (blue)="onBlur($event)"
          (focus)="onFocus($event)">
          <p>{{ value }}</p>
          <div>
            <button
              type="button"
              [disabled]="value === max"
              (click)="increment()">
              +
            </button>
            <button
              type="button"
              [disabled]="value === min"
              (click)="decrement()">
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StockCounterComponent implements ControlValueAccessor {

  private onTouch: Function;
  private onModelChange: Function;

  registerOnTouched(fn) {
    this.onTouch = fn;
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  
  writeValue(value) {
    this.value = value || 0;
  }

  @Input() step: number = 10;
  @Input() min: number = 10;
  @Input() max: number = 1000;

  value: number = 10;

  focus: boolean;

  onKeyDown(event: KeyboardEvent) {

    const handlers = {
      ArrowDown: () => this.decrement(),
      ArrowUp: () => this.increment()
    }

    if (handlers[event.code]) {
      handlers[event.code]();
      event.preventDefault();
      event.stopPropagation();
    }
    this.onTouch();

  }

  onBlur(event: FocusEvent) {
    this.focus = false;
    event.preventDefault();
    event.stopPropagation();
    this.onTouch();
  }

  onFocus(event: FocusEvent) {
    this.focus = true;
    event.preventDefault();
    event.stopPropagation();
    this.onTouch();
  }

  increment() {
    if (this.value < this.max) {
      this.value = this.value + this.step;
      this.onModelChange(this.value);
    }
    this.onTouch();
  }

  decrement() {
    if (this.value > this.min) {
      this.value = this.value - this.step;
      this.onModelChange(this.value);
    }
    this.onTouch();
  }
}