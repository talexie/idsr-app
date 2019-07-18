import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelect, MatButton, MatTable, MatDatepicker } from '@angular/material';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';
import { TreeComponent, TREE_ACTIONS, IActionMapping } from 'angular-tree-component';

import { ProgramIndicatorsService, OrgUnitService, OutbreakInventoryService, ConstantService } from '../services';
import { OrgUnitComponent } from '../org-unit';
import { OrgUnitLimitedComponent } from '../org-unit-limited';
import { Chart } from 'angular-highcharts';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

/*Export Dependencies*/
import { ExportToCsv } from 'export-to-csv';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-outbreak-inventory',
  templateUrl: './outbreak-inventory.component.html',
  styleUrls: ['./outbreak-inventory.component.css'],
  providers: [OrgUnitService, ProgramIndicatorsService, OutbreakInventoryService, ConstantService]
})


export class OutbreakInventoryComponent implements OnInit, AfterViewInit {

  searchTerm: String;

  outbreakInventoryForm: FormGroup;
  selectForm: FormGroup;
  outbreakEpiCurveForm: FormGroup;
  selectEpiCurveForm: FormGroup;
  outbreakLineListingForm: FormGroup;
  post: any;                     // A property for our submitted form
  disease = '';
  outbreaks: any = [];
  programIndicators: any = [];
  dataStores: any = [];
  programs: any = [];
  programStages: any = [];
  selectedProgramStages: any = [];
  epidemics: any = [];
  dataStore = 'ugxzr_idsr_app';
  diseaseProgramIndicators: any = [];
  programIndicatorData: any = [];
  data: any = [];
  choices: any = [];
  periodTypes: any = [];
  trackedEntityInstances: any = [];
  events: any = [];
  beginEndDate = moment().format('YYYY-MM-DD');
  beginStartDate = moment(moment().subtract(30, 'days')).format('YYYY-MM-DD');
  rows: any = [];
  columns: any = [];

  toggleColumns: any = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  firstCaseDate: any = "";
  lastCaseDate: any = "";

  allColumns: any = [];
  epiChartData: any = [];
  selectedType: any = 'epiCurve';
  selectedChoice: string;
  selectedProgramType = '';
  // Highcharts
  //Highcharts: typeof Highcharts = Highcharts; // required
  //chartConstructor = 'chart'; // optional string, defaults to 'chart'
  options = new Chart({
    chart: {
      type: 'column',
      height: 700,
      renderTo: ''
    },
    title: {
      text: 'epiCurve'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: [],
    },
    legend: {
      align: 'right',
      x: -30,
      verticalAlign: 'top',
      y: 25,
      floating: true,
      backgroundColor: 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true,
          color: 'white'
        }
      }
    },
    series: []
  });

  //chart: any;
  //updateFlag = false; // optional boolean
  //oneToOneFlag = true; // optional boolean, defaults to false

  @ViewChild('ouTree', { static: false })
  orgTree: OrgUnitComponent;

  @ViewChild('ouTreeOutbreaks', { static: false })
  orgTreeOutbreaks: OrgUnitLimitedComponent;

  @ViewChild('pgStages', { static: false }) pgStages: TemplateRef<any>;
  @ViewChild('pgStagesHeader', { static: false }) pgStagesHeader: TemplateRef<any>;

  temp = [];


  constructor(
    // tslint:disable-next-line: max-line-length
    private fb: FormBuilder, private piService: ProgramIndicatorsService, private orgUnitService: OrgUnitService, private outbreakInventoryService: OutbreakInventoryService) {

    this.outbreakInventoryForm = fb.group({
      'disease': [null, Validators.required],
      'location': [null, Validators.required],
      'epidemic': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
    });

    this.selectedChoice = 'epiCurve';
    this.selectedType = 'epiCurve';


    this.selectEpiCurveForm = fb.group({
      'selectedPeriodType': [null, Validators.required],
    });

    this.outbreakLineListingForm = fb.group({
      'orgUnit': [null, Validators.required],
      'program': [null, Validators.required],
      'programStages': [null, Validators.required],
      'programStartDate': [null, Validators.required],
      'programEndDate': [null, Validators.required],
      'disease': [null, Validators.required],
      'outbreak': [null, Validators.required],
      'column': [null, Validators.required],
    });
    this.outbreakEpiCurveForm = fb.group({
      'epiCurveDisease': [null, Validators.required],
      'selectedPeriodType': [null, Validators.required],
      'epiCurveEpidemic': [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
    });


    this.periodTypes = [
      {
        'name': 'Weekly',
        'id': 'weekly',
        'checked': false
      },
      {
        'name': 'Daily',
        'id': 'daily',
        'checked': true
      }];

    this.choices = [
      {
        'name': 'Outbreak Report',
        'id': 'outbreakReport',
        'prop': 'Outbreaks'
      },
      {
        'name': 'epi Curve',
        'id': 'epiCurve',
        'prop': 'epiCurve'
      },
      {
        'name': 'Line Listing',
        'id': 'lineListing',
        'prop': 'Listing'
      },
      {
        'name': 'Epi Docs',
        'id': 'epiDocs',
        'prop': 'epiDocs'
      }];
  }
  ngOnInit() {
    this.piService.getDataStores(this.dataStore, 'diseases').subscribe((dataStoreValues: any) => {
      this.dataStores = dataStoreValues;

    });
    this.piService.getDataStores(this.dataStore, 'epidemics').subscribe((epiStoreValues: any) => {
        this.epidemics = epiStoreValues;
    });
    this.outbreakInventoryService.getPrograms().subscribe((programValues: any) => {
      this.programs = programValues.programs;
    });
  }

  ngAfterViewInit() {

  }
  // Demonstrate chart instance
/*  getChartInstance(chart: Highcharts.Chart) {
    this.chart = chart;
    this.drawEpiCurve(this.chart);
  }*/
  getEpidemics(disease) {
    let selectedOrgUnit: any = this.orgTreeOutbreaks.orgUnit.id;
    this.orgUnitService.getOrgUnitChildren(selectedOrgUnit).subscribe((orgUnitChilds: any)=> {

      let filteredOutbreaks = this.piService.getEpiCode(this.epidemics, disease);
      this.outbreaks = this.piService.getEpiCodeWithOutbreaks(filteredOutbreaks,orgUnitChilds.organisationUnits);
      this.epiChartData = [];
      this.programIndicatorData = [];
    });
  }
  getIndicatorDiseaseData(dataStoreValues, disease, outbreak) {
    let orgUnitOutbreaks: any = this.orgTreeOutbreaks.orgUnit.id;
    this.programIndicators = this.piService.getProgramIndicators(dataStoreValues, disease);
    this.diseaseProgramIndicators = this.piService.createArrayFromObject(this.programIndicators.programOutbreakIndicators);
    // Query analytics to return report
    let period = 'LAST_12_MONTHS';

    // let ou = 'QYiQ2KqgCxj';
    if (!isNullOrUndefined(outbreak)) {
      let ou = outbreak.orgUnit;
      this.firstCaseDate = moment(outbreak.firstCaseDate).format('DD-MM-YYYY');
      this.lastCaseDate = moment(outbreak.lastCaseDate).format('DD-MM-YYYY');
      // let ou = outbreak.reportingOrgUnit;

      let outbreakInds: any = this.diseaseProgramIndicators.join(';');
      this.piService.getAnalyticsData(outbreakInds, ou, period).subscribe((analyticsData: any) => {
        if (!isNullOrUndefined(analyticsData.headers) && !isNullOrUndefined(this.programIndicators.programOutbreakIndicators)) {
          let headerdata = 0;
          headerdata = analyticsData.headers.length - this.programIndicators.programOutbreakIndicators.length;
          // ou = analyticsData.rows[0][headerdata - 4]
          this.orgUnitService.getOrgUnitParents(ou).subscribe((orgUnit: any) => {
            this.programIndicatorData = this.piService.displayAnalyticsEpidemics(analyticsData.rows, this.programIndicators.programOutbreakIndicators, orgUnit, headerdata, outbreak);

          });
        }

      });
    } else {
      this.programIndicatorData = [];
    }
    return this.programIndicatorData;
  }

  drawEpiCurve() {

    // let orgUnitOutbreaks:any = this.orgTreeOutbreaks.orgUnit.id;
    if (!isNullOrUndefined(this.outbreakEpiCurveForm.value.epiCurveDisease)) {
      let disease: any = this.outbreakEpiCurveForm.value.epiCurveDisease;

      this.programIndicators = this.piService.getProgramIndicators(this.dataStores.diseases, disease);

      this.programIndicators = this.piService.getProgramIndicators(this.dataStores, disease);

      this.diseaseProgramIndicators = this.piService.createArrayFromObject(this.programIndicators.programIndicators);
      if (!isNullOrUndefined(this.outbreakEpiCurveForm.value.epiCurveEpidemic)) {
        let outbreak = this.outbreakEpiCurveForm.value.epiCurveEpidemic;
        let ou = outbreak.orgUnit;
        let ouName = outbreak.orgUnitName;
        let periodType = this.outbreakEpiCurveForm.value.selectedPeriodType;
        let outbreakInds: any = this.diseaseProgramIndicators.join(';');
        let startDate: any = moment(outbreak.firstCaseDate);
        let endDate: any = outbreak.endDate;
        if (!isNullOrUndefined(endDate)) {
          endDate = moment().add(1, 'days').format('YYYY-MM-DD');
        } else {
          endDate = moment(outbreak.endDate);
        }
        if (isNullOrUndefined(periodType)) {
          periodType = 'daily';
        }
        let period: any = this.piService.generatePeriods(startDate, endDate, periodType);
        let periods: any = period.join(';');
        this.piService.getAnalyticsDataForEpiCurve(outbreakInds, ou, periods, periodType).subscribe((analyticsData: any) => {
          if (!isNullOrUndefined(analyticsData.rows) && !isNullOrUndefined(this.programIndicators.programIndicators)) {
          this.options.ref.setTitle({text: 'epi Curve: ' + outbreak.disease + ' in ' + ouName});
            //this.options.xAxis.title.text = 'Period ( ' + periodType + ' )'
            if (periodType === 'daily') {

              this.epiChartData = this.piService.createEpiCurveData(analyticsData.rows, this.diseaseProgramIndicators, period);
              this.options.ref.xAxis[0].setCategories(this.epiChartData.categories);
              console.log("data",this.epiChartData.data);
              // this.options.series = this.epiChartData.data;
              this.options.removeSeries(0);
              this.options.addSeries({name:'Confirmed',type:'column',data:this.epiChartData.data[0].data},true,false);
              this.options.removeSeries(1);
              this.options.addSeries({name:'Suspected',type:'column',data:this.epiChartData.data[1].data},true,false);
              this.options.removeSeries(2);
              this.options.addSeries({name:'Deaths',type:'column',data:this.epiChartData.data[2].data},true,false);
              /*
              if (this.chart) {
                   this.chart.addSeries(o.json(), true)
              }
              */
            }
            else {
              this.epiChartData = this.piService.createEpiCurveData(analyticsData.rows, this.diseaseProgramIndicators, period);
              this.options.ref.xAxis[0].setCategories(this.epiChartData.categories);
              this.options.addSeries({name:'Confirmed',type:'column',data:this.epiChartData.data[0].data},true,false);
              this.options.addSeries({name:'Suspected',type:'column',data:this.epiChartData.data[1].data},true,false);
              this.options.addSeries({name:'Deaths',type:'column',data:this.epiChartData.data[2].data},true,false);
            }
            //this.updateFlag = true
            //console.log(this.epiChartData.data[0]);
          }
          else {
            this.epiChartData = [];
          }

        });
      }
      else {
        console.log('Select the outbreak/epidemic');
        this.epiChartData = [];
      }
    }
    else {
      console.log('Please select the disease');
      this.epiChartData = [];
    }

    //this.chart.redraw();
    return this.options;
  }

  getProgramStages(program) {
    this.programStages = program.programStages;
    let programType: any = this.outbreakLineListingForm.value.program.programType;
    this.selectedProgramType = programType;
    if (this.selectedProgramType === 'WITHOUT_REGISTRATION') {
      this.getLineListingReport();
    }
    return this.programStages;
  }

  setReportType(event) {
    this.selectedType = '';
    this.selectedType = event;
    this.selectedChoice = event;
    return this.selectedType;
  }


  getLineListingReport() {

    let orgUnit: any = this.orgTree.orgUnit.id;
    let program: any = this.outbreakLineListingForm.value.program;
    let programType: any = this.outbreakLineListingForm.value.program.programType;
    this.selectedProgramType = programType;

    let programStartDate: any = this.outbreakLineListingForm.value.programStartDate;
    let programEndDate: any = this.outbreakLineListingForm.value.programEndDate;

    let selectedDiseases: any = this.outbreakLineListingForm.value.disease;


    // console.log(programStartDate);

    if (programType === 'WITH_REGISTRATION') {
      this.selectedProgramStages = this.outbreakLineListingForm.value.programStages;
      this.outbreakInventoryService.getTrackedEntityInstances(orgUnit, program.id, programStartDate, programEndDate).subscribe((teis: any) => {
        this.loadingIndicator = false;

        this.trackedEntityInstances = this.outbreakInventoryService.createColumnData(teis);

        this.outbreakInventoryService.getEvents(orgUnit, program.id, programStartDate, programEndDate).subscribe((evs: any) => {
          this.events = evs.events;
          let eventsModified: any = this.outbreakInventoryService.filterEventsByTrackedEntityInstance(this.events);

          let data = this.outbreakInventoryService.getEventsByTrackedEntityInstance(this.trackedEntityInstances, eventsModified, this.selectedProgramStages);
          this.rows = data;
          this.temp = [...data];

          this.rows = this.outbreakInventoryService.getEventsByTrackedEntityInstance(this.trackedEntityInstances, eventsModified, this.selectedProgramStages);

          let programColumns = this.outbreakInventoryService.getColumns(teis.headers);
          let stageColumns = this.outbreakInventoryService.createProgramStageColumns(this.selectedProgramStages, this.pgStages, this.pgStagesHeader);
          this.columns = this.outbreakInventoryService.mergeProgramAndProgramStageColumns(programColumns, stageColumns);
          this.allColumns = this.outbreakInventoryService.mergeProgramAndProgramStageColumns(programColumns, stageColumns);

        });
      });
    } else {
      this.selectedProgramStages = this.outbreakLineListingForm.value.program.programStages[0];
      this.outbreakInventoryService.getEvents(orgUnit, program.id, programStartDate, programEndDate).subscribe((evs: any) => {
        this.loadingIndicator = false;
        this.events = evs.events;
        let data = this.outbreakInventoryService.getSingleEventData(evs.events);
        this.rows = data;
        this.temp = [...data];
        this.columns = this.outbreakInventoryService.getSingleEventColumns(this.selectedProgramStages);
        this.allColumns = this.outbreakInventoryService.getSingleEventColumns(this.selectedProgramStages);
      });
    }
  }

  rowDataToDisplay() {
    return this.rows;
  }



  // Remove or add some columns displayed in the table!
  toggle(column) {
    let isChecked = this.isChecked(column);

    if (isChecked) {
      this.columns = this.columns.filter(c => {
        return c.name !== column.name;
      });
    } else {
      this.columns = [...this.columns, column];
    }
  }

  isChecked(column) {
    return this.columns.find(c => {
      return c.name === column.name;
    });
  }



  tableEvents(value: Event): void {
    if (value) {
      console.log(value);
    }
  }

  getProgramStageColumns(programStages, programStageId) {
    let selectedStageColumns = this.outbreakInventoryService.createProgramStageDataElementColumns(programStages, programStageId);
    return selectedStageColumns;
  }

  getRowClass(row) {
    return {
      'is-even': (row.$$index % 2) === 0
    };
  }


  datatableToCsv() {
    let my_data = this.rows;

    let options = {
      fieldSeparator: ',',
      filename: 'IDSR report in csv',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'Testing file in a CSV Format',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };

    let csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(my_data);
  }


  // Download a Pdf file

  public downloadPdf() {
    return xepOnline.Formatter.Format('downPdfFile', { render: 'download' });
  }


  public downloadOutReport() {
    return xepOnline.Formatter.Format('outReport', { render: 'download' });
  }

  public printOutReport() {
    return xepOnline.Formatter.Format('outReport', { render: 'print' });
  }

  // Filter diseases
  diseaseFilter(event) {
   //let val = event.target.value.toLowerCase();
   let diseaseColumn:any = ""
   let val = this.outbreakLineListingForm.value.disease;
   if(!isNullOrUndefined(val)){
     if(this.selectedProgramType === 'WITH_REGISTRATION'){
       diseaseColumn = this.dataStores.config.notificationProgram.disease.id;
     }
     else{
        diseaseColumn = this.dataStores.config.reportingProgram.disease.id;
     }
     // filter our data
     const temp = this.temp.filter(function(d) {
       for(let v of val){
         return (d[diseaseColumn]).indexOf(v) !== -1 || !v;
       }
     });

     // update the rows
     this.rows = temp;
     // Whenever the filter changes, always go back to the first page
     //this.table.offset = 0;
   }

 }
}




// Filter the diseases in the Line Listing Application
  updateFilter(event) {
      // let val = event.target.value.toLowerCase();

      // // filter our data
      // let temp = this.temp.filter(function(d) {
      //   return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      // });

      // // update the rows
      // this.rows = temp;
      // // Whenever the filter changes, always go back to the first page
      // this.table.offset = 0;
  }




}


