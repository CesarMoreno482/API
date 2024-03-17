import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

type Employee = {
    id: number;
    cedula: string;
    fullname: string;
    pricePerHour: number;

}

type WorkedHour = {
    employeeId: number;
    hours: number;

}

let employees: Employee[] = [{id:1, cedula:"123123123", fullname:"calamina",pricePerHour:2000}];
let workedHours: WorkedHour[] = [{employeeId:1,hours:5},{employeeId:1,hours:4},{employeeId:1,hours:7},{employeeId:1,hours:9}];

app.get('/employee', (req: Request, res: Response) => {
    res.json(employees);
});

app.get('/employee/:id', (req: Request, res: Response) => {

    const id = parseInt(req.params.id);
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        res.json(employee);

    } else {
        res.status(404).json({ Message: 'employee not found' });
    }
});

app.get('/employee/:id/hours', (req: Request, res: Response) => {

    const id = parseInt(req.params.id);
    const hours = workedHours.filter(hour => hour.employeeId === id);
    if(!hours){return res.status(404).json({Message:'not found'})}
    res.json(hours);
    

});

app.get('/employee/:id/salary', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        const totalHours = workedHours.reduce((total, hour) => {
            return hour.employeeId === id ? total + hour.hours : total;
        }, 0);
        const salary = totalHours * employee.pricePerHour;
        res.json({
            employee,
            salary
        });
    } else {
        res.status(404).json({ Message: 'Employee not found' });
    }
});

app.post('/employee', (req: Request, res: Response) => {
    const { cedula, fullname, pricePerHour } = req.body;
    let count =1
    if (!cedula || !fullname || !pricePerHour) {
        res.status(400).json({ Message: 'missing required fields' });
        return;
    }

    if (employees.find(emp => emp.cedula === cedula)) {
        res.status(400).json({ Message: 'Cedula already exists' });
        return;
    }
     count += 1
    const newEmployee: Employee = { id:count, cedula, fullname, pricePerHour };
    employees.push(newEmployee);
    res.status(201).json({ message: 'employee added' });
});

app.post('/employee/:id/hours', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { hours } = req.body;
    if (!isNaN(hours) || hours <= 0) {
        res.status(400).json({ Message: 'Invalid hours value' });
        return;
    }

    const employeeExists = employees.find(emp => emp.id === id);
    if (!employeeExists) {
        res.status(404).json({ Message: 'Employee not found' });
        return;

    }

    const newWorkedHour: WorkedHour = { employeeId: id, hours };
    workedHours.push(newWorkedHour);
    res.status(201).json({ message: 'Worked hours added successfully' });

});

app.put('/employee/:id', (req: Request, res: Response) => {

    const id = parseInt(req.params.id);
    const { fullname, pricePerHour } = req.body;
    const employeeIndex = employees.findIndex(emp => emp.id === id);
    if (employeeIndex === -1) {
        res.status(404).json({ Message: 'Employee not found' });
        return;

    }
    if (fullname) {
        employees[employeeIndex].fullname = fullname;
    }
    if (pricePerHour) {
        employees[employeeIndex].pricePerHour = pricePerHour;
    }
    res.json({ message: 'Employee updated succesfuly' })

});

app.delete('/employee/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    employees = employees.filter(emp => emp.id !== id);
    workedHours = workedHours.filter(HOUR => HOUR.employeeId !== id);
    res.json({ message: 'Employee and associated woeked hours deleted successfully' })

});

const port = 3000;

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});