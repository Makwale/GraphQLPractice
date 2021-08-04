
import { Student } from "./student.model";

export class Booking{
    id;
    slotid;
    student: Student;
    status;
    date: Date
    constructor(id, slotid, student, status, date?){

        this.id = id;

        this.date = date;
        
        this.slotid = slotid;

        this.student = student;

        this.status = status ? "Cancelled": "";

        this.date = date.toDate()
     
    }
}