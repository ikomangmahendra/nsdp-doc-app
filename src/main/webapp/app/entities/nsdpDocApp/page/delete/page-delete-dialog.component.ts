import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPage } from '../page.model';
import { PageService } from '../service/page.service';

@Component({
  templateUrl: './page-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PageDeleteDialogComponent {
  page?: IPage;

  protected pageService = inject(PageService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.pageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
