import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiUrl = '/employees';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient
  ) { }

  public getAllEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(this.apiUrl);
  };

  public addEmployee(employee: any): Observable<Employee>{
    return this.httpClient.post<any>(this.apiUrl, employee, this.httpOptions);
  };

  public deleteEmployee(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete(url, this.httpOptions);
  }

  public getEmployeeById(id: number): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Employee>(url);
  }

  public updateEmployee(id: number, employee: Employee): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.put<Employee>(url, employee, this.httpOptions);
  }

  public updateVerification(id: number, verification: boolean, name: string, cpf: string, foodOption: string, date: string): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    const updatedEmployee = { verification, name, cpf, foodOption, date };
    return this.httpClient.put<Employee>(url, updatedEmployee, this.httpOptions);
  }
  
}
