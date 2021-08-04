import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Driver } from 'src/app/models/driver.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {MatDialog} from '@angular/material/dialog';
import { DrivereditComponent } from '../driveredit/driveredit.component';
import { jsPDF } from "jspdf";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  providers: [MatDialog]
})
export class DriverComponent implements OnInit {
  
  displayedColumns: string[] = ['checkbox', 'id', 'firstname', 'lastname', 'phone', 'email', 'action'];
  dataSource: MatTableDataSource<Driver>;
  drivers: Driver[] = []
  isVisible = true;
  selected = false;
  isIndeterminate = false;
  selecedtAll = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort

  constructor(private dbs: DatabaseService,
     private afs: AngularFirestore, 
     public dialog: MatDialog, private snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {

    this.dbs.getDrivers()
   
  }

  ngAfterViewInit() {
    
   setTimeout(() => {
    
     this.dataSource = new MatTableDataSource(this.dbs.drivers)    
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
     this.isVisible = false;
   }, 3000)
  }

 


  deleteDriver(id){
    if(confirm("Are you sure you want to delete this drive")){
      this.dbs.deleteDriver(id)
      this.dbs.drivers = this.dbs.drivers.filter( driver => driver.id != id);
      this.dataSource = new MatTableDataSource(this.dbs.drivers)    
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(filter){
    this.dataSource.filter = filter
    this.selected = false;
    this.selecedtAll = false;
    this.drivers = [];
    this.isIndeterminate = false;
  }

  openDialog(driver) {
    const dialogRef = this.dialog.open(DrivereditComponent, {
      height : "380px",
      width: "450px",
      data: driver
    });
  }

  select(checked, id){

    this.isIndeterminate = true
    if(checked){
      this.drivers.push(this.dataSource.filteredData.find(driver => driver.id ==id))
    }else{
      this.drivers = this.drivers.filter(driver => driver.id != id)
      this.selecedtAll = false;
    }

    if(this.drivers.length == this.dataSource.filteredData.length){
      this.isIndeterminate = false
      this.selecedtAll = true;
    }

    if(this.drivers.length == 0){
      this.selecedtAll = false;
      this.isIndeterminate = false
    }
    
    
    
  }

  checkAll(checked){

    this.selected = checked;

    if(checked){
      this.drivers = this.dataSource.filteredData
      this.selecedtAll = checked
      this.selected = checked
      this.isIndeterminate = false;
    }else{
      this.drivers = []
    }
    
  }

  generateReport(){

    const doc = new jsPDF({
      orientation: 'l',
    });

    doc.text("DRIVERS REPORT", 115,20)
    let index = 1;

    doc.cell(10,40,110,10,"Id".toUpperCase(), index, "left")
    doc.cell(10,40,55,10,"First Name".toUpperCase(), index, "left")
    doc.cell(10,40,55,10,"Last Name".toUpperCase(), index, "left")
    doc.cell(10,40,55,10,"Phone No".toUpperCase(), index, "left")

    index++;

    if(this.selecedtAll){
        

      for(let driver of this.dataSource.filteredData){

        doc.cell(10,40,110,10,driver.id, index, "left")
        doc.cell(10,40,55,10,driver.firstname.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,driver.lastname.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,`0${driver.phone}`, index, "left")
        
    
        index++;
      }
    }else{


      for(let driver of this.drivers){

        doc.cell(10,40,110,10,driver.id, index, "left")
        doc.cell(10,40,55,10,driver.firstname.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,driver.lastname.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,`0${driver.phone}`, index, "left")
        
    
        index++;
      }
    }

     
    doc.save("Drivers Report.pdf")
      
    
  }

  deleteSelected(){

    if(confirm("Are you sure you want to delete seleted drivers?")){
      this.isIndeterminate = false;
      
      if(this.selecedtAll){
        for(let driver of this.dataSource.filteredData){
          this.dbs.deleteAllDrivers(driver.id)
        }
        this.snackBar.open("Drivers deleted", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })
        
        this.dbs.drivers = []
        this.dataSource = new MatTableDataSource(this.dbs.drivers)    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        
      }else{
        for(let driver of this.drivers){
          this.dbs.deleteAllDrivers(driver.id)
        }
        this.snackBar.open("Drivers deleted", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })

        for(let driver of this.drivers){
          this.dbs.drivers = this.dbs.drivers.filter( dr => dr.id != driver.id);
        }
        this.dataSource = new MatTableDataSource(this.dbs.drivers)    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
      }

    }

  }
}
