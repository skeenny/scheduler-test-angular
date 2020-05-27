import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { TasksComponent } from './components/tasks/tasks.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {    MatIconModule, MatFormFieldModule,
            MatInputModule, MatButtonModule,
            MatCheckboxModule, MatProgressSpinnerModule,
            MatChipsModule, MatMenuModule,
            MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulerService } from './services/scheduler.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    declarations: [
        AppComponent,
        SchedulerComponent,
        TasksComponent,
        CategoriesComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        HttpClientModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatChipsModule,
        MatMenuModule,
        MatSlideToggleModule
    ],
    providers: [
        SchedulerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
