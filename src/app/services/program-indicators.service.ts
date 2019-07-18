import { Injectable,Inject,forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
      let startWeek = moment(startDate);
      let endWeek = moment(endDate);
      let noWeeks = endWeek.diff(startWeek,'weeks');
      if(noWeeks <= 0) {
        let weekNoq = moment(startWeek).format("GGGG") + 'W' + moment(startWeek).format("GG")
        periods.push(weekNoq);
      }
      else{
         for(let i = 0; i < noWeeks; i++) {
            let weekNoq1 = startWeek.add(i,'w').format("GGGG") + 'W' + startWeek.add(i,'w').format("GG")
            periods.push(weekNoq1);
        }
      }
    }
    else{
      let start = moment(startDate);
      endDate = moment(endDate);
      let diff = endDate.diff(startDate, 'days');

        if(diff <= 0) {
            periods.push(moment(start).format("YYYYMMDD"));
        }
        else{
           for(let n = 0; n < diff; n++) {
              periods.push(start.add(n,'d').format('YYYYMMDD'));
          }
        }
    }
    return periods;
  }
  createEpiCurveData(data,piIndicators,periods){
    let chartObject: any = {
      "categories":[],
      "data":[]
    };
    let allcases = [];
    let categories = [];
    let confirmed = [];
    let deaths = [];
    let suspected = [];
    let suspectedandconfirmed = [];
    if(!isNullOrUndefined(data)){
      let c = this.filterCases(data,piIndicators[0]);
      let s = this.filterCases(data,piIndicators[2]);
      let d = this.filterCases(data,piIndicators[1]);
      console.log("s",s);
      console.log("c",c);
      console.log("d",d);
      console.log("period",periods);
      for(let period of periods){
        for(let value of c){
          if(period === value[1]){
            confirmed.push([period,parseInt(value[2])]);
          }
          else{
            confirmed.push([period,0]);
          }
        }
        for(let value of s){
          if(period === value[1]){
            suspected.push([period,parseInt(value[2])]);
          }
          else{
            suspected.push([period,0]);
          }
        }
        for(let value of d){
          if(period === value[1]){
            deaths.push([period,parseInt(value[2])]);
          }
          else{
            deaths.push([period,0]);
          }
        }
      }
    }
    //Highcharts structure
    allcases.push({ "name": "Confirmed","data": confirmed });
    allcases.push({ "name": "Suspected","data": suspected });
    allcases.push({ "name": "Deaths","data": deaths });

    chartObject.categories = periods;
    chartObject.data = allcases;
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
   Get epidemic codes within an orgUnit
  **/
  getEpiCodeWithOutbreaks(epidemics,orgUnits){
    let epiArray:any = [];
    if(!isNullOrUndefined(epidemics)){
      for(let epidemic of epidemics){
        for(let orgUnit of orgUnits){
          if(epidemic.orgUnit === orgUnit.id){
            epiArray.push(epidemic)
          }
        }
      }
    }
    return epiArray;
  }
  /**
   Generate categories from periods
  **/
  generateSeriesCategories(periods){
    let seriesCategories: any = [];
    if(!isNullOrUndefined(periods)){
      for(let period of periods){
        seriesCategories.push(moment(period).format("YYYY-MM-DD"));
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
  Filter case by type
  **/
  filterCases(data,type){

    let cases = data.filter((d:any) => {
      return (d[0] === type)
    });
    return cases;
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
