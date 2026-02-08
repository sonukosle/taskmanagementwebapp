export interface Task {
  id?: number;
  name: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'COMPLETED';
}
