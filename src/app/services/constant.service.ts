import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
/**
 * Created by kelvin on 9/19/16.
 */
@Injectable()
export class ConstantService {
    ROOTURL: string = null;

    constructor( private http: HttpClient ){
<<<<<<< HEAD
      /*this.ROOTURL = '../../../../';*/
      this.ROOTURL = 'https://dev.hisprwanda.org/idsr/';
=======
      this.ROOTURL = '../../../../../';
>>>>>>> master
    }

  load() {
    return this.http.get("manifest.webapp");
  }

  handleError (error) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return errMsg;
  }


}
