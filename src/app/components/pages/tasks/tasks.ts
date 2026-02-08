import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../service/api-service';
import { Task } from '../../../model/task.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Tasks implements OnInit {

  constructor(private api: ApiService,private toastr: ToastrService) {}

  tasks = signal<Task[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.api.getTasks().subscribe({
      next: (data) => {
        this.tasks.set([...data]);
      },
      error: (err) => {
        console.error('Error loading tasks', err);
      }
    });
  }

  searchText = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  page = 1;
  pageSize = 5;

  get filteredTasks() {
    let data = this.tasks().filter(task =>
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


  editingTask: any = null;

  editTask(task: any) {
    this.editingTask = { ...task };
  }

saveEdit() {
  if (!this.editingTask || this.loading()) return;

  this.loading.set(true);
  this.api.updateTask(this.editingTask.id, this.editingTask).subscribe({
    next: (updated: Task) => {
      this.tasks.update(list => list.map(t => t.id === updated.id ? { ...updated } : t));
      this.editingTask = null;
      this.loading.set(false);
       this.toastr.success('Task updated successfully!', 'Success');
    },
    error: (err) => {
      console.error(err);
      this.loading.set(false);
       this.toastr.error('Something went wrong!', 'Error');
    }
  });
}


  cancelEdit() {
    this.editingTask = null;
  }

deleteTask(id: number) {
  if (!confirm('Are you sure you want to delete this task?')) return;
  if (this.loading()) return;

  this.loading.set(true);
  this.api.deleteTask(id).subscribe({
    next: () => {
      this.tasks.update(list => list.filter(t => t.id !== id));
      this.page = 1;
      this.loading.set(false);
      this.toastr.success('Task deleted successfully!', 'Success');
    },
    error: (err) => {
      console.error(err);
      this.loading.set(false);
       this.toastr.error('Something went wrong!', 'Error');
    }
  });
}

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
  if (this.loading()) return;

  this.loading.set(true);
  this.api.createTask(this.newTask).subscribe({
    next: (created: Task) => {
      this.tasks.update(list => [created, ...list]);
      this.resetForm();
      this.showAddForm = false;
      this.page = 1;
      this.loading.set(false);
        this.toastr.success('Task added successfully!', 'Success');
    },
    error: (err) => {
      console.error(err);
      this.loading.set(false);
       this.toastr.error('Something went wrong!', 'Error');
    }
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

  trackById(index: number, item: Task) {
  return item.id;
}
}
