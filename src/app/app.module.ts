import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ListPage } from './list/list.page';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { FormsModule } from '@angular/forms';
import { PayPal } from '@ionic-native/paypal/ngx';
import { Sim } from '@ionic-native/sim/ngx';
// import { DeviceAccounts } from '@ionic-native/device-accounts/ngx';
import { HttpClientModule } from '@angular/common/http';
import { PaypalsPage } from './paypals/paypals.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Device } from '@ionic-native/device/ngx';



@NgModule({
  declarations: [AppComponent,ListPage,PaypalsPage],
  entryComponents: [ListPage,PaypalsPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [
    Geolocation,
    NativeGeocoder,
    StatusBar,
    SplashScreen,
    SQLite,
    SQLitePorter,
    File,
    FormsModule,
    FileOpener,
    PayPal,
    Sim,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
