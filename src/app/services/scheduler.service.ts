import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ITask, ICategory } from '../interfaces/scheduler';

@Injectable({
    providedIn: 'root'
})
export class SchedulerService {

    constructor(private http: HttpClient) {
    }

    getTasks(sorting = null, categories: number[] = []) {
        let categoryQuery = '';
        if (categories.length > 0) {
            categoryQuery = '&categories_like=';
            categories.map((category, index) => {
                categoryQuery = categoryQuery + category
                if (index !== categories.length - 1) {
                    categoryQuery = categoryQuery + ',';
                }
            });
        }
        return this.http.get(environment.baseUrl + `tasks?${sorting ? '&_sort=' + sorting[0] + '&_order=' + sorting[1] : ''}${categoryQuery}`);
    }

    addTask(task: ITask) {
        return this.http.post<ITask>(environment.baseUrl + 'tasks', task).toPromise();
    }

    deleteTask(taskId: number) {
        return this.http.delete(environment.baseUrl + `tasks/${taskId}`).toPromise();
    }

    updateTask(taskId: number, task: ITask) {
        return this.http.put(environment.baseUrl + `tasks/${taskId}`, task).toPromise();
    }

    completeAllTasks(tasks: ITask[]) {
        return this.http.put(environment.baseUrl + 'tasks', tasks).toPromise();
    }

    getCategories() {
        return this.http.get(environment.baseUrl + 'categories');
    }

    addCategory(category: ICategory) {
        return this.http.post<ICategory>(environment.baseUrl + 'categories', category).toPromise();
    }

    deleteCategory(categoryId: number) {
        return this.http.delete<ICategory>(environment.baseUrl + `categories/${categoryId}`).toPromise();
    }
}
