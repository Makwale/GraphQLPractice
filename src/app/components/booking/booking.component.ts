import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Booking } from 'src/app/models/booking.model';
import { DatabaseService } from 'src/app/services/database.service';
import { jsPDF } from "jspdf";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {

  displayedColumns: string[] = ['checkbox', 'id', 'date', 'firstname', 'lastname', 'studentNumber', 'email', 'status'];
  dataSource: MatTableDataSource<Booking>;
  bookings: Booking[] = []
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort
  isVisible = true;
  selected = false;
  isIndeterminate = false;
  selecedtAll = false;

  constructor(private dbs: DatabaseService, private afs: AngularFirestore,
    public dialog: MatDialog, private snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
 
    this.dbs.getBookings()
   
  }
  ngAfterViewInit() {

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.dbs.bookings)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isVisible = false;
    }, 4000)
   
  }

  applyFilter(filter){
    this.dataSource.filter = filter
    this.selected = false;
    this.selecedtAll = false;
    this.bookings = [];
    this.isIndeterminate = false;
  }

  select(checked, id){

    this.isIndeterminate = true
    this.selecedtAll = false;
    if(checked){
      this.bookings.push(this.dataSource.filteredData.find(booking => booking.id ==id))
    }else{
      this.bookings = this.bookings.filter(booking => booking.id != id)
    }

    if(this.bookings.length == this.dataSource.filteredData.length){
      this.isIndeterminate = false
      this.selecedtAll = true;
    }

    if(this.bookings.length == 0){
      this.selecedtAll = false;
      this.isIndeterminate = false
    }
    
    
    
  }

  checkAll(checked){

    this.isIndeterminate = false;
    
    if(checked){
      this.selected = true;
      this.bookings = this.dataSource.filteredData
      this.selecedtAll = true
    }else{
      this.bookings = []
      this.selecedtAll = false;
      this.selected = false
    }
    
  }

  generateReport(){

    const doc = new jsPDF({
      orientation: 'l',
    });

    doc.text("BOOKINGS REPORT", 115,20)
    let index = 1;

    doc.cell(10,40,80,10,"Id", index, "left")
    doc.cell(10,40,70,10,"Booking Date & time".toUpperCase(), index, "left")
    doc.cell(10,40,70,10,"Initial & Last Name".toUpperCase(), index, "left")
    doc.cell(10,40,50,10,"booking No".toUpperCase(), index, "left")
      
    index++;

    if(this.selecedtAll){

      

      for(let booking of this.dataSource.filteredData){
      
        doc.cell(10,40,80,10,booking.id, index, "left")
        doc.cell(10,40,70,10,booking.date.toLocaleString(), index, "left")
        doc.cell(10,40,70,10,`${booking.student.firstname.toUpperCase().substring(0,1)} ${booking.student.lastname.toUpperCase()}`, index, "left")
        doc.cell(10,40,50,10,String(booking.student.studentNumber), index, "left")
        
        index++;
      }
    }else{

      for(let booking of this.bookings){
      
        doc.cell(10,40,80,10,booking.id, index, "left")
        doc.cell(10,40,70,10,booking.date.toLocaleString(), index, "left")
        doc.cell(10,40,70,10,`${booking.student.firstname.toUpperCase().substring(0,1)} ${booking.student.lastname.toUpperCase()}`, index, "left")
        doc.cell(10,40,50,10,String(booking.student.studentNumber), index, "left")
        
        index++;
      }
    }

     
    doc.save("Bookings Report.pdf")
   
      
    
  }

  deleteSelected(){

    if(confirm("Are you sure you want to delete seleted bookings?")){
      this.isIndeterminate = false;
  
      if(this.selecedtAll){
        for(let booking of this.dataSource.filteredData){
          this.dbs.deleteAllBookings(booking.id)
        }
        this.snackBar.open("Bookings deleted", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })
        
        this.dbs.bookings = []
        this.dataSource = new MatTableDataSource([])    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.bookings = []
        
        this.selecedtAll = false;
        
      }else{
        for(let booking of this.bookings){
          this.dbs.deleteAllBookings(booking.id)
        }
        this.snackBar.open("Bookings deleted", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })

        for(let booking of this.bookings){
          this.dbs.bookings = this.dbs.bookings.filter( dr => dr.id != booking.id);
        }
        this.dataSource = new MatTableDataSource(this.dbs.bookings)    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.bookings = []
      }

    }

  }

}
