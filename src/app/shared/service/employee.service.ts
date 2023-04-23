import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  apiUrl = 'https://desafio-unidac.up.railway.app';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient
  ) { }

  private addAccessControlHeader(headers?: HttpHeaders): HttpHeaders {
    headers = headers || new HttpHeaders();
    return headers.append('Access-Control-Allow-Origin', this.apiUrl);
  }

  public getAllEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}/employees`, this.httpOptions);
  };

  public addEmployee(employee: any): Observable<Employee>{
    const headers = this.addAccessControlHeader();
    return this.httpClient.post<any>(this.apiUrl, employee, { headers });
  };

  public deleteEmployee(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const headers = this.addAccessControlHeader();
    return this.httpClient.delete(url, { headers });
  }

  public getEmployeeById(id: number): Observable<Employee> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Employee>(url, this.httpOptions);
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
