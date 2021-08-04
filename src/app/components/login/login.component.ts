import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  signupForm: FormGroup;
  emenabled = false;
  passenabled = false;
 

  constructor(private router: Router, private auth: AuthService, private ptf: Platform) {
    
   }

  ngOnInit() {
    this.signupForm = new FormBuilder().group({
      email: [''],
      password: [''],
    })

  }


  signin(){

      this.auth.signin(this.signupForm.value["email"], this.signupForm.value["password"])
   
    
  }


}
