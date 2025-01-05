import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormVariableType } from 'app/entities/enumerations/form-variable-type.model';
import { IFormVariable } from '../form-variable.model';
import { FormVariableService } from '../service/form-variable.service';
import { FormVariableFormGroup, FormVariableFormService } from './form-variable-form.service';

@Component({
  selector: 'jhi-form-variable-update',
  templateUrl: './form-variable-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FormVariableUpdateComponent implements OnInit {
  isSaving = false;
  formVariable: IFormVariable | null = null;
  formVariableTypeValues = Object.keys(FormVariableType);

  protected formVariableService = inject(FormVariableService);
  protected formVariableFormService = inject(FormVariableFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: FormVariableFormGroup = this.formVariableFormService.createFormVariableFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formVariable }) => {
      this.formVariable = formVariable;
      if (formVariable) {
        this.updateForm(formVariable);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formVariable = this.formVariableFormService.getFormVariable(this.editForm);
    if (formVariable.id !== null) {
      this.subscribeToSaveResponse(this.formVariableService.update(formVariable));
    } else {
      this.subscribeToSaveResponse(this.formVariableService.create(formVariable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormVariable>>): void {
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

  protected updateForm(formVariable: IFormVariable): void {
    this.formVariable = formVariable;
    this.formVariableFormService.resetForm(this.editForm, formVariable);
  }
}
