import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Employee } from 'src/app/shared/model/employee';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-item-form-dialog',
  templateUrl: './item-form-dialog.component.html',
  styleUrls: ['./item-form-dialog.component.css']
})
export class ItemFormDialogComponent implements OnInit {
  public newItemForm: FormGroup;
  public nameExists = false;

  constructor(
    public dialogRef: MatDialogRef<ItemFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number, employee?: Employee },
    private employeeService: EmployeeService,
    private fb: FormBuilder,
  ) {
    this.newItemForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern('[0-9]{11}')]],
      foodOption: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator()]]
    });
  }

  addNewItem(): void {
    if (this.newItemForm.invalid) {
      this.newItemForm.markAllAsTouched();
      return;
    }
    const newDate: moment.Moment = moment.utc(this.newItemForm.value.date).local();
    this.newItemForm.value.date = newDate.format('YYYY-MM-DD');
    this.employeeService.addEmployee(this.newItemForm.value).subscribe(result => {
      this.dialogRef.close();
      this.newItemForm.reset();
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
    this.newItemForm.reset();
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const now = moment();
      const selectedDate = moment.utc(control.value);
      if (selectedDate.isValid() && selectedDate.isAfter(now, 'day')) {
        return null;
      } else {
        return {'invalidDate': true};
      }
    };
  }
}
