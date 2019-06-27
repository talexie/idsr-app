import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,MatInputModule,MatSelectModule,MatDatepickerModule,MatRadioModule,MatOptionModule,MatFormFieldModule,MatNativeDateModule } from '@angular/material';
import 'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { TreeModule } from 'angular-tree-component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from './app.component';

import { OutbreakInventoryComponent } from './outbreak-inventory/outbreak-inventory.component';
import { OutbreakInventoryService, ProgramIndicatorsService, ConstantService, OrgUnitService } from './services';
import { AppNoContentComponent } from './app-no-content/app-no-content.component';
import { OrgUnitComponent } from './org-unit/org-unit.component';
import { OrgUnitLimitedComponent } from './org-unit-limited/org-unit-limited.component';

import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [
    AppComponent,
    OutbreakInventoryComponent,
    AppNoContentComponent,
    OrgUnitComponent,
    OrgUnitLimitedComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,MatInputModule,MatSelectModule,MatDatepickerModule,MatRadioModule,MatOptionModule,MatFormFieldModule,MatNativeDateModule,
    TreeModule.forRoot(),
    NgxDatatableModule,
    HighchartsChartModule
  ],
  providers: [OutbreakInventoryService, ProgramIndicatorsService, ConstantService, OrgUnitService],
  bootstrap: [AppComponent]
})
export class AppModule { }
