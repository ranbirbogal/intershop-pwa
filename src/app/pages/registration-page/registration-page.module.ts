import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { CaptchaComponent } from './captcha/captcha.component';
import { EmailPasswordComponent } from './email-password/email-password.component';
import { AddressComponent } from './address/address.component';
import { RegistrationPageRoute } from './registration-page.routes';
import { RegistrationPageComponent } from './registration-page.component';
import { SharedModule } from '../../shared/shared-modules/shared.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RegistrationPageRoute),
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule.forRoot(),
    SharedModule
  ],
  declarations: [RegistrationPageComponent, CaptchaComponent, EmailPasswordComponent, AddressComponent],
  providers: []
})

export class RegistrationPageModule {

}