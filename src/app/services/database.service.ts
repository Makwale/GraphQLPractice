import { Injectable } from '@angular/core';
import { Driver } from '../models/driver.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Student } from '../models/student.model';
import { Slot } from '../models/slot.model';
import { Booking } from '../models/booking.model';
import { Bus } from '../models/bus.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from '@apollo/client/utilities';

const GET_SLOTS = gql`query MyQuery {
  slots: SLOT {
    id
    from
    to
    datetime
    busid
  }
}
`


const ADD_SLOT = gql`mutation AddSlot($from: String, $to: String, $datetime: timestamptz, $busid: Int) {
  insert_SLOT(objects: {from: $from, to: $to, datetime: $datetime, busid: $busid}) {
    returning {
      id
      from
      to
      datetime
    }
  }
}`

const UPDATE_SLOT = gql `mutation UpdateSlot($id:Int, $datetime: timestamptz, $busid: Int, $from: String, $to: String) {
  update_SLOT(where: {id: {_eq: $id}}, _set: {datetime: $datetime, busid: $busid, from: $from, to: $to}) {
    returning {
      id
      from
      datetime
      to
      busid
    }
  }
}`;

const DELETE_SLOT = gql `mutation DeleteSlot($id: Int) {
  delete_SLOT(where: {id: {_eq: $id}}) {
    returning {
      from
      id
      datetime
      busid
    }
  }
}
`

const GET_BUSES = gql`query GetBuses {
  BUS {
    id
    regno
    totalPassengers
  }
}`

const ADD_BUS = gql`mutation AddBus($regno: String, $totalPassengers: Int, $driverid: Int) {
  insert_BUS(objects: {regno: $regno, totalPassengers: $totalPassengers, driverid: $driverid}) {
    returning {
      id
      regno
      totalPassengers
      driverid
    }
  }
}`

const UPDATE_BUS = gql`mutation UpdateBus($id: Int, $regno: String, $totalPassengers: Int, $driverid: Int) {
  update_BUS(where: {id: {_eq: $id}}, _set: {regno: $regno, totalPassengers: $totalPassengers, driverid: $driverid}) {
    returning {
      id
      regno
      totalPassengers
    }
  }
}`

const DELETE_BUS = gql`mutation DeleteBus($id: Int) {
  delete_BUS(where: {id: {_eq: $id}}) {
    returning {
      id
      regno
      totalPassengers
    }
  }
}`


const GET_DRIVERS =  gql`query GetDrivers {
  drivers: DRIVER {
    id
    firstname
    lastname
    phone
    email
  }
}`
const UPDATE_DRIVER = gql`mutation UpdateDriver($id: Int, $firstname: String, $lastname: String, $phone: Int) {
  update_DRIVER(where: {id: {_eq: $id}}, _set: {id: $id, firstname: $firstname, lastname: $lastname, phone: $phone}) {
    returning {
      id
      firstname
      lastname
      phone
    }
  }
}`;

const DELETE_DRIVER =  gql`mutation UpdateDriver($id: Int) {
  delete_DRIVER(where: {id: {_eq: $id}}){
    returning {
      id
    }
  }
}`

const GET_STUDENTS = gql`query GetStudents {
  students: STUDENT {
    id
    firstname
    lastname
    email
  }
}`

const DELETE_STUDENT =  gql `mutation DeleteStudent($id: Int) {
  delete_STUDENT(where: {id: {_eq: $id}}) {
    returning {
      email
      id
      firstname
      lastname
    }
  }
}`

const GET_BOOKINGS = gql`query GetBookings {
  BOOKING {
    studentid
    slotid
    date
    student: STUDENT {
      firstname
      lastname
      email
    }
  }
}
`


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  drivers: Driver[] = [];
  students: Student[] = [];
  slots: Slot[] = [];
  bookings: Booking[] = [];
  buses: Bus[] = [];
  isToolbarVisible = false;

  constructor(private afs: AngularFirestore, private snackBar: MatSnackBar, private auth: AuthService
    , private apollo: Apollo) { }
  
  createSlot(from: string, to: string, datetime: Date, busid: number, num) {
    this.auth.isVisible = true;

    return this.apollo.mutate({
      mutation: ADD_SLOT,
      variables: {
        from,
        to,
        datetime: datetime.toISOString(),
        busid
      }
    })

  }

  updateSlot(id, from, to, datetime: Date, busid) {
    this.auth.isVisible = true;

    return this.apollo.mutate({
      mutation: UPDATE_SLOT,
      variables: {
        id, from, to, datetime : datetime.toISOString(), busid
      }
    })
  }
  
  createBus(regno: string, totalPassengers: number, driverid?: number){
    this.auth.isVisible = true;

    return this.apollo.mutate({
      mutation: ADD_BUS,
      variables: {
        regno,
        totalPassengers,
        driverid
      }
    })

  }

  
  deleteDriver(id: string) {

    this.auth.isVisible = true;


    this.apollo.mutate({
      mutation: DELETE_DRIVER,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.open("Driver is deleted", "", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: 'top'
      })

    })
  }

  deleteBus(id: number) {
    this.auth.isVisible = true;

    this.apollo.mutate({
      mutation: DELETE_BUS,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.open("Bus is deleted", "", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: 'top'
      })
    })

  }
  
  deletSlot(id: number) {
    this.auth.isVisible = true;


    this.apollo.mutate({
      mutation: DELETE_SLOT,
      variables: {
        id
      }
    }).subscribe(res => {
        if(res.data){
         
            this.snackBar.open("Slot is deleted", "", {
              duration: 3000,
              horizontalPosition: "end",
              verticalPosition: 'top'
            })
        
        }else if(res.errors){
          this.snackBar.open(res.errors.toString(), "", {
            duration: 3000,
            horizontalPosition: "end",
            verticalPosition: 'top'
          })
        }
    })
    this.slots = this.slots.filter( slot => slot.id != id)
  }

  deleteStudent(id: string) {
    this.auth.isVisible = true;

    this.apollo.mutate({
      mutation: DELETE_STUDENT,
      variables: {
        id: Number(id)
      }
    }).subscribe(res => {
      this.snackBar.open("Student is deleted", "", {
        duration: 3000,
        horizontalPosition: "end",
        verticalPosition: 'top'
      })
    })
    this.students = this.students.filter(student => student.id != id);
  }

  updateDriver(id: string,firstname: string, lastname: string, phone: number) {
    this.auth.isVisible = true;


    return this.apollo.mutate({
      mutation: UPDATE_DRIVER,
      variables: {
        id,
        firstname,
        lastname,
        phone
      }
    })

  }

  updateBus(id: number, regno: string, totalPassengers: number, driverid: number) {

    this.auth.isVisible = true;

    return this.apollo.mutate({
      mutation: UPDATE_BUS,
      variables: {
        id,
        regno,
        totalPassengers,
        driverid,
      }
    })

  }
 
  getDrivers(){
    this.apollo.watchQuery({
      query: GET_DRIVERS
    }).valueChanges.subscribe( response => {
      this.drivers = response.data["drivers"] as Driver[];
    })

    return this.drivers;
  }

  getBuss(){
    this.apollo.watchQuery({
      query: GET_BUSES
    }).valueChanges.subscribe( response => {
      this.buses = response.data["BUS"] as Bus[];
    })
  }



  getslots(){
   this.apollo.watchQuery({
     query: GET_SLOTS,
   }).valueChanges.subscribe(res => {
     this.slots = res.data["slots"]
    //  this.slots.forEach(slot => {
    //    slot.datetime = new Date(slot.datetime)
    //  })
     console.log(this.slots)
   })
  }

  getStudents(){

    this.apollo.watchQuery({
      query: GET_STUDENTS
    }).valueChanges.subscribe( res => {
    
      this.students = res.data["students"];
      console.log(this.students)
    })
   
  }


  getBookings(){
    this.apollo.watchQuery({
      query: GET_BOOKINGS
    }).valueChanges.subscribe(res => {
      this.bookings = res.data["BOOKING"]
      console.log(this.bookings)
    })
  }


  deleteAllDrivers(id) {
    // this.afs.collection("Driver").doc(id).delete()
  }

  deleteAllBuses(id) {
    // this.afs.collection("Bus").doc(id).delete()
  }
  deleteAllBookings(id) {
    // this.afs.collection("Booking").doc(id).delete()
  }

  deleteAllSlots(id) {
    // this.afs.collection("Slot").doc(id).delete()
  }
  

}
