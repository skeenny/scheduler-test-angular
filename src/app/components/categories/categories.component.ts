import { Component, OnInit } from '@angular/core';
import { SchedulerService } from '../../services/scheduler.service';
import { ICategory } from 'src/app/interfaces/scheduler';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent implements OnInit {
    public isLoadingCategories: boolean = false;
    public categories: ICategory[] = [];
    public categoryText: string = '';
    constructor(private schedulerService: SchedulerService,
        private router: Router) {
    }
    ngOnInit() {
        this.loadCategories((err?: Error) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

    loadCategories(cb?: (err?: Error) => void): void {
        this.isLoadingCategories = true;
        this.schedulerService.getCategories().subscribe((categories: ICategory[]) => {
            this.categories = categories;
            this.isLoadingCategories = false;
        }, (response: HttpErrorResponse) => {
            this.isLoadingCategories = false;
            if (cb) {
                cb(new Error(response.error.error));
            }
        });
    }

    createCategory(categoryText) {
        if (categoryText === "") {
            return;
        }
        this.schedulerService.addCategory({ title: categoryText }).then(() => {
            this.categoryText = '';
            this.loadCategories((err?: Error) => {
                if (err) {
                    console.log(err.message);
                }
            });
        }, (response: HttpErrorResponse) => {
            console.log(response.error.error);
        });
    }

    deleteCategory(id) {
        this.schedulerService.deleteCategory(id).then(() => {
            this.loadCategories((err?: Error) => {
                if (err) {
                    console.log(err.message);
                }
            });
        }, (response: HttpErrorResponse) => {
            console.log(response.error.error);
        });
    }

    goToScheduler() {
        this.router.navigate(['/scheduler']);
    }
}
