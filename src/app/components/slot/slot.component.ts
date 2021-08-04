import { Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import { Slot } from 'src/app/models/slot.model';
import { DatabaseService } from 'src/app/services/database.service';
import { SloteditComponent } from '../slotedit/slotedit.component';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss'],
})
export class SlotComponent implements OnInit, DoCheck {

  displayedColumns: string[] = ['checkbox', 'id', 'from', 'to', 'avail', 'booked', 'datetime', 'status', 'action'];
  dataSource: MatTableDataSource<Slot>;
  slots: Slot[] = []
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort
  isVisible = true;
  selected = false;
  isIndeterminate = false;
  selecedtAll = false;
  constructor(private dbs: DatabaseService, 
    private afs: AngularFirestore , public dialog: MatDialog, private snackBar: MatSnackBar) { 
  }

  ngOnInit() {

    this.dbs.getslots()
   
  }

  ngAfterViewInit() {
    setTimeout(()=> {
     
      this.dataSource = new MatTableDataSource(this.dbs.slots)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isVisible = false;
    },3000)
    
  }

  ngDoCheck(){
    
  }

 
  applyFilter(filter){
    this.dataSource.filter = filter
    this.selected = false;
    this.selecedtAll = false;
    this.slots = [];
    this.isIndeterminate = false;
  }

  delete(id){
    if(confirm("Are you sure you want to delete this slot?")){
      this.dbs.deletSlot(id)
      
      this.dbs.slots = this.dbs.slots.filter(slot => slot.id != id)
      this.dataSource = new MatTableDataSource(this.dbs.slots)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
    }
  }

  openDialog(slot) {
    const dialogRef = this.dialog.open(SloteditComponent, {
      height : "440px",
      width: "500px",
      data: slot
    });
  }

  select(checked, id){

    this.isIndeterminate = true
    this.selecedtAll = false;
    if(checked){
      this.slots.push(this.dataSource.filteredData.find(slot => slot.id ==id))
    }else{
      this.slots = this.slots.filter(slot => slot.id != id)
    }

    if(this.slots.length == this.dataSource.filteredData.length){
      this.isIndeterminate = false
      this.selecedtAll = true;
    }

    if(this.slots.length == 0){
      this.selecedtAll = false;
      this.isIndeterminate = false
    }
    
    
    
  }

  checkAll(checked){

    this.isIndeterminate = false;
    
    if(checked){
      this.selected = true;
      this.slots = this.dataSource.filteredData
      this.selecedtAll = true
    }else{
      this.slots = []
      this.selecedtAll = false;
      this.selected = false
    }
    
  }

  generateReport(){

    const doc = new jsPDF({
      orientation: 'l',
    });

    doc.text("SLOTS REPORT", 115,20)

    let index = 1;
    
    doc.cell(10,40,80,10,"Id".toUpperCase(), index, "left")
    doc.cell(10,40,55,10,"From".toUpperCase(), index, "left")
    doc.cell(10,40,55,10,"To".toUpperCase(), index, "left")
    doc.cell(10,40,70,10,"Date & time".toUpperCase(), index, "left")
   
    index++;

    if(this.selecedtAll){

        

      for(let slot of this.dataSource.filteredData){

        doc.cell(10,40,80,10,slot.id, index, "left")
        doc.cell(10,40,55,10,slot.from.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,slot.to.toUpperCase(), index, "left")
        doc.cell(10,40,70,10,slot.datetime.toLocaleString(), index, "left")
        
    
        index++;
      }

    }else{


      for(let slot of this.slots){

        doc.cell(10,40,80,10,slot.id, index, "left")
        doc.cell(10,40,55,10,slot.from.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,slot.to.toUpperCase(), index, "left")
        doc.cell(10,40,70,10,slot.datetime.toLocaleString(), index, "left")
        
    
        index++;
      }
    }

     
    doc.save("Slots Report.pdf")
   
      
    
  }

  deleteSelected(){

    if(confirm("Are you sure you want to delete seleted slots?")){
      this.isIndeterminate = false;
  
      if(this.selecedtAll){
        for(let slot of this.dataSource.filteredData){
        
        }
        this.snackBar.open("Slots deleted", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })
        
        this.dbs.slots = []
        this.dataSource = new MatTableDataSource([])    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.slots = []
        
        this.selecedtAll = false;
        
      }else{
        for(let slot of this.slots){
          
        }
        this.snackBar.open("Slots deleted", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })

        for(let slot of this.slots){
          this.dbs.slots = this.dbs.slots.filter( dr => dr.id != slot.id);
        }
        this.dataSource = new MatTableDataSource(this.dbs.slots)    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.slots = []
      }

    }

  }

  viewAll(checked){
    if(checked){
      this.dataSource = new MatTableDataSource(this.dbs.slots)
     
    }else{
      let slots = this.dbs.slots.filter( slot => slot.status == "");
      this.dataSource = new MatTableDataSource(slots)
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
