import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Driver } from 'src/app/models/driver.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-driveredit',
  templateUrl: './driveredit.component.html',
  styleUrls: ['./driveredit.component.scss'],
  providers: [ MatDialog]
})
export class DrivereditComponent implements OnInit {

  signupForm: FormGroup;
  fenabled = false;
  lenabled = false;
  penabled = false;
  emenabled = false;
  passenabled = false;
  hasCode = false;
  
  constructor(private df: MatDialogRef<Driver>, private dbs: DatabaseService, 
    @Inject(MAT_DIALOG_DATA) public driver: Driver, private snackBar: MatSnackBar) { }

  ngOnInit() {

   
    this.signupForm = new FormBuilder().group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      phone:  ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9), Validators.pattern("^[0-9]{9}$")]],
     
    })

    this.signupForm.controls["firstname"].setValue(this.driver.firstname)
    this.signupForm.controls["lastname"].setValue(this.driver.lastname)
    this.signupForm.controls["phone"].setValue(this.driver.phone)
  }

  get firstname() { return this.signupForm.get('firstname')}

  get lastname() { return this.signupForm.get('lastname')}

  get phone() { return this.signupForm.get('phone')}


  save(){

      this.dbs.updateDriver(this.driver.id,this.signupForm.value["firstname"], this.signupForm.value["lastname"],
      this.signupForm.value["phone"]).subscribe(res => {
        if(res.data){
          this.snackBar.open("Driver is updated", "", {
            duration: 3000,
            horizontalPosition: "end",
            verticalPosition: 'top'
          })
        }else if(res.errors) {
          this.snackBar.open("Something wrong happened", "", {
            duration: 3000,
            horizontalPosition: "end",
            verticalPosition: 'top'
          })
        }
        
      })
    
    
  }

  fnameEnable(){
    this.fenabled = true;
  }

  lnameEnable(){
    this.lenabled = true;
  }

  phoneEnable(){
    this.penabled = true;
    
  }

  emailEnable(){
    this.emenabled = true;
  }

  passEnable(){
    this.passenabled = true;
  }


}
