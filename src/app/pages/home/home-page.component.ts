import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ish-home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  // amplienceContent: Array<any>;
  amplienceContentId: string;
  ampliencePreview = false;
  amplienceSlot = false;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.amplienceContentId = params.get('amplienceid');
      if (this.amplienceContentId) {
        this.ampliencePreview = true;
      }

      if (params.get('slot')) {
        this.amplienceSlot = true;
      }
      console.log('this.amplienceContentId', this.amplienceContentId);
      console.log('this.amplienceSlot', this.amplienceSlot);
    });
  }
}
