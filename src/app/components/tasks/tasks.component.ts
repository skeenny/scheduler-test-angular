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
    public selectedCategories: number[] = [];
    constructor(private schedulerService: SchedulerService) {
    }

    isCategoryActive(category: ICategory, task: ITask) {
        let isCategoryActive = false;
        task.categories.map(id => {
            if (id === category.id) {
                isCategoryActive = true;
            }
        });
        return isCategoryActive;
    }
    switchCategory(categoryId, taskId) {
        this.tasks.map(task => {
            if (task.id === taskId) {
                let index = task.categories.indexOf(categoryId);
                if (index !== -1) {
                    task.categories.splice(index, 1);
                } else {
                    task.categories.push(categoryId);
                }
            }
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

    switchEditor(taskId: number, critical: boolean = false) {
        let input = <HTMLInputElement>document.getElementById('input-' + taskId);
        if (critical) {
            this.taskEditor = {
                isEditingTask: false,
                taskId: taskId
            }
            this.tasks.map(task => {
                if (task.id === this.taskEditor.taskId) {
                    input.value = task.description;
                }
            });
        }
        let editbtn = document.getElementById('editbtn-' + taskId);
        input.disabled = !input.disabled;
        if (!input.disabled) {
            input.focus();
            editbtn.className = editbtn.className.replace('disabled', 'enabled');
        } else {
            editbtn.className = editbtn.className.replace('enabled', 'disabled');
        }
    }

    completeEditing(task: ITask) {
        let input = <HTMLInputElement>document.getElementById('input-' + task.id);
        this.taskEditor = {
            isEditingTask: false,
            taskId: task.id
        }
        this.switchEditor(task.id);
        if (input.value === "") {
            this.switchEditor(task.id, true);
        }
        task.description = input.value;
        this.schedulerService.updateTask(task.id, task).then(() => {
            this.loadTasks.emit();
        }, (response: HttpErrorResponse) => {
            console.log(response.error.error);
        });
    }

    editTask(task: ITask) {
        let input = <HTMLInputElement>document.getElementById('input-' + task.id);
        if ((this.taskEditor.isEditingTask && this.taskEditor.taskId !== task.id) || !input.disabled) {
            this.switchEditor(this.taskEditor.taskId, true);
        } else {
            this.switchEditor(task.id);
            this.taskEditor = {
                isEditingTask: true,
                taskId: task.id
            }
        }
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
        this.switchEditor(id, true);
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
