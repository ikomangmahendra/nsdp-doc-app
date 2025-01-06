import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IPage } from '../page.model';

@Component({
  selector: 'jhi-page-detail',
  templateUrl: './page-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class PageDetailComponent {
  page = input<IPage | null>(null);

  previousState(): void {
    window.history.back();
  }
}
