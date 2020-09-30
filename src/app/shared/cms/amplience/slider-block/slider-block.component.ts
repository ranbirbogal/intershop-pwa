import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-slider-block',
  templateUrl: './slider-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderBlockComponent {
  @Input() item;
}
