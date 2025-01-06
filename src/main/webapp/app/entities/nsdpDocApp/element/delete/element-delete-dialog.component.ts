import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IElement } from '../element.model';
import { ElementService } from '../service/element.service';

@Component({
  templateUrl: './element-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ElementDeleteDialogComponent {
  element?: IElement;

  protected elementService = inject(ElementService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.elementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
