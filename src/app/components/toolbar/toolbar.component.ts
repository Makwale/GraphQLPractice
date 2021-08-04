import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  constructor(private afa: AngularFireAuth, private router: Router, private auth: AuthService,
    private dbs: DatabaseService) { }

  ngOnInit() {}

  logout(){
   
    this.afa.signOut().then( res => {
      this.auth.isAuthorised = false;
      this.dbs.isToolbarVisible = false;
      
      this.router.navigateByUrl("login")
    })
  }
}
