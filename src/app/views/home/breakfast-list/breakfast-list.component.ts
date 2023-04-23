import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/shared/model/employee';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemFormDialogComponent } from '../item-form-dialog/item-form-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { EditFormDialogComponent } from '../edit-form-dialog/edit-form-dialog.component';
import { switchMap } from 'rxjs/operators';



export interface Employees {
  id: number;
  name: string;
  cpf: string;
  foodOption: string;
  date: string;
  verification: boolean;
  delete: boolean
}

@Component({
  selector: 'app-breakfast-list',
  templateUrl: './breakfast-list.component.html',
  styleUrls: ['./breakfast-list.component.css']
})

export class BreakfastListComponent implements OnInit {
  employees: Employee[] = [];
  innerArray: Employee[] = [];
  editForm: FormGroup;
  data: any;

  constructor(
    public employeeService: EmployeeService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
    cpf: ['', [Validators.required, Validators.pattern('[0-9]{11}')]],
      foodOption: ['', Validators.required],
      date: ['', Validators.required],
      verification: [''],
      delete: ['']
    });
  }

  ngOnInit(): void {
    this.getEmployees();
  }
  
  addItem(): void {
    const dialogRef = this.dialog.open(ItemFormDialogComponent, {
      minWidth: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getEmployees() {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.innerArray = employees.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    });
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.employees = this.employees.filter(employee => employee.id !== id);
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  
  editEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe(employee => {
      const dialogRef = this.dialog.open(EditFormDialogComponent, {
        minWidth: '400px',
        data: { id: id, employee: employee } // Passar os dados do funcionário recuperado
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });
    });
  }
  
  updateEmployee(id: number) {
    const updatedEmployee = this.editForm.value;
    this.employeeService.updateEmployee(id, updatedEmployee).subscribe(() => {
      // Atualizar a tabela de funcionários
      this.getEmployees();
      // Fechar o diálogo de edição
      this.dialog.closeAll();
    });

  }

  toggleVerification(id: number, verification: boolean, name: string, cpf: string, foodOption: string, date: string) {
    this.employeeService.updateVerification(id, verification, name, cpf, foodOption, date).subscribe(() => {
      // Atualizar a tabela de funcionários
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  }

  displayedColumns: string[] = ['name', 'cpf', 'foodOption', 'date', 'verification', 'delete'];
  clickedRows = new Set<Employees>();


  color: ThemePalette = 'primary';
  checked = false;
  disabled = false;
}
