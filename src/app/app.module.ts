import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { HomePage } from './components/home/home.page';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DriverComponent } from './components/driver/driver.component';
import { BusComponent } from './components/bus/bus.component';
import { AdddriverComponent } from './components/adddriver/adddriver.component';
import { AddbusComponent } from './components/addbus/addbus.component';
import { SlotComponent } from './components/slot/slot.component';
import { AddslotComponent } from './components/addslot/addslot.component';
import { StudentComponent } from './components/student/student.component';
import { AddstudentComponent } from './components/addstudent/addstudent.component';
import { BookingComponent } from './components/booking/booking.component';

import {MatDialog} from '@angular/material/dialog';
import { DrivereditComponent } from './components/driveredit/driveredit.component';
import { BuseditComponent } from './components/busedit/busedit.component';
import { SloteditComponent } from './components/slotedit/slotedit.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthComponent } from './components/unauth/unauth.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';


const firebaseConfig = {
  apiKey: "AIzaSyCvsvYeDkWYPNVJdVtdFvt7PpQirycbaxI",
  authDomain: "bus-project-52efc.firebaseapp.com",
  projectId: "bus-project-52efc",
  storageBucket: "bus-project-52efc.appspot.com",
  messagingSenderId: "789865770058",
  appId: "1:789865770058:web:7fa8ee99ecfaa262ad4ab3",
  measurementId: "G-Z3FSFN8C7X"
};

@NgModule({
  declarations: [AppComponent, 
    HomePage, 
    ToolbarComponent, 
    DriverComponent, 
    BusComponent, 
    AdddriverComponent,
    AddbusComponent,
    SlotComponent,
    AddslotComponent,
    StudentComponent,
    AddstudentComponent,
    DrivereditComponent,
    BuseditComponent,
    SloteditComponent,
    BookingComponent,
    LoginComponent],
  entryComponents: [ DrivereditComponent],
  imports: [BrowserModule, 
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule, 
    MatSortModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule, 
    IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, GraphQLModule, HttpClientModule],

  providers: [MatDialog,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],

})
export class AppModule {}
