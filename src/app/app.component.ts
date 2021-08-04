import { Component, OnInit } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private dbs: DatabaseService, private auth : AuthService, private ptf: Platform ) {
    dbs.isToolbarVisible
  }

  ngOnInit(){
   
  }
}
