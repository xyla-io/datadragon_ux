export interface CheshireTerm {
  search: string;
  term: string;
  priority: number;
  popularity?: number;
  iPhoneRank?: number;
  iPadRank?: number;
}

export interface CheshireTermsApp {
  appId?: number;
  appName: string;
}

export interface CheshireTermReport {
  rootTerm: string;
  progress: number;
  terms: CheshireTerm[];
}
