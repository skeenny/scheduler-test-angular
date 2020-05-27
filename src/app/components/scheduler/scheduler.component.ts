import { Component, OnInit } from '@angular/core';
import { SchedulerService } from '../../services/scheduler.service';
import { ITask, ICategory } from '../../interfaces/scheduler';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.sass']
})
export class SchedulerComponent implements OnInit {
    public selectedCategory: number[] = [];
    public selectedSorting = '';
    public searchValue = '';
    public categories: ICategory[] = [];
    public tasks: ITask[] = [];
    public taskText = '';
    public filteredTasks: ITask[] = [];
    public isLoadingTasks = false;
    public isAllTasksDone = true;
    constructor(private schedulerService: SchedulerService,
                private router: Router) {
    }
    ngOnInit() {
        this.loadCategories((err?: Error) => {
            if (err) {
                console.log(err.message);
            }
        });
        this.loadTasks((err?: Error) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

    sort() {
        this.loadTasks((err?: Error) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

    loadCategories(cb?: (err?: Error) => void): void {
        this.schedulerService.getCategories().subscribe((categories: ICategory[]) => {
            this.categories = categories;
        }, (response: HttpErrorResponse) => {
            if (cb) {
                cb(new Error(response.error.error));
            }
        });
    }

    loadTasks(cb?: (err?: Error) => void): void {
        this.isLoadingTasks = true;
        this.isAllTasksDone = true;
        let sorting = null;
        if (this.selectedSorting) {
            sorting = this.selectedSorting.split('_');
        }
        this.schedulerService.getTasks(sorting, this.selectedCategory).subscribe((tasks: ITask[]) => {
            if (!this.selectedSorting) {
                const priorityTasks = tasks.filter(task => task.priority && !task.status);
                const doneTasks = tasks.filter(task => task.status);
                const normalTasks = tasks.filter(task => !task.status && !task.priority);
                this.tasks = [...priorityTasks, ...normalTasks, ...doneTasks];
                this.filteredTasks = [...priorityTasks, ...normalTasks, ...doneTasks];
            } else {
                this.tasks = tasks;
                this.filteredTasks = tasks;
            }
            if (tasks.length > 0) {
                this.tasks.map(task => {
                    if (!task.status) {
                        this.isAllTasksDone = false;
                    }
                });
            }
            this.isLoadingTasks = false;
        }, (response: HttpErrorResponse) => {
            this.isLoadingTasks = false;
            if (cb) {
                cb(new Error(response.error.error));
            }
        });
    }
    search() {
        const filterValue = this.searchValue.toLowerCase();
        this.filteredTasks = this.tasks.filter(task => {
            if (task.description.toLowerCase().includes(filterValue)) {
                return task;
            }
        });
    }

    createTask(description: string) {
        if (description === '') {
            return;
        }
        const task: ITask = {
            id: 0,
            description,
            priority: false,
            status: false,
            categories: []
        };
        this.taskText = '';
        this.addTask(task);
    }

    addTask(task) {
        this.schedulerService.addTask(task).then(() => {
            this.loadTasks((err?: Error) => {
                if (err) {
                    console.log(err.message);
                }
            });
        }, (response: HttpErrorResponse) => {
            console.log(response.error.error);
        });
    }

    toggleAllTasks() {
        this.isAllTasksDone = !this.isAllTasksDone;
        let changeTasks: ITask[];
        changeTasks = [];
        this.tasks.map(task => {
            if (task.status !== this.isAllTasksDone) {
                task.status = this.isAllTasksDone;
                changeTasks.push(task);
            }
        });
        this.schedulerService.completeAllTasks(changeTasks).then(() => {
            this.loadTasks((err?: Error) => {
                if (err) {
                    console.log(err.message);
                }
            });
        }, (response: HttpErrorResponse) => {
            console.log(response.error.error);
        });
    }

    goToCategories() {
        this.router.navigate(['/categories']);
    }
}
