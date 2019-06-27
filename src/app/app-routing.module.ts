import { NgModule } from '@angular/core';
import { Routes, RouterModule,PreloadAllModules } from '@angular/router';

import { OutbreakInventoryComponent } from './outbreak-inventory';
import { AppComponent } from './app.component';
import { AppNoContentComponent } from './app-no-content/app-no-content.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'outbreak-inventory',
    pathMatch: 'full'
  },
  {
    path: 'outbreak-inventory',
    children: [],
    component: OutbreakInventoryComponent
  },
  {
    path: 'epi-docs',
    children: [],
    component: OutbreakInventoryComponent
  },
  { path: '**', 
    component: AppNoContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, initialNavigation: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
