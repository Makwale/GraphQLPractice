
export class Bus{

    id;

    regno;

    driverid;

    totalPassengers;
    
    constructor(id, regno, driverid?, totalPassengers?){
        this.id = id;

        this.regno = regno;

        this.driverid = driverid;

        this.totalPassengers = totalPassengers;

    }
}