import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-hero-banner',
  templateUrl: './hero-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBannerComponent {
  @Input() item;
}
