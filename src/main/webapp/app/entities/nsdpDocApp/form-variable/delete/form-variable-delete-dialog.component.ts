import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IFormVariable } from '../form-variable.model';
import { FormVariableService } from '../service/form-variable.service';

@Component({
  templateUrl: './form-variable-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class FormVariableDeleteDialogComponent {
  formVariable?: IFormVariable;

  protected formVariableService = inject(FormVariableService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.formVariableService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
