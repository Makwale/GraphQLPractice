import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import { Student } from 'src/app/models/student.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {

  displayedColumns: string[] = ['checkbox', 'id', 'firstname', 'lastname', 'studentNumber', 'email', 'action'];
  dataSource: MatTableDataSource<Student>;
  students: Student[] = []
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort
  isVisible = true;
  selected = false;
  isIndeterminate = false;
  selecedtAll = false;

  constructor(private dbs: DatabaseService, private afs: AngularFirestore,
    private snackBar: MatSnackBar) { 
    
  }

  ngOnInit() {
    this.dbs.getStudents()
   
  }
  ngAfterViewInit() {

    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.dbs.students)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isVisible = false
    }, 3000)
    
  }

  
  applyFilter(filter){
    this.dataSource.filter = filter
    this.selected = false;
    this.selecedtAll = false;
    this.students = [];
    this.isIndeterminate = false;
  }

  delete(id){
    if(confirm("Are you sure you want to delete this student?")){

      this.dbs.deleteStudent(id)
      this.dbs.students = this.dbs.students.filter( student => student.id != id);
      this.dataSource = new MatTableDataSource(this.dbs.students)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  select(checked, id){

    this.isIndeterminate = true
    this.selecedtAll = false;
    if(checked){
      this.students.push(this.dataSource.filteredData.find(student => student.id ==id))
    }else{
      this.students = this.students.filter(student => student.id != id)
    }

    if(this.students.length == this.dataSource.filteredData.length){
      this.isIndeterminate = false
      this.selecedtAll = true;
    }

    if(this.students.length == 0){
      this.selecedtAll = false;
      this.isIndeterminate = false
    }
    
    
    
  }

  checkAll(checked){

    this.isIndeterminate = false;
    
    if(checked){
      this.selected = true;
      this.students = this.dataSource.filteredData
      this.selecedtAll = true
    }else{
      this.students = []
      this.selecedtAll = false;
      this.selected = false
    }
    
  }

  generateReport(){

    const doc = new jsPDF({
      orientation: 'l',
    });

    doc.text("STUDENTS REPORT", 115,20)
    
    let index = 1;

    doc.cell(10,40,110,10,"Id".toUpperCase(), index, "left")
    doc.cell(10,40,55,10,"First Name".toUpperCase(), index, "left")
    doc.cell(10,40,55,10,"Last Name".toUpperCase(), index, "left")
    doc.cell(10,40,55,10,"Student No".toUpperCase(), index, "left")
      
    index++;

    if(this.selecedtAll){


      for(let student of this.dataSource.filteredData){

        doc.cell(10,40,110,10,student.id, index, "left")
        doc.cell(10,40,55,10,student.firstname.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,student.lastname.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,student.studentNumber ? String(student.studentNumber) : "N/A", index, "left")
        
    
        index++;
      }
    }else{

  
      for(let student of this.students){

        doc.cell(10,40,110,10,student.id, index, "left")
        doc.cell(10,40,55,10,student.firstname.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,student.lastname.toUpperCase(), index, "left")
        doc.cell(10,40,55,10,student.studentNumber ? String(student.studentNumber) : "N/A", index, "left")
        
    
        index++;
      }
    }

     
    doc.save("Students Report.pdf")
   
      
    
  }

  deleteSelected(){

    if(confirm("Are you sure you want to delete seleted students?")){
      this.isIndeterminate = false;
  
      if(this.selecedtAll){
        for(let student of this.dataSource.filteredData){
          this.dbs.deleteAllSlots(student.id)
        }
        this.snackBar.open("Students deleted", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })
        
        this.dbs.students = []
        this.dataSource = new MatTableDataSource([])    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.students = []
        
        this.selecedtAll = false;
        
      }else{
        for(let student of this.students){
          this.dbs.deleteAllSlots(student.id)
        }
        this.snackBar.open("Students deleted", "", {
          duration: 3000,
          horizontalPosition: "end",
          verticalPosition: 'top'
        })

        for(let student of this.students){
          this.dbs.students = this.dbs.students.filter( dr => dr.id != student.id);
        }
        this.dataSource = new MatTableDataSource(this.dbs.students)    
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.students = []
      }

    }

  }
}
