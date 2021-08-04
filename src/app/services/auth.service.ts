import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import  firebase from 'firebase/app';

import { AngularFirestore, 
  AngularFirestoreCollection,
   AngularFirestoreDocument } from '@angular/fire/firestore';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Apollo, gql } from 'apollo-angular';

let ADD_DRIVER = gql`mutation AddDriver($firstname: String, $lastname: String, $phone: Int, $email: String) {
  insert_DRIVER(objects: {firstname: $firstname, lastname: $lastname, phone: $phone, email: $email}) {
    returning {
      id
      firstname
      lastname
    }
  }
}`

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  isAuthorised: boolean = false;
  isVisible = false;
  constructor(private afa: AngularFireAuth, private afs: AngularFirestore,
    private acs: AccountService, private router: Router,
    private snackBar: MatSnackBar, private apollo: Apollo) { }

  createDriver(firstname: string, lastname: string, phone: number, email: any, password: string) {
    this.isVisible = true

    this.apollo.mutate({
      mutation: ADD_DRIVER,
      variables: {
        firstname,
        lastname,
        phone,
        email
      }
    }).subscribe( response => {
      console.log(response.data)
      this.snackBar.open("Driver profile is created", "", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: 'top'
      })

      this.isVisible = false;
      
    }, error => {
      this.snackBar.open(error.message, "", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: 'top'
      })
      this.isVisible = false
    })

  }




  signin(email, password) {
    this.isVisible = true
    this.afa.signInWithEmailAndPassword(email, password).then(res => {
     
      this.afs.collection("Admin").snapshotChanges().subscribe(data => {
        if(data[0].payload.doc.id == res.user.uid){
          this.isAuthorised = true
          this.isVisible = false
          this.router.navigateByUrl("home")
          
        }else{
          this.isVisible = false
          this.router.navigateByUrl("home")
        }
      })
    }).catch(error => {
      this.snackBar.open(error.message, "", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: 'top'
      })
      this.isVisible = false;
    })
  }
}
