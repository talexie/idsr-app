import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,MatCheckboxModule,MatMenuModule,MatInputModule,MatSelectModule,MatDatepickerModule,MatRadioModule,MatOptionModule,MatFormFieldModule,MatNativeDateModule } from '@angular/material';

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

import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import { ColumnsDialogComponent } from './columns-dialog/columns-dialog.component';
import { DatatableComponent } from './datatable/datatable.component';

@NgModule({
  declarations: [
    AppComponent,
    OutbreakInventoryComponent,
    AppNoContentComponent,
    OrgUnitComponent,
    OrgUnitLimitedComponent,
    ColumnsDialogComponent,
    DatatableComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,MatCheckboxModule,MatMenuModule,MatInputModule,MatSelectModule,MatDatepickerModule,MatRadioModule,MatOptionModule,MatFormFieldModule,MatNativeDateModule,
    TreeModule.forRoot(),
    NgxDatatableModule,
    ChartModule,
  ],
  entryComponents: [
    ColumnsDialogComponent
  ],
  providers: [OutbreakInventoryService, ProgramIndicatorsService, ConstantService, OrgUnitService,{ provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting ] }],
  bootstrap: [AppComponent]
})

export class AppModule { }
