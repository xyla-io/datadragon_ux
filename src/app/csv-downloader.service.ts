import {Injectable} from '@angular/core';
import * as json2csv from 'json2csv';
import * as fileSaver from 'file-saver';

@Injectable()
export class CsvDownloaderService {

  constructor() { }

  downloadCSV(filename, jsonData) {
    let csv = json2csv({
      data : jsonData,
      fields : Object.keys(jsonData[0])
    });
    let blob = new Blob([csv], {type: 'text/csv'});
    fileSaver.saveAs(blob, filename + '.csv');
  }

  downloadCSVString(filename, csv) {
    let blob = new Blob([csv], {type: 'text/csv'});
    fileSaver.saveAs(blob, filename + '.csv');
  }
}
