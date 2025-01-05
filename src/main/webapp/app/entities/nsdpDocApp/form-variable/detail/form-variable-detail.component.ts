import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IFormVariable } from '../form-variable.model';

@Component({
  selector: 'jhi-form-variable-detail',
  templateUrl: './form-variable-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class FormVariableDetailComponent {
  formVariable = input<IFormVariable | null>(null);

  previousState(): void {
    window.history.back();
  }
}
