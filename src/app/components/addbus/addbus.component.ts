import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FetchResult } from '@apollo/client/core';
import { Observable } from '@apollo/client/utilities';
import { Subscription } from 'rxjs';
import { Bus } from 'src/app/models/bus.model';
import { Driver } from 'src/app/models/driver.model';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-addbus',
  templateUrl: './addbus.component.html',
  styleUrls: ['./addbus.component.scss'],
})
export class AddbusComponent implements OnInit {

  signupForm: FormGroup;
  enregno = false;
  ennumpassengers = false;
  drivers: Driver[] = [];
  driverid;

  constructor(private router: Router, private auth: AuthService, 
    private dbs: DatabaseService, private afs: AngularFirestore) { }

  ngOnInit() {
    this.getDrivers()
    this.signupForm = new FormBuilder().group({
      regno: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*[0-9-]*[a-zA-Z ]*')]],
      numPassengers: ['', [Validators.required]],
      driverid: ['']
    })

  }

  get regno() { return this.signupForm.get('regno')}

  get numPassengers() { return this.signupForm.get('numPassengers')}



  navigate(){
    this.router.navigateByUrl("menu/signin")
  }

  createBus(){
    let subSc: Observable<any>;
      if(this.signupForm.value["regno"] == "")
       this.displayResuslts(this.dbs.createBus(this.signupForm.value["regno"], this.signupForm.value["numPassengers"]))
      else
        this.displayResuslts(this.dbs.createBus(this.signupForm.value["regno"], this.signupForm.value["numPassengers"] ,this.signupForm.value["driverid"]))
    
  }

  displayResuslts(results){
    (<Observable<Bus>>results).subscribe(res => {
      console.log(res)
    })
  }

  regEnable(){
    this.enregno = true;
  }

  numPassEnable(){
    this.ennumpassengers = true;
  }

  getDrivers(){
    this.drivers = this.dbs.getDrivers();
  }

  searchDriver(driver: Driver){
    for(let dr of this.drivers){
      if(dr.id == driver.id){
        return true;
      }
    }
    return false;
  }


}
