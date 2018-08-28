import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TreeComponent, TREE_ACTIONS, IActionMapping } from "angular-tree-component";
import { Observable } from "rxjs";
import { ConstantService,OrgUnitService } from "../services";

@Component({
  selector: 'app-org-unit-limited',
  templateUrl: './org-unit-limited.component.html',
  styleUrls: ['./org-unit-limited.component.css']
})
export class OrgUnitLimitedComponent implements OnInit {
/** Part of source code borrowed from Kelvin, HISP Tanzania **/
  // the object that will carry the output value you can send one from outside to config start values
  @Input() orgunit_model: any =  {
    selection_mode: "Usr_orgUnit",
    selected_level: "",
    selected_group: "",
    orgUnitLevels: [],
    orgunit_groups: [],
    selected_orgunits: [],
    user_orgunits: [],
    type:"report", // can be 'data_entry'
    selected_user_orgunit: "USER_ORGUNIT"
  };

  // The organisation unit configuration object This will have to come from outside.
  @Input() orgunit_tree_config: any = {
    show_search : true,
    search_text : 'Search',
    level: null,
    loading: true,
    show_update_button:true,
    loading_message: 'Loading Organisation units...',
    multiple: false,
    multiple_key:"none", //can be control or shift
    placeholder: "Select Organisation Unit"
  };

  @Output() onOrgUnitUpdate : EventEmitter<any> = new EventEmitter<any>();
  @Output() onOrgUnitInit : EventEmitter<any> = new EventEmitter<any>();
  @Output() orgunitready : EventEmitter<any> = new EventEmitter<any>();

  orgUnit: any = {};
  nodes: any[] = null;
  orgUnitLevels:any[] = [];
  @ViewChild('orgtree')
  orgtree: TreeComponent;

  organisationunits: any[] = [];
  selected_orgunits: any[] = [];

  // this variable controls the visibility of of the tree
  showOrgTree:boolean = true;

  customTemplateStringOrgunitOptions: any;
  constructor(
    private constantService: ConstantService,
    private orgUnitService: OrgUnitService,
  ) {
     if(!this.orgunit_tree_config.hasOwnProperty("multiple_key")){
       this.orgunit_tree_config.multiple_key = "none";
     }
  }

  updateModelOnSelect(data){
    if(!this.orgunit_model.show_update_button){
      this.onOrgUnitUpdate.emit({name: 'ou', value: data.id});
      this.displayOrgTree()
    }
  }

  ngOnInit() {
    if(this.orgunit_tree_config.multiple) {
      if(this.orgunit_tree_config.multiple_key == "none"){
        let actionMapping:IActionMapping = {
          mouse: {
            dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
            click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};

      }
      // multselect using control key
      else if(this.orgunit_tree_config.multiple_key == "control"){
        let actionMapping:IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.ctrlKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }
      // multselect using shift key
      else if(this.orgunit_tree_config.multiple_key == "shift"){
        let actionMapping:IActionMapping = {
          mouse: {
            click: (node, tree, $event) => {
              $event.shiftKey
                ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(node, tree, $event)
                : TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
            }
          }
        };
        this.customTemplateStringOrgunitOptions = {actionMapping};
      }

    }else{
      let actionMapping:IActionMapping = {                  
        mouse: {
          dblClick: TREE_ACTIONS.TOGGLE_EXPANDED,
          click: (node, tree, $event) => TREE_ACTIONS.TOGGLE_SELECTED(node, tree, $event)
        }
      };
      this.customTemplateStringOrgunitOptions = {actionMapping};
    }


    // if (this.orgUnitService.nodes == null) {
      this.orgUnitService.getOrgunitLevelsInformation()
        .subscribe(
          (data: any) => {
            // assign urgunit levels and groups to variables
            this.orgunit_model.orgUnitLevels = data.organisationUnitLevels;
            // setting organisation groups
            this.orgUnitService.getOrgunitGroups().subscribe( groups => {//noinspection TypeScriptUnresolvedVariable
              this.orgunit_model.orgunit_groups = groups;
            });
            // identify currently logged in usser
            this.orgUnitService.getUserInformation(this.orgunit_model.type).subscribe(
              userOrgunit => {
                //let level = this.orgUnitService.getUserHighestOrgUnitlevel( userOrgunit );
                let level: any = 1;
               
                this.orgunit_model.user_orgunits = this.orgUnitService.getUserOrgUnits( userOrgunit );
                this.orgUnitService.user_orgunits = this.orgUnitService.getUserOrgUnits( userOrgunit );
                if(this.orgunit_model.selection_mode == "Usr_orgUnit"){
                  this.orgunit_model.selected_orgunits = this.orgunit_model.user_orgunits;
                }
                let all_levels = data.pager.total;
                let orgunits = this.orgUnitService.getuserOrganisationUnitsWithHighestlevel( level, userOrgunit );
                //let use_level = parseInt(all_levels) - (parseInt(level) - 1);
                let use_level = 3;
                
                // this.orgunit_model.user_orgunits = orgunits;

                //load inital orgiunits to speed up loading speed
                this.orgUnitService.getInitialOrgunitsForTree(orgunits).subscribe(
                  (initial_data) => {
                    this.organisationunits = initial_data
                    this.orgunit_tree_config.loading = false;
                    // after done loading initial organisation units now load all organisation units
                    let fields = this.orgUnitService.generateUrlBasedOnLevels(use_level);
                    this.orgUnitService.getAllOrgunitsForTree1(fields, orgunits).subscribe(
                      items => {
                        this.organisationunits = items;
                        this.orgunitready.emit(true);
                        //activate organisation units
                        for (let active_orgunit of this.orgunit_model.selected_orgunits) {
                          this.activateNode(active_orgunit.id, this.orgtree);
                        }
                        this.prepareOrganisationUnitTree(this.organisationunits, 'parent');
                      },
                      error => {
                        console.error('something went wrong while fetching Organisation units');
                        this.orgunit_tree_config.loading = false;
                      }
                    )
                  },
                  error => {
                    console.error('something went wrong while fetching Organisation units');
                    this.orgunit_tree_config.loading = false;
                  }
                )

              }
            )
          }
        );
  }

  // display Orgunit Tree
  displayOrgTree(){
    this.showOrgTree = !this.showOrgTree;
  }

  hideTree(){
    this.showOrgTree = true;
  }

  activateNode(nodeId:any, nodes){
    setTimeout(() => {
      let node = nodes.treeModel.getNodeById(nodeId);
      if (node)
        node.setIsActive(true, true);
    }, 0);
  }

  // a method to activate the model
  deActivateNode(nodeId:any, nodes, event){
    setTimeout(() => {
      let node = nodes.treeModel.getNodeById(nodeId);
      if (node)
        node.setIsActive(false, true);
    }, 0);
    if( event != null){
      event.stopPropagation();
    }
  }

  // check if orgunit already exist in the orgunit display list
  checkOrgunitAvailabilty(orgunit, array): boolean{
    let checker = false;
    array.forEach((value) => {
      if( value.id == orgunit.id ){
        checker = true;
      }
    });
    return checker;
  }

  // action to be called when a tree item is deselected(Remove item in array of selected items
  deactivateOrg ( $event ) {
    if(this.orgunit_model.selection_mode == "Usr_orgUnit"){
      this.orgunit_model.selection_mode = "orgUnit";
    }
    this.orgunit_model.selected_orgunits.forEach((item,index) => {
      if( $event.node.data.id == item.id ) {
        this.orgunit_model.selected_orgunits.splice(index, 1);
      }
    });
  };

  // add item to array of selected items when item is selected
  activateOrg = ($event) => {
    if(this.orgunit_model.selection_mode == "Usr_orgUnit"){
      this.orgunit_model.selection_mode = "orgUnit";
    }
    this.selected_orgunits = [$event.node.data];
    if(!this.checkOrgunitAvailabilty($event.node.data, this.orgunit_model.selected_orgunits)){
      this.orgunit_model.selected_orgunits.push($event.node.data);
    }
    this.orgUnit = $event.node.data;
  };

  prepareOrganisationUnitTree(organisationUnit,type:string='top') {
    if (type == "top"){
      if (organisationUnit.children) {
        organisationUnit.children.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        organisationUnit.children.forEach((child) => {
          this.prepareOrganisationUnitTree(child,'top');
        })
      }
    }else{
      organisationUnit.forEach((orgunit) => {
        if (orgunit.children) {
          orgunit.children.sort((a, b) => {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });
          orgunit.children.forEach((child) => {
            this.prepareOrganisationUnitTree(child,'top');
          })
        }
      });
    }
  }

  updateOrgUnitModel() {
    this.displayOrgTree();
    this.onOrgUnitUpdate.emit({name: 'ou', value: this.getOrgUnitsForAnalytics(this.orgunit_model,false)});
  }

  // prepare a proper name for updating the organisation unit display area.
  getProperPreOrgunitName() : string{
    let name = "";
    if( this.orgunit_model.selection_mode == "Group" ){
      let use_value = this.orgunit_model.selected_group.split("-");
      for( let single_group of this.orgunit_model.orgunit_groups ){
        if ( single_group.id == use_value[1] ){
          name = single_group.name + " in";
        }
      }
    }else if( this.orgunit_model.selection_mode == "Usr_orgUnit" ){
      if( this.orgunit_model.selected_user_orgunit == "USER_ORGUNIT"){
        name = this.orgunit_model.user_orgunits[0].name;
      }
      if( this.orgunit_model.selected_user_orgunit == "USER_ORGUNIT_CHILDREN"){
        name = this.getOrgUnitName(this.orgunit_model.user_orgunits[0].id)+" sub-units";
      }
      if( this.orgunit_model.selected_user_orgunit == "USER_ORGUNIT_GRANDCHILDREN"){
        name = this.getOrgUnitName(this.orgunit_model.user_orgunits[0].id)+" sub-x2-units"
      }
    }else if( this.orgunit_model.selection_mode == "Level" ){
      let use_level = this.orgunit_model.selected_level.split("-");
      for( let single_level of this.orgunit_model.orgUnitLevels ){
        if ( single_level.level == use_level[1] ){
          name = single_level.name + " in";
        }
      }
    }else{
      name = "";
    }
    return name
  }

  // get user organisationunit name
  getOrgUnitName(id){
    let orgunit = this.orgtree.treeModel.getNodeById(id);
    return orgunit.name;
  }

  // a function to prepare a list of organisation units for analytics
  getOrgUnitsForAnalytics(orgunit_model:any, with_children:boolean): string{
    let orgUnits = [];
    let organisation_unit_analytics_string = "";
    // if the selected orgunit is user org unit
    if(orgunit_model.selection_mode == "Usr_orgUnit"){
      if(orgunit_model.user_orgunits.length == 1){
        let user_orgunit = this.orgtree.treeModel.getNodeById(orgunit_model.user_orgunits[0].id);
        orgUnits.push(user_orgunit.id);
        if(user_orgunit.hasOwnProperty('children') && with_children){
          for( let orgunit of user_orgunit.children ){
            orgUnits.push(orgunit.id);
          }
        }
      }else{
        organisation_unit_analytics_string += orgunit_model.selected_user_orgunit
      }
    }

    else{
      // if there is only one organisation unit selected
      if ( orgunit_model.selected_orgunits.length == 1 ){
        let detailed_orgunit = this.orgtree.treeModel.getNodeById(orgunit_model.selected_orgunits[0].id);
        orgUnits.push(detailed_orgunit.id);
        if(detailed_orgunit.hasOwnProperty('children') && with_children){
          for( let orgunit of detailed_orgunit.children ){
            orgUnits.push(orgunit.id);
          }
        }

      }
      // If there is more than one organisation unit selected
      else{
        orgunit_model.selected_orgunits.forEach((orgunit) => {
          orgUnits.push(orgunit.id);
        })
      }
      if(orgunit_model.selection_mode == "orgUnit"){

      }if(orgunit_model.selection_mode == "Level"){
        organisation_unit_analytics_string += orgunit_model.selected_level+";";
      }if(orgunit_model.selection_mode == "Group"){
        organisation_unit_analytics_string += orgunit_model.selected_group+";";
      }
    }

    return organisation_unit_analytics_string+orgUnits.join(";");
  }
  
}