import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ISection } from '../section.model';

@Component({
  selector: 'jhi-section-detail',
  templateUrl: './section-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class SectionDetailComponent {
  section = input<ISection | null>(null);

  previousState(): void {
    window.history.back();
  }
}
