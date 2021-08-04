
export class Student{
    id: string;

    firstname : string;

    lastname: string;

    studentNumber: number;

    email: string;
    constructor(id, firstname, lastname, studentNumber, email){
        
        this.id = id;

        this.firstname = firstname;

        this.lastname = lastname;

        this.studentNumber = studentNumber ? studentNumber : "N/A"

        this.email = email;
    }
}