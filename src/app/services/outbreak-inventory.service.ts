import { Injectable, Inject, forwardRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from '../services';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';

@Injectable()
export class OutbreakInventoryService {

	  // constructor(private http: Http, @Inject(forwardRef(() => ConstantService)) constantService) { }
	constructor(private http: HttpClient, private constant: ConstantService) {

	 }

	getPrograms() {
		const fields = 'paging=false&fields=id,name,programType,programTrackedEntityAttributes[trackedEntityAttribute[id,name]],programStages[id,name,programStageDataElements[dataElement[id,name]]]';
	  	return this.http.get(this.constant.ROOTURL + 'api/programs.json?' + fields);
	}

	getDiseases() {
		const fields_diseases = 'fields=options[id,name]';
		return this.http.get(this.constant.ROOTURL + 'api/29/optionSets/ADQhuzGAauC.json?' + fields_diseases);
	}

	getTrackedEntityInstances(ou, program, programStartDate, programEndDate) {
		let fields = 'ou=' + ou + '&ouMode=DESCENDANTS&program=' + program + '&skipPaging=true';
		if (!isNullOrUndefined(programStartDate) && !isNullOrUndefined(programEndDate)) {
	
		if (!isNullOrUndefined(programStartDate) && !isNullOrUndefined(programEndDate)) {
			programEndDate = moment(programEndDate).format('YYYY-MM-DD');
			programStartDate = moment(programStartDate).format('YYYY-MM-DD');
			fields = fields + '&programStartDate=' + programStartDate + '&programEndDate=' + programEndDate;
		}
		
	  	return this.http.get(this.constant.ROOTURL + 'api/trackedEntityInstances/query.json?' + fields);
		}
	}


	// api/27/events.json?ouMode=ACCESSIBLE&trackedEntityInstance=pPOlRYW0XJB&skipPaging=true
	getEvents(ou, program, startDate, endDate) {
		let fields = 'ouMode=ACCESSIBLE&skipPaging=true&fields=dueDate,program,event,programStage,enrollment,enrollmentStatus,orgUnit,trackedEntityInstance,status,orgUnitName,eventDate,coordinate,dataValues[dataElement,value]&program=' + program + '&ou=' + ou;
		if (!isNullOrUndefined(startDate) && !isNullOrUndefined(endDate)) {
			startDate = moment(startDate).format('YYYY-MM-DD');
			endDate = moment(endDate).format('YYYY-MM-DD');
			fields = fields + '&startDate=' + startDate + '&endDate=' + endDate;
		}

	  	return this.http.get(this.constant.ROOTURL + 'api/events.json?' + fields);
	}
	getEventsByTrackedEntityInstance(trackedEntityInstances, events, programStages) {
		let mergedEventsAndTeis: any = [];
		if ((!isNullOrUndefined(trackedEntityInstances)) && (!isNullOrUndefined(events))) {
			for (const trackedEntityInstance of trackedEntityInstances) {
				for (const event of events) {
					if (trackedEntityInstance.instance === event.trackedEntityInstance ) {
						mergedEventsAndTeis.push(this.addTeiToEventData(trackedEntityInstance, event, programStages));
					}
				}
			}
		} else {
			mergedEventsAndTeis = trackedEntityInstances;
		}
		return mergedEventsAndTeis;
	}
	/**
		add data from selected programs stages
	**/
	addTeiToEventData(teiData, eventData, programStages ) {
		if (!isNullOrUndefined(eventData)) {
			for (const ps of programStages) {
				teiData[ps.id] = eventData[ps.id];
			}
		}
		return teiData;
	}

	getProgramStagesByProgram(programs, program) {
		let programStages: any = [];
		if (!isNullOrUndefined(programs)) {
			for (const program of programs) {
				if (program.id = program.id) {
					programStages = program.programStages;
				}
			}
		}
		return programStages;
	}
	getColumns(headers) {
		const columns: any = [];

		if (!isNullOrUndefined(headers)) {
			for (const header of headers) {
				const colHeader: any = {};

				if (header.name === 'instance') {
					// colHeader.prop = header.name;
					// colHeader.name = header.column;
				} else if (header.name === 'created') {
					// colHeader.prop = header.name;
					// colHeader.name = header.column;
				} else if (header.name === 'lastupdated') {
					// colHeader.prop = header.name;
					// colHeader.name = header.column;
				} else if (header.name === 'ou') {
					// colHeader.prop = header.name;
					// colHeader.name = header.column;
				} else if (header.name === 'te') {
					// colHeader.prop = header.name;
					// colHeader.name = header.column;
				} else if (header.name === 'inactive') {
					// colHeader.prop = header.name;
					// colHeader.name = header.column;
				} else {
					colHeader.prop = header.name;
					colHeader.name = header.column;
					colHeader.headerClass = 'datatable-header';
					columns.push(colHeader);
				}

			}
		}
		return columns;
	}
	getSingleEventColumns(programStage) {
		const columns: any = [
				{
					'prop':'event',
					'name': "Event",
					'headerClass':'datatable-header'
				},
				{
					'prop': "eventDate",
					'name': "Report Date",
					'headerClass': "datatable-header"
				},
				{
					'prop':'orgUnitName',
					'name': "Org Unit Name",
					'headerClass': "datatable-header"
				}
			];

		if (!isNullOrUndefined(programStage) && !isNullOrUndefined(programStage.programStageDataElements)) {
			for (const dataElement of programStage.programStageDataElements) {
				const colHeader: any = {};
				colHeader.prop = dataElement.dataElement.id;
				colHeader.name = dataElement.dataElement.name;
				colHeader.headerClass = 'datatable-header';
				columns.push(colHeader);
			}
		}
		return columns;
	}
	createColumnData(data) {
		const columnData: any = [];

		if ((!isNullOrUndefined(data.headers)) && (!isNullOrUndefined(data))) {
			if (!isNullOrUndefined(data.rows)) {
				for (const val of data.rows) {
					const colHeader: any = {};
					let count = 0;
					for (const header of data.headers) {
						colHeader[header.name] = val[count];
						count++;
					}
					columnData.push(colHeader);
				}
			}

		}
		return columnData;
	}
	/**
		Create program Stages column headings
	**/
	createProgramStageColumns(programStages, stage, header) {
		const columns: any = [];
		if (!isNullOrUndefined(programStages)) {
			for (const programStage of programStages) {
				const columnObject: any = {};
				columnObject.prop = programStage.id;
				columnObject.name = programStage.name;
				columnObject.width = (programStage.programStageDataElements.length * 150);
				// columnObject.headerClass = "is-program-stage";
				columnObject.cellTemplate = stage;
            	columnObject.headerTemplate = header;
				columns.push(columnObject);
			}
		}
		return columns;
	}
	/**
	  Add program to program stage columns
	**/
	mergeProgramAndProgramStageColumns(programColumns, stageColumns) {
		if (!isNullOrUndefined(stageColumns)) {
			for (const stageColumn of stageColumns) {
				programColumns.push(stageColumn);
			}
		}
		return programColumns;
	}
	/**
		Create program Stages Data Element column headings
	**/
	createProgramStageDataElementColumns(programStages, programStageId) {
		const columns: any = [];
		if ((!isNullOrUndefined(programStages)) ) {
			for (const programStage of programStages) {
				if (programStage.id === programStageId) {
					if (!isNullOrUndefined(programStage.programStageDataElements)) {
						for (const programStageDataElement of programStage.programStageDataElements) {
							const columnObject: any = {};
							columnObject.prop = programStageDataElement.dataElement.id;
							columnObject.name = programStageDataElement.dataElement.name;
							columns.push(columnObject);
						}
					}
				}

			}
		}
		return columns;
	}

	/**
	Filter events and arrange them by tracked Entity Instances and program Stages
	**/
	filterEventsByTrackedEntityInstance(events) {
		const eventsByTeis: any = [];
		const eventsByTeisCheck: any = [];
		if (!isNullOrUndefined(events)) {
			for (const event of events) {

				if ((eventsByTeisCheck.indexOf(event.trackedEntityInstance)) === -1) {
					eventsByTeisCheck.push(event.trackedEntityInstance);
					const tei: any = {};
					tei[event.programStage] = [];
					const programStageEvent: any = {};
					tei.trackedEntityInstance = event.trackedEntityInstance;
					tei.orgUnit = event.orgUnit;
					programStageEvent.event = event.event;
					programStageEvent.status = event.status;
					programStageEvent.eventDate = event.eventDate;
					tei[event.programStage].push(this.createObjectFromArrayDataValues(event.dataValues, programStageEvent));
					eventsByTeis.push(tei);
				} else {
					const teiExists: any  = this.filterByTrackedEntityInstance(eventsByTeis, event.trackedEntityInstance);
					for (const teiObject in teiExists) {
						if (teiObject === event.programStage) {
							const programStageEvent: any = {};
							programStageEvent.event = event.event;
							programStageEvent.status = event.status;
							programStageEvent.eventDate = event.eventDate;
							teiExists[event.programStage].push(this.createObjectFromArrayDataValues(event.dataValues, programStageEvent));

						} else {
							teiExists[event.programStage] = [];
							const programStageEvent: any = {};
							programStageEvent.event = event.event;
							programStageEvent.status = event.status;
							programStageEvent.eventDate = event.eventDate;
							teiExists[event.programStage].push(this.createObjectFromArrayDataValues(event.dataValues, programStageEvent));
						}
					}
				}
			}
		}
		return eventsByTeis;

	}
	/**
	Lookup the existing Tracked Entity Instance
	**/
	filterByTrackedEntityInstance(events, trackedEntityInstance) {
		let tei: any = {};
		if (!isNullOrUndefined(events)) {
			for (const event of events) {
				if (event.trackedEntityInstance === trackedEntityInstance) {
					tei = event;
				}
			}
		}
		return tei;
	}
	/**
	Lookup the existing program Stage
	**/
	filterByProgramStage(events, programStage) {
		let programStageValues: any = [];
		if (!isNullOrUndefined(events)) {
			for (const event of events) {
				if (event.programStage === programStage) {
					programStageValues = event[programStage];
				}
			}
		}
		return programStageValues;
	}
	/**
	Create Object from array
	**/
	createObjectFromArrayDataValues(arrayValues, oldObject) {
		const arrayObject: any = oldObject;
		if (!isNullOrUndefined(arrayValues)) {
			for (const arrayValue of arrayValues) {
				arrayObject[arrayValue.dataElement] = arrayValue.value;
			}
		}
		return arrayObject;
	}
	/**
	 Create data from singe event
	**/
	getSingleEventData(events) {
		const rows: any = [];
		if (!isNullOrUndefined(events)) {
			for (const event of events) {
				const eventObject: any = {};
				eventObject.event = event.event;
				eventObject.eventDate = event.eventDate;
				eventObject.orgUnit = event.orgUnit;
				eventObject.status = event.status;
				eventObject.orgUnitName = event.orgUnitName;

				// if () {
					
				// }
				rows.push(this.createObjectFromArrayDataValues(event.dataValues, eventObject));
			}
			
		}
		return rows;

	}

}

