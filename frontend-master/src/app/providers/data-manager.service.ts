import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  public objEditorJson: any;

  constructor() { }

  setObjEditorJson(value: any) {
    this.objEditorJson = value;
  }

  getObjEditorJson(): any {
    return this.objEditorJson;
  }
}
