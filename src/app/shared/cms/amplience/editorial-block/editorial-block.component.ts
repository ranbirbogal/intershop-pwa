import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ish-editorial-block',
  templateUrl: './editorial-block.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorialBlockComponent {
  @Input() item;
}
