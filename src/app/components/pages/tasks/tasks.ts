import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../service/api-service';
import { Task } from '../../../model/task.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-tasks',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})

export class Tasks implements OnInit {

  constructor(private api: ApiService, private toastr: ToastrService, private fb: FormBuilder) {}

  tasks = signal<Task[]>([]);
  loading = signal(false);

  // Form Groups
  addTaskForm!: FormGroup;
  editTaskForm!: FormGroup;
  editingTask: any = null;
  editingTaskId: number | null = null;

  ngOnInit() {
    this.initializeForms();
    this.loadTasks();
  }

  initializeForms() {
    const today = new Date().toISOString().split('T')[0];
    this.addTaskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      dueDate: [today, Validators.required],
      priority: ['MEDIUM', Validators.required],
      status: ['PENDING', Validators.required]
    });
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

  editTask(task: any) {
    this.editingTask = { ...task };
    this.editingTaskId = task.id;
    this.editTaskForm = this.fb.group({
      name: [task.name, [Validators.required, Validators.minLength(1)]],
      dueDate: [task.dueDate, Validators.required],
      priority: [task.priority, Validators.required],
      status: [task.status, Validators.required]
    });
  }

saveEdit() {
  if (!this.editTaskForm.valid || !this.editingTaskId || this.loading()) return;

  this.loading.set(true);

  const formData = {
    id: this.editingTaskId,
    name: this.editTaskForm.get('name')?.value,
    dueDate: this.editTaskForm.get('dueDate')?.value,
    priority: this.editTaskForm.get('priority')?.value,
    status: this.editTaskForm.get('status')?.value
  };

  this.api.updateTask(this.editingTaskId, formData).subscribe({
    next: () => {
      this.editingTask = null;
      this.editingTaskId = null;
      this.loadTasks();
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
    this.editingTaskId = null;
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

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) this.resetForm();
  }

  addTask() {
    if (!this.addTaskForm.valid) {
      this.toastr.error('Please fill all required fields', 'Error');
      return;
    }
    if (this.loading()) return;

    this.loading.set(true);
    this.api.createTask(this.addTaskForm.value).subscribe({
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
    const today = new Date().toISOString().split('T')[0];
    this.addTaskForm.reset({
      name: '',
      dueDate: today,
      priority: 'MEDIUM',
      status: 'PENDING'
    });
  }

  trackById(index: number, item: Task) {
  return item.id;
}
}
