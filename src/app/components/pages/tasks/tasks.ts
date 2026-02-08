import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api-service';
import { Task } from '../../../model/task.model';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
// export class Tasks {

//   tasks = [
//     {
//         "id": 6,
//         "name": "Sample Task 6",
//         "dueDate": "2026-02-07",
//         "priority": "MEDIUM",
//         "status": "COMPLETED"
//     },
//     {
//         "id": 5,
//         "name": "Sample Task 5",
//         "dueDate": "2026-02-08",
//         "priority": "MEDIUM",
//         "status": "PENDING"
//     },
//     {
//         "id": 4,
//         "name": "Sample Task 4",
//         "dueDate": "2026-02-09",
//         "priority": "MEDIUM",
//         "status": "PENDING"
//     },
//     {
//         "id": 1,
//         "name": "Sample Task",
//         "dueDate": "2026-02-10",
//         "priority": "MEDIUM",
//         "status": "COMPLETED"
//     },
//     {
//         "id": 2,
//         "name": "Sample Task 2",
//         "dueDate": "2026-02-10",
//         "priority": "HIGH",
//         "status": "PENDING"
//     },
//     {
//         "id": 3,
//         "name": "Sample Task 3",
//         "dueDate": "2026-02-10",
//         "priority": "MEDIUM",
//         "status": "PENDING"
//     },
//     {
//         "id": 7,
//         "name": "Sample Task 7",
//         "dueDate": "2026-02-11",
//         "priority": "MEDIUM",
//         "status": "PENDING"
//     },
//     {
//         "id": 8,
//         "name": "Sample Task 8",
//         "dueDate": "2026-02-12",
//         "priority": "MEDIUM",
//         "status": "PENDING"
//     },
//     {
//         "id": 9,
//         "name": "Sample Task 9",
//         "dueDate": "2026-03-02",
//         "priority": "MEDIUM",
//         "status": "PENDING"
//     },
//     {
//         "id": 10,
//         "name": "Sample Task 10",
//         "dueDate": "2026-03-02",
//         "priority": "MEDIUM",
//         "status": "PENDING"
//     }
// ]

//   searchText = '';
//   sortColumn = '';
//   sortDirection: 'asc' | 'desc' = 'asc';

//   page = 1;
//   pageSize = 5;

//   // Filter
//   get filteredTasks() {
//     let data = this.tasks.filter(task =>
//       Object.values(task).some(val =>
//         val.toString().toLowerCase().includes(this.searchText.toLowerCase())
//       )
//     );

//     // Sorting
//     if (this.sortColumn) {
//       data = data.sort((a: any, b: any) => {
//         const valA = a[this.sortColumn];
//         const valB = b[this.sortColumn];

//         if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
//         if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     return data;
//   }

//   // Pagination
//   get paginatedTasks() {
//     const start = (this.page - 1) * this.pageSize;
//     return this.filteredTasks.slice(start, start + this.pageSize);
//   }

//   get totalPages() {
//     return Math.ceil(this.filteredTasks.length / this.pageSize);
//   }

//   changeSort(column: string) {
//     if (this.sortColumn === column) {
//       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//     } else {
//       this.sortColumn = column;
//       this.sortDirection = 'asc';
//     }
//   }

//   changePage(p: number) {
//     if (p >= 1 && p <= this.totalPages) {
//       this.page = p;
//     }
//   }

//   // Editing
//   editingTask: any = null;

//   editTask(task: any) {
//     this.editingTask = { ...task };
//   }

//   saveEdit() {
//     if (!this.editingTask) return;
//     const idx = this.tasks.findIndex(t => t.id === this.editingTask.id);
//     if (idx > -1) {
//       this.tasks[idx] = { ...this.editingTask };
//     }
//     this.editingTask = null;
//   }

//   cancelEdit() {
//     this.editingTask = null;
//   }

//   deleteTask(id: number) {
//     if (confirm('Are you sure you want to delete this task?')) {
//       const idx = this.tasks.findIndex(t => t.id === id);
//       if (idx > -1) {
//         this.tasks.splice(idx, 1);
//         this.page = 1; // Reset to first page after deletion
//       }
//     }
//   }

//   // Add New Task
//   showAddForm = false;
//   newTask = {
//     name: '',
//     dueDate: new Date().toISOString().split('T')[0],
//     priority: 'MEDIUM',
//     status: 'PENDING'
//   };

//   toggleAddForm() {
//     this.showAddForm = !this.showAddForm;
//     if (!this.showAddForm) {
//       this.resetForm();
//     }
//   }

//   addTask() {
//     if (!this.newTask.name.trim()) {
//       alert('Please enter a task name');
//       return;
//     }
//     const newId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.id)) + 1 : 1;
//     this.tasks.push({
//       id: newId,
//       name: this.newTask.name,
//       dueDate: this.newTask.dueDate,
//       priority: this.newTask.priority,
//       status: this.newTask.status
//     });
//     this.resetForm();
//     this.showAddForm = false;
//   }

//   resetForm() {
//     this.newTask = {
//       name: '',
//       dueDate: new Date().toISOString().split('T')[0],
//       priority: 'MEDIUM',
//       status: 'PENDING'
//     };
//   }




// new code
// }

export class Tasks implements OnInit {

  constructor(private api: ApiService) {}

  // Dynamic data
  tasks: Task[] = [];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTc3MDQ3OTc1NCwiZXhwIjoxNzcwNDgzMzU0fQ.ut3pYZOImtzjaObxFMtGX8E0y6oQk0tFngFqRHjVOhc';
    this.api.getTasks(token).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Error loading tasks', err);
      }
    });
  }

  // ===== Existing logic (unchanged) =====

  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 5;

  get filteredTasks() {
    let data = this.tasks.filter(task =>
      Object.values(task).some(val =>
        val?.toString().toLowerCase().includes(this.searchText.toLowerCase())
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

  get paginatedTasks() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredTasks.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredTasks.length / this.pageSize);
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

  // ===== Edit =====

  editingTask: any = null;

  editTask(task: any) {
    this.editingTask = { ...task };
  }

  saveEdit() {
    if (!this.editingTask) return;
let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTc3MDQ3OTc1NCwiZXhwIjoxNzcwNDgzMzU0fQ.ut3pYZOImtzjaObxFMtGX8E0y6oQk0tFngFqRHjVOhc';
    this.api.updateTask(this.editingTask.id, this.editingTask, token).subscribe({
      next: () => {
        this.loadTasks();
        this.editingTask = null;
      },
      error: err => console.error(err)
    });
  }

  cancelEdit() {
    this.editingTask = null;
  }

  // ===== Delete =====

  deleteTask(id: number) {
    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTc3MDQ3OTc1NCwiZXhwIjoxNzcwNDgzMzU0fQ.ut3pYZOImtzjaObxFMtGX8E0y6oQk0tFngFqRHjVOhc';
    if (confirm('Are you sure you want to delete this task?')) {
      this.api.deleteTask(id, token).subscribe({
        next: () => {
          this.loadTasks();
          this.page = 1;
        },
        error: err => console.error(err)
      });
    }
  }

  // ===== Add =====

  showAddForm = false;

  newTask: Task = {
    name: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'MEDIUM',
    status: 'PENDING'
  };

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) this.resetForm();
  }

  addTask() {
    if (!this.newTask.name.trim()) {
      alert('Please enter a task name');
      return;
    }

    let token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMSIsImlhdCI6MTc3MDQ3OTc1NCwiZXhwIjoxNzcwNDgzMzU0fQ.ut3pYZOImtzjaObxFMtGX8E0y6oQk0tFngFqRHjVOhc';
    this.api.createTask(this.newTask, token).subscribe({
      next: () => {
        this.loadTasks();
        this.resetForm();
        this.showAddForm = false;
      },
      error: err => console.error(err)
    });
  }

  resetForm() {
    this.newTask = {
      name: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'MEDIUM',
      status: 'PENDING'
    };
  }
}
