import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPage } from 'app/entities/nsdpDocApp/page/page.model';
import { PageService } from 'app/entities/nsdpDocApp/page/service/page.service';
import { IElement } from '../element.model';
import { ElementService } from '../service/element.service';
import { ElementFormGroup, ElementFormService } from './element-form.service';

@Component({
  selector: 'jhi-element-update',
  templateUrl: './element-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ElementUpdateComponent implements OnInit {
  isSaving = false;
  element: IElement | null = null;

  pagesSharedCollection: IPage[] = [];

  protected elementService = inject(ElementService);
  protected elementFormService = inject(ElementFormService);
  protected pageService = inject(PageService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ElementFormGroup = this.elementFormService.createElementFormGroup();

  comparePage = (o1: IPage | null, o2: IPage | null): boolean => this.pageService.comparePage(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ element }) => {
      this.element = element;
      if (element) {
        this.updateForm(element);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const element = this.elementFormService.getElement(this.editForm);
    if (element.id !== null) {
      this.subscribeToSaveResponse(this.elementService.update(element));
    } else {
      this.subscribeToSaveResponse(this.elementService.create(element));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IElement>>): void {
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

  protected updateForm(element: IElement): void {
    this.element = element;
    this.elementFormService.resetForm(this.editForm, element);

    this.pagesSharedCollection = this.pageService.addPageToCollectionIfMissing<IPage>(this.pagesSharedCollection, element.page);
  }

  protected loadRelationshipsOptions(): void {
    this.pageService
      .query()
      .pipe(map((res: HttpResponse<IPage[]>) => res.body ?? []))
      .pipe(map((pages: IPage[]) => this.pageService.addPageToCollectionIfMissing<IPage>(pages, this.element?.page)))
      .subscribe((pages: IPage[]) => (this.pagesSharedCollection = pages));
  }
}
