import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-adddriver',
  templateUrl: './adddriver.component.html',
  styleUrls: ['./adddriver.component.scss'],
})
export class AdddriverComponent implements OnInit {

  signupForm: FormGroup;
  fenabled = false;
  lenabled = false;
  penabled = false;
  emenabled = false;
  passenabled = false;
  hasCode = false;

  constructor(private router: Router, private auth: AuthService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signupForm = new FormBuilder().group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      phone:  ['', [Validators.required, Validators.minLength(9),Validators.maxLength(9), Validators.pattern("^[0-9]{9}$")]],
      password: ['', [Validators.minLength(8),Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{7,}')]],
      cpassword: [''],
    })

  }

  get firstname() { return this.signupForm.get('firstname')}

  get lastname() { return this.signupForm.get('lastname')}

  get email() { return this.signupForm.get('email')}

  get phone() { return this.signupForm.get('phone')}

  get password() { return this.signupForm.get('password')}

  get cpassword() { return this.signupForm.get('cpassword')}


  navigate(){
    this.router.navigateByUrl("menu/signin")
  }

  create(){

    if(this.signupForm.value["password"] == this.signupForm.value["cpassword"]){
      this.auth.createDriver(this.signupForm.value["firstname"], this.signupForm.value["lastname"],
      this.signupForm.value["phone"], this.signupForm.value["email"], this.signupForm.value["password"])
    }else{
   
      
      this.snackBar.open("Passwords do not match", "", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: 'top'
      })
    }
    
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

  keydown(){
    console.log(String(this.signupForm.value["phone"]).length)
    if(String(this.signupForm.value["phone"]).length == 3)
    
      this.hasCode = String(this.signupForm.value["phone"]).substring(0,3) == "+27" ? true : false 
      console.log(this.hasCode)

  }

}
