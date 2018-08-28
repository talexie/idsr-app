import { Injectable,Inject,forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';


import { ConstantService } from '../services';

@Injectable()
export class ProgramIndicatorsService {

  constructor( private http:HttpClient, private constant:ConstantService) {

   }
  // Get dataStores
  getDataStores (dataStore,key) {
    return this.http.get(this.constant.ROOTURL + 'api/dataStore/' +  dataStore + '/' + key + '.json');
  }

  /**
  	Get program Indicators from dataStores by disease
  **/
  getProgramIndicators(dataStores, disease){
  	if(!isNullOrUndefined(dataStores)){
  		for(let dataStore of dataStores){
  			if(!isNullOrUndefined(dataStore)){
  				if(dataStore.disease === disease){  					
  					return dataStore;
  				}
  			}
  		}
  	}
  }

  /**
  	Create array from Object Array
  **/
  createArrayFromObject(arrayObject){
  	let piArray: any = [];
  	for (let pi of arrayObject){
		piArray.push(pi.id);
	}
	return piArray;
  }


  /**
   Get analytics data for a given disease given a set of indicators
  var piFields = ';
  
  **/
  getAnalyticsData(piIndicators,ou,period){
  	let fields = 'dimension=dx:' + piIndicators + '&filter=pe:' + period + '&dimension=ou:' + ou + '&displayProperty=NAME&tableLayout=true&columns=dx&rows=ou&skipMeta=false&showHierarchy=true';
  	return this.http.get(this.constant.ROOTURL + 'api/analytics.json?' + fields);
  }
  /**
  Get epi data for epi curve

  **/
  getAnalyticsDataForEpiCurve(piIndicators,ou,periods,periodType){   
 
    let fields = 'dimension=dx:' + piIndicators + '&dimension=pe:' + periods + '&filter=ou:' + ou + '&displayProperty=NAME&outputIdScheme=UID';
    return this.http.get(this.constant.ROOTURL + 'api/27/analytics.json?' + fields);
  }
  /** 
   Period Generator
  **/
  generatePeriods(startDate,endDate,periodType){
    let periods: any = [];
    if(periodType === 'weekly'){
      console.log("Not implemented");
    }
    else{
      let start = moment(startDate);
      endDate = moment(endDate);
      let diff = endDate.diff(startDate, 'days');

        if(!startDate.isValid() || !endDate.isValid() || diff <= 0) {
            periods.push(moment(start).format("YYYYMMDD"));
        }
        else{
           for(let i = 0; i < diff; i++) {
              periods.push(start.add(1,'d').format('YYYYMMDD'));
          }
        }    
    }
    return periods;
  }
  createEpiCurveData(data,piIndicators,periods){
    let chartObject: any = {
      "categories":[],
      "dataset":[]
    };
    let allcases = [];
    let categories = [];
    let confirmed = [];
    let deaths = [];
    let suspected = [];
    let suspectedandconfirmed = [];
    if(!isNullOrUndefined(data)){
      for(let period of periods){
        for(let value of data){        
          if(value[0] === piIndicators[0]){
            if(period === value[1]){
              confirmed.push({ "value": parseInt(value[2])});
            }
            else{
              confirmed.push({ "value": 0});
            }
          }
          else if(value[0] === piIndicators[1]){
            if(period === value[1]){
              deaths.push({ "value": parseInt(value[2])});
            }
            else{
              deaths.push({ "value": 0});
            }
          }
          else if(value[0] === piIndicators[2]){
            if(period === value[1]){
              suspected.push({ "value": parseInt(value[2])});
            }
            else{
              suspected.push({ "value": 0});
            }
          }
          else{

          }
        }
      }
    }
    //fusion charts structure
    allcases.push({ "seriesname": "Confirmed","data": confirmed });
    allcases.push({ "seriesname": "Suspected","data": suspected });
    allcases.push({ "seriesname": "Deaths","data": deaths });

    chartObject.categories = this.generateSeriesCategories(periods);
    chartObject.dataset = allcases;
    return chartObject;       
  }
  /**
   Get epidemic codes
  **/
  getEpiCode(epidemics,disease){
  	let epiArray:any = [];
  	if(!isNullOrUndefined(epidemics)){
  		for(let epidemic of epidemics){
        if(epidemic.disease === disease){
          let endDate: any = "";
          if(!isNullOrUndefined(epidemic.endDate) && epidemic.endDate !==""){
             endDate = moment(epidemic.endDate).format("DD-MM-YYYY");
          }
          else{
            endDate = moment().format("DD-MM-YYYY");
          }           
          epiArray.push({"epicode": epidemic.epicode,"endDate":endDate,"startDate":moment(epidemic.firstCaseDate).format("DD-MM-YYYY"),"orgUnit": epidemic.orgUnit,"orgUnitName": epidemic.orgUnitName,"status": epidemic.active,"disease": epidemic.disease,"firstCaseDate":epidemic.firstCaseDate,"lastCaseDate":epidemic.lastCaseDate});
        }
  		}
  	}
  	return this.removeDuplicates(epiArray);
  }
  /**
   Generate categories from periods
  **/
  generateSeriesCategories(periods){
    let seriesCategories: any = [];
    if(!isNullOrUndefined(periods)){
      for(let period of periods){
        seriesCategories.push({ "label": moment(period).format("YYYY-MM-DD") });
      }
    }
    return seriesCategories;
  }
  /**
   Remove duplicates from array
  **/
  removeDuplicates(arr){
  	let noDup:any = [];
    if(!isNullOrUndefined(arr)){
      arr.forEach(function(d) {
          var found = false;
          noDup.forEach(function(u) {
              if(u.epicode == d.epicode) {
                  found = true;
              }
          });
          if(!found) {
              noDup.push(d);
          }
      });
    }
  	return noDup;
  }

  /**
   Construct the table result
  **/

  displayAnalyticsEpidemics(data,indicators,orgUnit,headerdata,outbreak){


  	let tableData:any = [];

  	if(!isNullOrUndefined(data) && !isNullOrUndefined(indicators) && !isNullOrUndefined(outbreak)){


  		for(let d of data){

  			let tableRow:any = { };
  			tableRow.headers = [];
  			tableRow.headers.push({"title":"Outbreak ID","value": outbreak.epicode });
  			tableRow.headers.push({"title":"Disease","value": outbreak.disease });
  			tableRow.headers.push({"title":"Date first case reported","value": outbreak.startDate });
  			tableRow.headers.push({"title":"Date closed","value": outbreak.endDate });
  			tableRow.headers.push({"title":"Date confirmed","value": moment(outbreak.firstCaseDate).format("DD-MM-YYYY") });
        tableRow.headers.push({"title":"Facility reporting","value": orgUnit.name,"row":true });
          if(orgUnit.ancestors.length === 4){
            
            tableRow.headers.push({"title":"Sector/Subcounty","value":orgUnit.ancestors[3].name,"row":true });
            tableRow.headers.push({"title":"District","value": orgUnit.ancestors[2].name,"row":true});
          }
          else if(orgUnit.ancestors.length === 3){
            
            tableRow.headers.push({"title":"Sector/Subcounty","value":orgUnit.ancestors[2].name,"row":true });
            tableRow.headers.push({"title":"District","value": orgUnit.ancestors[1].name,"row":true});
          }
          else if(orgUnit.ancestors.length === 2){
            
            tableRow.headers.push({"title":"Sector/Subcounty","value":orgUnit.ancestors[1].name,"row":true });
            tableRow.headers.push({"title":"District","value": orgUnit.ancestors[0].name,"row":true});
          }
          else if(orgUnit.ancestors.length === 5){
            
            tableRow.headers.push({"title":"Sector/Subcounty","value":orgUnit.ancestors[4].name,"row":true });
            tableRow.headers.push({"title":"District Hospital","value": orgUnit.ancestors[3].name,"row":true});
            tableRow.headers.push({"title":"District","value": orgUnit.ancestors[2].name,"row":true});
          }
          else if(orgUnit.ancestors.length === 1){
            tableRow.headers.push({"title":"Sector/Subcounty","value": orgUnit.ancestors[0].name,"row":true});
            tableRow.headers.push({"title":"District","value": "","row":true});
          }
          else{
            tableRow.headers.push({"title":"Sector/Subcounty","value": ""});
            tableRow.headers.push({"title":"District","value": ""});
          }
  			let counterI = 0;
  			tableRow.dataValues = [];
  			for(let i of indicators){
          if(i.admissionDate){
            tableRow.dataValues.push({"admissionDate": true,"title": i.name,"description":i.description,"value": d[headerdata + counterI]==""?0:parseInt(d[headerdata + counterI])});  
          }
          else if(i.dischargeDate){
            tableRow.dataValues.push({"dischargeDate": true,"title": i.name,"description":i.description,"value": d[headerdata + counterI]==""?0:parseInt(d[headerdata + counterI])});  
          }
          else{
            tableRow.dataValues.push({"title": i.name,"description":i.description,"value": d[headerdata + counterI]==""?0:parseInt(d[headerdata + counterI])});  
          }
  								
  				counterI++;
  			}
  			tableData.push(tableRow);
   		}
  	}
  	else{
  		console.log("Failed to get data");
  	}
  	return tableData;
  }

}
