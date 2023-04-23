import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Employee } from 'src/app/shared/model/employee';
import { EmployeeService } from 'src/app/shared/service/employee.service';

@Component({
  selector: 'app-edit-form-dialog',
  templateUrl: './edit-form-dialog.component.html',
  styleUrls: ['./edit-form-dialog.component.css']
})
export class EditFormDialogComponent implements OnInit{
  public editItemForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number, employee?: Employee },
    private employeeService: EmployeeService,
    private fb: FormBuilder,
  ) {
    this.editItemForm = this.fb.group({
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      foodOption: ['', Validators.required],
      date: ['', Validators.required]
    });

    if (data && data.employee) {
      const employee = data.employee;
      // Converter a data para o fuso horário local correto
      const localDate = moment.utc(employee.date).local().format('YYYY-MM-DD');
      employee.date = localDate;
      this.editItemForm.patchValue(employee);
    }
    
    this.data = data;
    
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
    this.editItemForm.reset();
  }

  updateEmployee(): void {
    const id = this.data.id ?? 0;
    const updatedEmployee = this.editItemForm.value;
    this.employeeService.updateEmployee(id, updatedEmployee).subscribe(() => {
      // Atualizar a tabela de funcionários
      this.dialogRef.close();
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}
