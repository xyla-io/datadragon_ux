import {Inject, Injectable} from '@angular/core';

import * as PlotlyType from "plotly.js"
declare global {
  const Plotly: typeof PlotlyType;
}

@Injectable()
export class PlotlyService {

  constructor(@Inject("PlotlyLibrary") public Plotly: typeof PlotlyType) { }

}

export function PlotlyLibraryFactory() {
  return Plotly;
}
