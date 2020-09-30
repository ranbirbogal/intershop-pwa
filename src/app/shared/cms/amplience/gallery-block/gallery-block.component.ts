import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-gallery-block',
  templateUrl: './gallery-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryBlockComponent {
  @Input() item;
}
