import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISection } from 'app/entities/nsdpDocApp/section/section.model';
import { SectionService } from 'app/entities/nsdpDocApp/section/service/section.service';
import { IPage } from '../page.model';
import { PageService } from '../service/page.service';
import { PageFormGroup, PageFormService } from './page-form.service';

@Component({
  selector: 'jhi-page-update',
  templateUrl: './page-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PageUpdateComponent implements OnInit {
  isSaving = false;
  page: IPage | null = null;

  sectionsSharedCollection: ISection[] = [];

  protected pageService = inject(PageService);
  protected pageFormService = inject(PageFormService);
  protected sectionService = inject(SectionService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PageFormGroup = this.pageFormService.createPageFormGroup();

  compareSection = (o1: ISection | null, o2: ISection | null): boolean => this.sectionService.compareSection(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ page }) => {
      this.page = page;
      if (page) {
        this.updateForm(page);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const page = this.pageFormService.getPage(this.editForm);
    if (page.id !== null) {
      this.subscribeToSaveResponse(this.pageService.update(page));
    } else {
      this.subscribeToSaveResponse(this.pageService.create(page));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPage>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(page: IPage): void {
    this.page = page;
    this.pageFormService.resetForm(this.editForm, page);

    this.sectionsSharedCollection = this.sectionService.addSectionToCollectionIfMissing<ISection>(
      this.sectionsSharedCollection,
      page.section,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.sectionService
      .query()
      .pipe(map((res: HttpResponse<ISection[]>) => res.body ?? []))
      .pipe(map((sections: ISection[]) => this.sectionService.addSectionToCollectionIfMissing<ISection>(sections, this.page?.section)))
      .subscribe((sections: ISection[]) => (this.sectionsSharedCollection = sections));
  }
}
