import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IElement } from '../element.model';

@Component({
  selector: 'jhi-element-detail',
  templateUrl: './element-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class ElementDetailComponent {
  element = input<IElement | null>(null);

  previousState(): void {
    window.history.back();
  }
}
