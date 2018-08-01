/*============================Sistema====================================*/
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

/*============================Páginas====================================*/
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PreguntasPage } from '../pages/preguntas/preguntas';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { ResponderPrePage } from '../pages/responder-pre/responder-pre';

/*============================Proveedores================================*/
import { DatabaseProvider } from '../providers/database/database';
import { SoundProvider } from '../providers/sound/sound';
import { ServicesProvider } from '../providers/services/services';

/*============================Plugings===================================*/
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { SQLite } from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { Network } from "@ionic-native/network";
import { AndroidFullScreen } from "@ionic-native/android-full-screen";
import { NativeAudio } from '@ionic-native/native-audio';
import { ScreenOrientation } from "@ionic-native/screen-orientation";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PreguntasPage,
    ConfiguracionPage,
    TabsPage,
    ResponderPrePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PreguntasPage,
    ConfiguracionPage,
    TabsPage,
    ResponderPrePage
  ],
  providers: [
    ScreenOrientation,
    Network,
    AndroidFullScreen,
    StatusBar,
    SplashScreen,
    NativeAudio,
    SQLite,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    SoundProvider,
    ServicesProvider
  ]
})
export class AppModule {}
