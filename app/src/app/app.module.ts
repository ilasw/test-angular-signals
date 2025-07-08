import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withFetch } from "@angular/common/http";
import {providePrimeNG} from "primeng/config";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import Theme from './shared/theme';
import {ButtonModule} from "primeng/button";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
  ],
  providers: [
    provideHttpClient(
      withFetch()
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Theme
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
