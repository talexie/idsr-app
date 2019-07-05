import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { MatSelect, MatButton, MatTable, MatDatepicker } from '@angular/material';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';
import { TreeComponent, TREE_ACTIONS, IActionMapping } from "angular-tree-component";

import { ProgramIndicatorsService,OrgUnitService, OutbreakInventoryService, ConstantService } from '../services';
import { OrgUnitComponent } from "../org-unit";
import { OrgUnitLimitedComponent } from "../org-unit-limited";
import * as Highcharts from 'highcharts';

// import { CsvModule } from '@ctrl/ngx-csv';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { ColumnsDialogComponent } from '../columns-dialog/columns-dialog.component';

/*Export Dependencies*/
import { ExportToCsv } from 'export-to-csv';

<<<<<<< HEAD
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

=======
>>>>>>> 96e9859d64dc67806175ae2e4ce4b94692a4cf0f


@Component({
  selector: 'app-outbreak-inventory',
  templateUrl: './outbreak-inventory.component.html',
  styleUrls: ['./outbreak-inventory.component.css'],
  providers: [OrgUnitService, ProgramIndicatorsService,OutbreakInventoryService, ConstantService]
})



export class OutbreakInventoryComponent implements OnInit, AfterViewInit {

  outbreakInventoryForm: FormGroup;
  selectForm: FormGroup;
  outbreakEpiCurveForm: FormGroup;
  selectEpiCurveForm: FormGroup;
  outbreakLineListingForm: FormGroup;
  post:any;                     // A property for our submitted form
  disease:string = '';
  outbreaks:any = [];
  programIndicators: any = [];
  dataStores: any = [];
  programs: any = [];
  programStages: any = [];
  selectedProgramStages:any = [];
  epidemics: any = [];
  dataStore: string = 'ugxzr_idsr_app';
  diseaseProgramIndicators: any = [];
  programIndicatorData: any = [];
  data: any = [];
  choices: any = [];
  periodTypes: any = [];
  trackedEntityInstances: any = [];
  events: any = [];
  beginEndDate = moment().format('YYYY-MM-DD');
  beginStartDate = moment(moment().subtract(30,'days')).format('YYYY-MM-DD');
  rows:any = [];
  columns: any = [];
  toggleColumns: any = [];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;
  firstCaseDate: any = "";
  lastCaseDate: any = "";
  epiChartData: any = [];
  selectedType: any = "epiCurve";
  selectedChoice: string;
  selectedProgramType: string = "";
  // Highcharts
  Highcharts: typeof Highcharts= Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  options: any = {
    chart: {
      type: 'column',
      height: 700,
      renderTo:''
    },
    title: {
      text: 'epiCurve'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories:[],
      title:{
        text:'',
        enabled: true
      }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            enabled:true
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: 'gray'
            }
        }
    },
    legend: {
      align: 'right',
      x: -30,
      verticalAlign: 'top',
      y: 25,
      floating: true,
      backgroundColor:'white',
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
                color:'white'
            }
        }
    },
    series: [
      {
        name: 'Confirmed',
        data: [0,2,3,5,6,8]
      },
      {
        name: 'Suspected',
        data: [0,2,3,5,6,8]
      },
      {
        name: 'Deaths',
        data: [0,2,3,5,6,8]
      }
    ]
  }

  chart:any;
  updateFlag:boolean = true; // optional boolean
  oneToOneFlag:boolean = true; // optional boolean, defaults to false

  @ViewChild('ouTree',{static: false})
  orgTree:OrgUnitComponent;

  @ViewChild('ouTreeOutbreaks',{static: false})
  orgTreeOutbreaks:OrgUnitLimitedComponent;

  @ViewChild('pgStages',{static: false}) pgStages: TemplateRef<any>;
  @ViewChild('pgStagesHeader',{static: false}) pgStagesHeader: TemplateRef<any>;


  constructor(
    private fb: FormBuilder,private piService: ProgramIndicatorsService,private orgUnitService: OrgUnitService,private outbreakInventoryService: OutbreakInventoryService) {

    this.outbreakInventoryForm = fb.group({
      'disease' : [null, Validators.required],
      'location' : [null, Validators.required],
      'epidemic' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
    });

    this.selectedChoice = 'epiCurve';
    this.selectedType = "epiCurve";


    this.selectEpiCurveForm = fb.group({
      'selectedPeriodType' : [null, Validators.required],
    });

    this.outbreakLineListingForm = fb.group({
      'orgUnit' : [null, Validators.required],
      'program' : [null, Validators.required],
      'programStages' : [null, Validators.required],
      'programStartDate' : [null, Validators.required],
      'programEndDate' : [null, Validators.required],
      'disease' : [null, Validators.required],
      'outbreak' : [null, Validators.required],
      'column' : [null, Validators.required],
    });
    this.outbreakEpiCurveForm = fb.group({
      'epiCurveDisease' : [null, Validators.required],
      'selectedPeriodType': [null, Validators.required],
      'epiCurveEpidemic' : [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])],
    });


    this.periodTypes = [
    {
      'name':'Weekly',
      'id':'weekly',
      'checked':false
    },
    {
      'name':'Daily',
      'id':'daily',
      'checked':true
    }];

    this.choices = [
    {
      'name':'Outbreak Report',
      'id':'outbreakReport',
      'prop':"Outbreaks"
    },
    {
      'name':'epi Curve',
      'id':'epiCurve',
      'prop':"epiCurve"
    },
    {
      'name':'Line Listing',
      'id':'lineListing',
      'prop':"Listing"
    },
    {
      'name':'Epi Docs',
      'id':'epiDocs',
      'prop':'epiDocs'
    }];
  }
  ngOnInit() {
    	this.piService.getDataStores(this.dataStore, 'diseases').subscribe((dataStoreValues:any) =>{
    		this.dataStores = dataStoreValues.diseases;

    	});
      this.outbreakInventoryService.getPrograms().subscribe((programValues:any) => {
        this.programs = programValues.programs;
      });

  }

  ngAfterViewInit(){

  }
  // Demonstrate chart instance
  getChartInstance(chart: Highcharts.Chart) {
    this.chart = chart;
    this.drawEpiCurve(this.chart);
  }
  getEpidemics(disease) {
  	this.piService.getDataStores(this.dataStore, 'epidemics').subscribe( (epiStoreValues:any) =>{
    		this.epidemics = epiStoreValues;
    		this.outbreaks = this.piService.getEpiCode(this.epidemics,disease);
        this.epiChartData = [];
        this.programIndicatorData = [];

    	});
  }
  getIndicatorDiseaseData(dataStoreValues, disease,outbreak){
    let orgUnitOutbreaks:any = this.orgTreeOutbreaks.orgUnit.id;
  	this.programIndicators = this.piService.getProgramIndicators(dataStoreValues,disease);
  	this.diseaseProgramIndicators = this.piService.createArrayFromObject(this.programIndicators.programOutbreakIndicators);
  	// Query analytics to return report
  	let period = 'LAST_12_MONTHS';

  	//let ou = 'QYiQ2KqgCxj';
    if(!isNullOrUndefined(outbreak)){
      let ou = outbreak.orgUnit;
      this.firstCaseDate = moment(outbreak.firstCaseDate).format("DD-MM-YYYY");
      this.lastCaseDate = moment(outbreak.lastCaseDate).format("DD-MM-YYYY");
      //let ou = outbreak.reportingOrgUnit;

      let outbreakInds: any = this.diseaseProgramIndicators.join(';');
    	this.piService.getAnalyticsData(outbreakInds,ou,period).subscribe((analyticsData:any) =>{
        if(!isNullOrUndefined(analyticsData.headers) && !isNullOrUndefined(this.programIndicators.programOutbreakIndicators)){
          let headerdata:number = 0;
          headerdata = analyticsData.headers.length - this.programIndicators.programOutbreakIndicators.length;
          //ou = analyticsData.rows[0][headerdata - 4]
          this.orgUnitService.getOrgUnitParents(ou).subscribe( (orgUnit:any) => {
            this.programIndicatorData = this.piService.displayAnalyticsEpidemics(analyticsData.rows,this.programIndicators.programOutbreakIndicators,orgUnit,headerdata,outbreak);

          });
        }

    	});
    }
    else{
      this.programIndicatorData = [];
    }
    return this.programIndicatorData;
  }

  drawEpiCurve(chart:Highcharts.Chart){

    //let orgUnitOutbreaks:any = this.orgTreeOutbreaks.orgUnit.id;
    if(!isNullOrUndefined(this.outbreakEpiCurveForm.value.epiCurveDisease)){
      let disease: any = this.outbreakEpiCurveForm.value.epiCurveDisease;
      this.programIndicators = this.piService.getProgramIndicators(this.dataStores,disease);
      this.diseaseProgramIndicators = this.piService.createArrayFromObject(this.programIndicators.programIndicators);
      if(!isNullOrUndefined(this.outbreakEpiCurveForm.value.epiCurveEpidemic)){
        let outbreak = this.outbreakEpiCurveForm.value.epiCurveEpidemic;
        let ou = outbreak.orgUnit;
        let ouName = outbreak.orgUnitName;
        let periodType = this.outbreakEpiCurveForm.value.selectedPeriodType;
        let outbreakInds: any = this.diseaseProgramIndicators.join(';');
        let startDate: any = moment(outbreak.firstCaseDate);
        let endDate: any = outbreak.endDate;
        if(!isNullOrUndefined(endDate)){
          endDate = moment().add(1,'days').format("YYYY-MM-DD");
        }
        else{
          endDate = moment(outbreak.endDate);
        }
        if(isNullOrUndefined(periodType)){
          periodType = 'daily';
        }
        let period: any = this.piService.generatePeriods(startDate,endDate,periodType);
        let periods: any = period.join(';');
        this.piService.getAnalyticsDataForEpiCurve(outbreakInds,ou,periods,periodType).subscribe((analyticsData:any) =>{
          if(!isNullOrUndefined(analyticsData.rows) && !isNullOrUndefined(this.programIndicators.programIndicators)){
              this.options.title = "epi Curve: " + outbreak.disease + " in " + ouName
              this.options.xAxis.title.text = "Period ( "+ periodType + " )"
              if(periodType === 'daily'){

                 this.epiChartData = this.piService.createEpiCurveData(analyticsData.rows, this.diseaseProgramIndicators,period);

                 this.chart.xAxis.categories=this.epiChartData.categories;
                 //this.options.series = this.epiChartData.data;
                 this.chart.series[0].setData(this.epiChartData.data[0]);
                 this.chart.series[1].setData(this.epiChartData.data[1]);
                 this.chart.series[2].setData(this.epiChartData.data[2]);
                 /*
                 if (this.chart) {
                      this.chart.addSeries(o.json(), true)
                 }
                 */
              }
              else{
                 this.epiChartData = this.piService.createEpiCurveData(analyticsData.rows, this.diseaseProgramIndicators,period);
                this.chart.xAxis.categories=this.epiChartData.categories;
                //this.options.series =this.epiChartData.data;
                this.chart.series[0].setData(this.epiChartData.data[0]);
                this.chart.series[1].setData(this.epiChartData.data[1]);
                this.chart.series[2].setData(this.epiChartData.data[2]);

              }
          }
          else{
            this.epiChartData = [];
          }

        });
      }
      else{
        console.log("Select the outbreak/epidemic");
        this.epiChartData = [];
      }
    }
    else{
      console.log("Please select the disease");
      this.epiChartData = [];
    }
    this.updateFlag = true
    this.chart.redraw();
    return this.chart;
  }

  getProgramStages(program){
    this.programStages = program.programStages;
    let programType: any = this.outbreakLineListingForm.value.program.programType;
    this.selectedProgramType = programType;
    if(this.selectedProgramType === "WITHOUT_REGISTRATION"){
      this.getLineListingReport();
    }
   return this.programStages;
  }

  setReportType(event){
    this.selectedType = "";
    this.selectedType = event;
    this.selectedChoice = event;
    return this.selectedType;
  }

  getLineListingReport(){

      let orgUnit:any = this.orgTree.orgUnit.id;
      let program:any = this.outbreakLineListingForm.value.program;
      let programType: any = this.outbreakLineListingForm.value.program.programType;
      this.selectedProgramType = programType;

      let programStartDate: any = this.outbreakLineListingForm.value.programStartDate;
      let programEndDate:any  = this.outbreakLineListingForm.value.programEndDate;

      if(programType === "WITH_REGISTRATION"){
        this.selectedProgramStages = this.outbreakLineListingForm.value.programStages;
        this.outbreakInventoryService.getTrackedEntityInstances(orgUnit,program.id,programStartDate,programEndDate).subscribe( (teis:any) =>{

          this.trackedEntityInstances = this.outbreakInventoryService.createColumnData(teis);

          this.outbreakInventoryService.getEvents(orgUnit,program.id,programStartDate,programEndDate).subscribe( (evs:any) =>{
            this.events = evs.events;
            let eventsModified: any = this.outbreakInventoryService.filterEventsByTrackedEntityInstance(this.events);
            this.rows = this.outbreakInventoryService.getEventsByTrackedEntityInstance(this.trackedEntityInstances,eventsModified,this.selectedProgramStages);
            let programColumns = this.outbreakInventoryService.getColumns(teis.headers);
            let stageColumns  = this.outbreakInventoryService.createProgramStageColumns(this.selectedProgramStages,this.pgStages,this.pgStagesHeader);
            this.columns = this.outbreakInventoryService.mergeProgramAndProgramStageColumns(programColumns,stageColumns);
            setTimeout(() => { this.loadingIndicator = false; }, 1500);
            console.log("this rows",this.rows);
            console.log("this cols",this.columns);
          });
        });
      }
      else{
        this.selectedProgramStages = this.outbreakLineListingForm.value.program.programStages[0];
        this.outbreakInventoryService.getEvents(orgUnit,program.id,programStartDate,programEndDate).subscribe( (evs:any) =>{
          this.events = evs.events;
          this.rows = this.outbreakInventoryService.getSingleEventData(evs.events);
          this.columns = this.outbreakInventoryService.getSingleEventColumns(this.selectedProgramStages);
          setTimeout(() => { this.loadingIndicator = false; }, 1500);
        });
      }

  }

  rowDataToDisplay(){
    return this.rows;
  }



  // Remove or add some columns displayed in the table!
  toggle(column) {
    const isChecked = this.isChecked(column);

    if(isChecked) {
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

  getProgramStageColumns(programStages,programStageId){
      let selectedStageColumns = this.outbreakInventoryService.createProgramStageDataElementColumns(programStages,programStageId);
      return selectedStageColumns;
  }

  getRowClass(row) {
    return {
      'is-even': (row.$$index % 2) === 0
    };
  }

    datatableToCsv(){
      var my_data = this.rows;
      var my_new_data = this.columns;


       const options = {
          fieldSeparator: ',',
          filename: 'CSV Test File',
          quoteStrings: '"',
          decimalSeparator: '.',
          showLabels: true,
          showTitle: true,
          title: 'Testing file in CSV format from Angular Json data',
          useTextFile: false,
          useBom: true,
          useKeysAsHeaders: true
        };

        const csvExporter = new ExportToCsv(options);
        csvExporter.generateCsv(my_data);
    }


<<<<<<< HEAD
  // Download a Pdf file

  public downloadPdf(){
    return xepOnline.Formatter.Format('lineListingPdf', {render: 'download'});
  }
=======
    // Download a Pdf file
    
    public downloadPdf(){
      return xepOnline.Formatter.Format('lineListingPdf', {render: 'download'});
    }

    public downloadOutReport(){
          return xepOnline.Formatter.Format('outReport', {render: 'download'});
    }

    public printOutReport(){
          return xepOnline.Formatter.Format('outReport', {render: 'print'});
    }
>>>>>>> 96e9859d64dc67806175ae2e4ce4b94692a4cf0f



}
