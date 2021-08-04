import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Bus } from 'src/app/models/bus.model';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-addslot',
  templateUrl: './addslot.component.html',
  styleUrls: ['./addslot.component.scss'],
})
export class AddslotComponent implements OnInit {

  signupForm: FormGroup;
 
  buses: Bus[] = [];
  dtenabled = false;
  numPassangers: number;

  constructor(private router: Router, private auth: AuthService, private dbs: DatabaseService,
    private afs: AngularFirestore, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getBuss()
    this.signupForm = new FormBuilder().group({
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      datetime: ['', [Validators.required,]],
      busid: ['', [Validators.required]],
 
    })

  }

  get from() { return this.signupForm.get('from')}

  get to() { return this.signupForm.get('to')}

  get datetime() { return this.signupForm.get('datetime')}

  get busid() { return this.signupForm.get('busid')}



  navigate(){
    this.router.navigateByUrl("menu/signin")
  }

  create(){



    // if(new Date(this.signupForm.value["datetime"]).toLocaleDateString() < new Date().toLocaleDateString()){
    //   this.createSnackBar("Previous date unaccepted")
    // }else if(new Date(this.signupForm.value["datetime"]).toLocaleDateString() == new Date().toLocaleDateString()){
     
    //   if(new Date(this.signupForm.value["datetime"]).toLocaleTimeString() <= new Date().toLocaleTimeString()){
    //    this.createSnackBar("Previous time unaccepted")
    //   }else{
    //     this.createSlot()
    //   }
    // }else{
    //   this.createSlot()
    // }

    this.createSlot()
   
    
  }

  createSnackBar(message: string){
    this.snackBar.open(message, "", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: 'top'
    
    })
  }

  createSlot(){
     if(this.signupForm.value["from"] == this.signupForm.value["to"]){
      alert("Source and Destination cannot be the same")
    }else{

      this.dbs.createSlot(this.signupForm.value["from"], this.signupForm.value["to"],
       new Date(this.signupForm.value["datetime"]), this.signupForm.value["busid"], this.numPassangers).subscribe(res =>{
     
        this.snackBar.open("Slot is created", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })
  
      })
   
    }
  }




  dtEnable(){
    this.dtenabled = true;

  }


  getBuss(){
    this.dbs.getBuss()
    setTimeout(() => {
      this.buses = this.dbs.buses;
      console.log(this.buses)
    },2000)

  }

  getNumPass(){
 
    for(let bus of this.buses){
      if(bus.id == this.signupForm.value["busid"]){
        this.numPassangers = bus.totalPassengers;
      }
    }
 
  }

  searchBus(busid: Bus){
    for(let dr of this.buses){
      if(dr.id == busid.id){
        return true;
      }
    }
    return false;
  }


}
