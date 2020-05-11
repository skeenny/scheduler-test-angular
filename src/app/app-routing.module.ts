import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { CategoriesComponent } from './components/categories/categories.component';


const routes: Routes = [
    { path: '', redirectTo: 'scheduler', pathMatch: 'full' },
    { path: 'scheduler', component: SchedulerComponent },
    { path: 'categories', component: CategoriesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
