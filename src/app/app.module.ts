import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {YoutubePlayerModule} from "ngx-youtube-player";
import {RouterModule, Routes} from "@angular/router";
import {HttpModule, XHRBackend, RequestOptions} from '@angular/http';
import {FormsModule, ReactiveFormsModule}from'@angular/forms';
import {BrowserAnimationsModule} from'@angular/platform-browser/animations';
import {MaterialModule} from "./material/material.module";
import {AppComponent} from'./app.component';

import {RuleService} from './services/rule.service';
import {RuleHistoryService} from "./services/rule-history.service";
import {CampaignService} from "./services/campaign.service";
import {AdgroupService} from "./services/adgroup.service";
import {UserService} from "./services/user.service";
import {SessionService} from "./services/session.service";

import {RulesComponent } from './rules/rules.component';
import {RulesListComponent} from "./rules-list/rules-list.component";
import {RuleDescriptionPipe} from "./pipes/rule-description.pipe";
import {MillisecondsPipe} from "./pipes/milliseconds.pipe";
import {AdgroupPipe} from './pipes/adgroup.pipe';
import {RuleHistoryComponent} from './rule-history/rule-history.component';
import {RuleHistoryDescriptionPipe} from './pipes/rule-history-description.pipe';
import {EditRuleDialogComponent} from './edit-rule-dialog/edit-rule-dialog.component';
import {EditRuleComponent} from "./edit-rule/edit-rule.component";
import { EditRuleConditionComponent } from './edit-rule-condition/edit-rule-condition.component';
import { EditRuleActionComponent } from './edit-rule-action/edit-rule-action.component';
import { EditRuleCruiseControlComponent } from './edit-rule-cruise-control/edit-rule-cruise-control.component';

import 'hammerjs';
import { RuleHistoryDialogComponent } from './rule-history-dialog/rule-history-dialog.component';
import { RuleTaskDescriptionPipe } from './pipes/rule-task-description.pipe';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import {SessionGuardService} from "./services/session-guard.service";
import {ApiService, ApiServiceFactory} from "./services/api.service";
import {NoSessionGuardService} from "./services/no-session-guard.service";
import {ApiErrorService} from "./services/api-error.service";
import { CertificatesListComponent } from './certificates-list/certificates-list.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { EditCertificateComponent } from './edit-certificate/edit-certificate.component';
import {CertificateService} from "./services/certificate.service";
import {NewRelicLibraryFactory, NewRelicService} from "./services/new-relic.service";
import { AdjustCredentialsComponent } from './adjust-credentials/adjust-credentials.component';
import { EditAdjustCredentialComponent } from './edit-adjust-credential/edit-adjust-credential.component';
import { AdjustCredentialsListComponent } from './adjust-credentials-list/adjust-credentials-list.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { EditCertificateDialogComponent } from './edit-certificate-dialog/edit-certificate-dialog.component';
import { CheshireTermsComponent } from './cheshire-terms/cheshire-terms.component';
import { EditCheshireTermComponent } from './edit-cheshire-term/edit-cheshire-term.component';
import { CheshireTermReportComponent } from './cheshire-term-report/cheshire-term-report.component';
import {CheshireTermsService} from "./services/cheshire-terms.service";
import {SocketService} from "./services/socket.service";
import { CheshireItunesconnectAnalyticsComponent } from './cheshire-itunesconnect-analytics/cheshire-itunesconnect-analytics.component';
import {CheshireItunesconnectService} from "./services/cheshire-itunesconnect.service";
import { EditCheshireItunesconnectAnalyticsComponent } from './edit-cheshire-itunesconnect-analytics/edit-cheshire-itunesconnect-analytics.component';
import {MobileactionService} from "./services/mobileaction.service";
import { SearchadsReportingComponent } from './searchads-reporting/searchads-reporting.component';
import {SearchadsReportService} from "./services/searchads-report.service";
import { EditSearchadsReportingComponent } from './edit-searchads-reporting/edit-searchads-reporting.component';
import { SearchadsReportingResultsComponent } from './searchads-reporting-results/searchads-reporting-results.component';
import {CsvDownloaderService} from "./csv-downloader.service";
import { RuleImpactDialogComponent } from './rule-impact-dialog/rule-impact-dialog.component';
import { RuleImpactComponent } from './rule-impact/rule-impact.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdjustRevenueReportComponent } from './adjust-revenue-report/adjust-revenue-report.component';
import { AdjustRevenueComponent } from './adjust-revenue/adjust-revenue.component';
import { EditAdjustRevenueComponent } from './edit-adjust-revenue/edit-adjust-revenue.component';
import {AdjustService} from "./services/adjust.service";
import { IntroComponent } from './intro/intro.component';
import { IntroPipe } from './pipes/intro.pipe';
import { GoogleadsCredentialsListComponent } from './googleads-credentials-list/googleads-credentials-list.component';
import { EditGoogleadsCredentialComponent } from './edit-googleads-credential/edit-googleads-credential.component';
import { GoogleadsCredentialsComponent } from './googleads-credentials/googleads-credentials.component';
import {GoogleadsService} from "./services/googleads.service";
import { GoogleadsReportingComponent } from './googleads-reporting/googleads-reporting.component';
import { EditGoogleadsReportingComponent } from './edit-googleads-reporting/edit-googleads-reporting.component';
import { GoogleadsReportingResultsComponent } from './googleads-reporting-results/googleads-reporting-results.component';
import {PlotlyLibraryFactory, PlotlyService} from "./services/plotly.service";
import { CredentialService } from './services/credential.service';
import { DisplayChannelPipe } from './pipes/display-channel.pipe';
import { NotificationService } from './services/notification.service';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { FilterableDropdownComponent } from './filterable-dropdown/filterable-dropdown.component';
import { SnapchatCredentialsComponent } from './snapchat-credentials/snapchat-credentials.component';
import { EditSnapchatCredentialComponent } from './edit-snapchat-credential/edit-snapchat-credential.component';
import { SnapchatCredentialsListComponent } from './snapchat-credentials-list/snapchat-credentials-list.component';
import { HourlyReportExportComponent } from './hourly-report-export/hourly-report-export.component';
import { SSOComponent } from './sso/sso.component';

const appRoutes: Routes = [{
  path: 'sso',
  component: SSOComponent,
},{
  path: 'searchads/rules',
  component: RulesComponent,
  canActivate: [SessionGuardService],
  data: { title: 'Rules' }
}, {
  path: 'searchads/reporting',
  component: SearchadsReportingComponent,
  canActivate: [SessionGuardService],
  data: { title: 'Search Ads Reporting' }
}, {
  path: 'credentials/apple',
  component: CertificatesComponent,
  canActivate: [SessionGuardService],
  data: { title: 'Apple Certificates' }
}, {
  path: 'adjust/credentials',
  component: AdjustCredentialsComponent,
  canActivate: [SessionGuardService],
  data: { title: 'Adjust Credentials' }
}, {
  path: 'adjust/revenue',
  component: AdjustRevenueComponent,
  canActivate: [SessionGuardService],
  data: { title: 'Revenue Report' }
}, {
  path: 'login-register',
  component: LoginRegisterComponent,
  canActivate: [NoSessionGuardService],
  data: { title: 'Login/Register' }
}, {
  path: 'reset-password/:id/:token',
  component: ResetPasswordComponent,
  canActivate: [NoSessionGuardService],
  data: { title: 'Reset Password' }
}, {
  path: '',
  redirectTo: '/login-register',
  pathMatch: 'full'
}, {
  path: 'cheshire/terms',
  component: CheshireTermsComponent,
  canActivate: [SessionGuardService],
  data: { title: 'Search Terms' }
},{
  path: 'cheshire/analytics',
  component: CheshireItunesconnectAnalyticsComponent,
  canActivate: [SessionGuardService],
  data: { title: 'iTunes Connect Analytics' }
}, {
    path: 'searchads/intro',
    component: IntroComponent,
    canActivate: [SessionGuardService],
    data: { title: 'Intro' }
  },
  {
    path: 'credentials/google',
    component: GoogleadsCredentialsComponent,
    canActivate: [SessionGuardService],
    data: { title: 'Google Credentials' }
  },
  {
    path: 'credentials/snapchat',
    component: SnapchatCredentialsComponent,
    canActivate: [SessionGuardService],
    data: { title: 'Snapchat Credentials' }
  },
  {
    path: 'adwords/reporting',
    component: GoogleadsReportingComponent,
    canActivate: [SessionGuardService],
    data: { title: 'AdWords Reporting' }
  },
];

@NgModule({
  declarations: [
    AppComponent,
    RulesComponent,
    RulesListComponent,
    RuleDescriptionPipe,
    MillisecondsPipe,
    AdgroupPipe,
    RuleHistoryComponent,
    RuleHistoryDescriptionPipe,
    EditRuleComponent,
    EditRuleDialogComponent,
    EditRuleConditionComponent,
    EditRuleActionComponent,
    EditRuleCruiseControlComponent,
    RuleHistoryDialogComponent,
    RuleTaskDescriptionPipe,
    LoginRegisterComponent,
    SignupComponent,
    SigninComponent,
    CertificatesListComponent,
    CertificatesComponent,
    EditCertificateComponent,
    AdjustCredentialsComponent,
    EditAdjustCredentialComponent,
    AdjustCredentialsListComponent,
    ConfirmationDialogComponent,
    EditCertificateDialogComponent,
    CheshireTermsComponent,
    EditCheshireTermComponent,
    CheshireTermReportComponent,
    CheshireItunesconnectAnalyticsComponent,
    EditCheshireItunesconnectAnalyticsComponent,
    SearchadsReportingComponent,
    EditSearchadsReportingComponent,
    SearchadsReportingResultsComponent,
    RuleImpactDialogComponent,
    RuleImpactComponent,
    ResetPasswordComponent,
    AdjustRevenueReportComponent,
    AdjustRevenueComponent,
    EditAdjustRevenueComponent,
    IntroComponent,
    IntroPipe,
    GoogleadsCredentialsListComponent,
    EditGoogleadsCredentialComponent,
    GoogleadsCredentialsComponent,
    GoogleadsReportingComponent,
    EditGoogleadsReportingComponent,
    GoogleadsReportingResultsComponent,
    DisplayChannelPipe,
    NotificationsListComponent,
    FilterableDropdownComponent,
    SnapchatCredentialsComponent,
    EditSnapchatCredentialComponent,
    SnapchatCredentialsListComponent,
    HourlyReportExportComponent,
    SSOComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    BrowserModule,
    YoutubePlayerModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  entryComponents: [
    EditRuleDialogComponent,
    RuleHistoryDialogComponent,
    ConfirmationDialogComponent,
    EditCertificateDialogComponent,
    RuleImpactDialogComponent,
  ],
  providers: [
    RuleService,
    RuleHistoryService,
    CampaignService,
    AdgroupService,
    UserService,
    SessionService,
    SessionGuardService,
    NoSessionGuardService,
    ApiErrorService,
    CertificateService,
    CheshireTermsService,
    NewRelicService,
    SocketService,
    CheshireItunesconnectService,
    MobileactionService,
    SearchadsReportService,
    CsvDownloaderService,
    AdjustService,
    GoogleadsService,
    CredentialService,
    NotificationService,
    {
      provide: ApiService,
      useFactory: ApiServiceFactory,
      deps: [XHRBackend, RequestOptions]
    },
    {
      provide: "NewRelicLibrary",
      useFactory: NewRelicLibraryFactory,
    },
    NewRelicService,
    {
      provide: "PlotlyLibrary",
      useFactory: PlotlyLibraryFactory,
    },
    PlotlyService,
],
  bootstrap: [AppComponent]
})

export class AppModule { }
