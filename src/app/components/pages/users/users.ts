import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {

  // Sample Data
  users = [
    { id: 1, name: 'John', email: 'john@test.com', role: 'Admin' },
    { id: 2, name: 'Sunny', email: 'sunny@test.com', role: 'User' },
    { id: 3, name: 'Amit', email: 'amit@test.com', role: 'User' },
    { id: 4, name: 'Neha', email: 'neha@test.com', role: 'Admin' },
    { id: 5, name: 'Ravi', email: 'ravi@test.com', role: 'User' },
    { id: 6, name: 'Priya', email: 'priya@test.com', role: 'User' }
  ];
    searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 3;

  // Search + Sort + Pagination
  get filteredUsers() {
    let data = this.users.filter(user =>
      Object.values(user).some(val =>
        val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );

    if (this.sortColumn) {
      data = data.sort((a: any, b: any) => {
        const valA = a[this.sortColumn];
        const valB = b[this.sortColumn];

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }

  get paginatedUsers() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  changeSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  changePage(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
    }
  }
}
