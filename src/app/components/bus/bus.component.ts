import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Bus } from 'src/app/models/bus.model';
import { DatabaseService } from 'src/app/services/database.service';
import { BuseditComponent } from '../busedit/busedit.component';
import { jsPDF } from "jspdf";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss'],
})
export class BusComponent implements OnInit {

  displayedColumns: string[] = ['checkbox', 'id', 'regno', 'totalPassengers', 'action'];
  dataSource: MatTableDataSource<Bus>;
  buses: Bus[] = []
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort
  isVisible = true;
  selected = false;
  isIndeterminate = false;
  selecedtAll = false;
  constructor(private dbs: DatabaseService, private afs: AngularFirestore, 
    public dialog: MatDialog,  private snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
    this.dbs.getBuss()
   
  }
  ngAfterViewInit() {

    setTimeout(()=> {
      this.dataSource = new MatTableDataSource(this.dbs.buses)
       console.log(this.dbs.buses)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isVisible = false;
    }, 3000)
    
  }

  
  applyFilter(filter){
    this.dataSource.filter = filter
    this.selected = false;
    this.selecedtAll = false;
    this.buses = [];
    this.isIndeterminate = false;
  }

  deleteBus(id){
    if(confirm("Are you sure you want to delete this bus?")){
      this.dbs.deleteBus(id);
      this.dbs.buses = this.dbs.buses.filter( bus => bus.id != id)
      this.dataSource = new MatTableDataSource(this.dbs.buses)
       
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  openDialog(bus) {
    const dialogRef = this.dialog.open(BuseditComponent, {
      height : "370px",
      width: "450px",
      data: bus
    });
  }

  select(checked, id){

    this.isIndeterminate = true
    if(checked){
      this.buses.push(this.dataSource.filteredData.find(bus => bus.id ==id))
    }else{
      this.buses = this.buses.filter(bus => bus.id != id)
      this.selecedtAll = false;
    }

    if(this.buses.length == this.dataSource.filteredData.length){
      this.isIndeterminate = false
      this.selecedtAll = true;
    }

    if(this.buses.length == 0){
      this.selecedtAll = false;
      this.isIndeterminate = false
    }
    
    
    
  }

  checkAll(checked){

    this.selected = checked;

    if(checked){
      this.buses = this.dataSource.filteredData
      this.selecedtAll = checked
      this.selected = checked
      this.isIndeterminate = false;
    }else{
      this.buses = []
    }
    
  }

  generateReport(){

    const doc = new jsPDF({
      orientation: 'l',
    });

    doc.text("BUSES REPORT", 115,20)
    let index = 1;

    doc.cell(48,40,110,10,"Id".toUpperCase(), index, "left")
    doc.cell(48,40,80,10,"Registration No".toUpperCase(), index, "left")
      
    index++;

    if(this.selecedtAll){

      for(let bus of this.dataSource.filteredData){

        doc.cell(48,40,110,10,bus.id, index, "left")
        doc.cell(48,40,80,10,bus.regno, index, "left")
        index++;
      }

      
    }else{

      for(let bus of this.buses){

        doc.cell(48,40,110,10,bus.id, index, "left")
        doc.cell(48,40,80,10,bus.regno, index, "left")
        index++;
      }

    }

     
    doc.save("Buses Report.pdf")
      
    
  }

  deleteSelected(){

    if(confirm("Are you sure you want to delete seleted buses?")){
      this.isIndeterminate = false;
      
      if(this.selecedtAll){
        for(let bus of this.dataSource.filteredData){
          this.dbs.deleteAllBuses(bus.id)
        }
        this.snackBar.open("buses deleted", "", {
          duration: 5000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })
        
        this.dbs.buses = []
        this.buses = []
        this.dataSource = new MatTableDataSource(this.dbs.buses)    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  
        
      }else{
        
        for(let bus of this.buses){
          this.dbs.deleteAllBuses(bus.id)
          
        }
        this.snackBar.open("buses deleted", "", {
          duration: 5000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })

        for(let bus of this.buses){
          this.dbs.buses = this.dbs.buses.filter( bs => bs.id != bus.id);
        }
        this.dataSource = new MatTableDataSource(this.dbs.buses)    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.buses = []
      }

    }

  }

}
