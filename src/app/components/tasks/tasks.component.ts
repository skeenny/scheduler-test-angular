import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ITask, ICategory } from 'src/app/interfaces/scheduler';
import { SchedulerService } from 'src/app/services/scheduler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TASK_DONE_KEYFRAMES, TASK_PRIORIY_KEYFRAMES, TASK_DELETE_KEYFRAMES } from '../../../assets/cssKeyframes'


@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.sass']
})
export class TasksComponent {
    @Output("loadTasks") loadTasks: EventEmitter<any> = new EventEmitter();
    @Input() categories: ICategory[] = [];
    @Input() tasks: ITask[] = [];
    @Input() isLoadingTasks: boolean = false;
    public taskEditor = {
        isEditingTask: false,
        taskId: undefined
    }
    public taskBuffer: ITask;
    public selectedCategories: number[] = [];
    constructor(private schedulerService: SchedulerService) {
    }

    isCategoryActive(category: ICategory, task?: ITask) {
        let isCategoryActive = false;
        if (task) {
            task.categories.map(id => {
                if (id === category.id) {
                    isCategoryActive = true;
                }
            });
        } else {
            this.taskBuffer.categories.map(id => {
                if (id === category.id) {
                    isCategoryActive = true;
                }
            });
        }
        return isCategoryActive;
    }

    switchCategory(category) {
        let index = this.taskBuffer.categories.indexOf(category.id);
        if (index >= 0) {
            this.taskBuffer.categories.splice(index, 1);
        } else {
            this.taskBuffer.categories.push(category.id);
        }
        this.taskBuffer.categories.sort(function (a, b) {
            return a - b;
        });
    }

    getCategoryById(id) {
        let categoryTitle = null;
        this.categories.map(category => {
            if (category.id === id) {
                categoryTitle = category.title;
            }
        });
        return categoryTitle;
    }

    getInput(id) {
        return <HTMLInputElement>document.getElementById('input-' + id);

    }

    editTask(task: ITask) {
        if (this.taskBuffer && this.taskBuffer.id === task.id) {
            this.taskBuffer = null;
            this.loadTasks.emit();
        } else if (this.taskBuffer && this.taskBuffer.id !== task.id) {
            this.loadTasks.emit();
            this.taskBuffer = task;
            setTimeout(() => {
                this.getInput(task.id).focus();
            }, 0);
        } else {
            this.taskBuffer = task;
            setTimeout(() => {
                this.getInput(task.id).focus();
            }, 0);
        }
    }

    saveTask() {
        this.taskBuffer.description = this.getInput(this.taskBuffer.id).value;
        this.schedulerService.updateTask(this.taskBuffer.id, this.taskBuffer).then(() => {
            this.taskBuffer = null;
            this.loadTasks.emit();
        }, (response: HttpErrorResponse) => {
            console.log(response.error.error);
        });
    }

    changeTaskState(task: ITask, state: string) {
        task[state] = !task[state];
        this.tasks.map(originTask => {
            if (originTask.id === task.id) {
                originTask = task;
            }
        });
        if (state === 'priority') {
            document.getElementById('task-' + task.id).animate(TASK_PRIORIY_KEYFRAMES, 500)
        } else {
            document.getElementById('task-' + task.id).animate(TASK_DONE_KEYFRAMES, 500)

        }
        setTimeout(() => {
            this.schedulerService.updateTask(task.id, task).then(() => {
                this.loadTasks.emit();
            }, (response: HttpErrorResponse) => {
                console.log(response.error.error);
            });
        }, 500);
    }

    deleteTask(id) {
        // this.switchEditor(id, true);
        document.getElementById('task-' + id).animate(TASK_DELETE_KEYFRAMES, 500);
        setTimeout(() => {
            this.tasks.map((originTask, index) => {
                if (originTask.id === id) {
                    this.tasks.splice(index, 1);
                }
            });
            this.schedulerService.deleteTask(id).then(() => {
                this.loadTasks.emit();
            }, (response: HttpErrorResponse) => {
                console.log(response.error.error);
            });
        }, 500);

    }
}
