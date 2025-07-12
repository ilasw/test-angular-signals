import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from "@angular/common/http";
import {AuthInterceptor} from "./auth/interceptors/auth.interceptor";
import {providePrimeNG} from "primeng/config";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import Theme from './shared/theme';
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {LoginPageComponent} from "./auth/pages/login-page/login-page.component";
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {reducers, metaReducers} from './store';
import {AuthEffects} from './auth/store/auth.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    FormsModule,
    LoginPageComponent,

    // NgRx
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: false, // Set to true in production
    }),
  ],
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Theme
      }
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
