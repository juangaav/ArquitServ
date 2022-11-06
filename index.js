const express = require('express');
const employees = require('./resources/employees.json');
const app = express();
app.use(express.json());

app.get("/api/employees", (req, res, err) => {
    if(req.query.page !== undefined){
        let page = parseInt(req.query.page);
        switch(page) {
            case 0:
                if(employees.length > 0){
                    res.status(200).json([employees[0]]);
                }else{
                    res.status(401).send("No employees found.");
                }
                break;
            case 1:
                if(employees.length > 1){
                    res.status(200).json([employees[0], employees[1]]);
                }else{
                    res.status(200).json([employees[0]]);
                }
                break;
            case 2:
                if(employees.length > 3){
                    res.status(200).json([employees[2], employees[3]]);
                }else{
                    res.status(200).json([employees[0]]);
                }
                break;
            default:
                const array =[];
                if(Number.isInteger(page)){
                    let lowerLimit = 2 * (page - 1);
                    let higherLimit = lowerLimit + 1;
                    for (const employee in employees) {
                        if(employee >= lowerLimit && employee <= higherLimit){
                            array.push(employees[employee]);
                        }
                    }                    
                    res.status(200).json(array);
                }else{
                    res.status(401).send("Invalid Page Number");
                }
                break;
        }
    }else if(req.query.user !== undefined){
        let resultArray = [];
        for (const employee in employees) {
            if(employees[employee].privileges === 'user'){
               resultArray.push(employees[employee]);
            }
        }
        res.status(200).json(resultArray);
    }else if(req.query.badges !== undefined){
        let resultArray = [];
        for (const employee in employees) {
            const badges = employees[employee].badges;
            if(badges.includes('black')){
                resultArray.push(employees[employee]);
            } 
        }
        res.status(200).json(resultArray);
    }
});

app.get("/api/employees/oldest", (req, res, err) => {
    let oldestAge = 0;
    let employee = {};
    for (employee in employees) {
        if(employee.age > oldestAge){
            oldestAge = employee.age;
        }
    }
    res.status(200).json(employees[employee]);    
});


app.post("/api/employees", (req, res, err) => {
    let validRequest = false;
    const body = req.body[0];
    if(body.hasOwnProperty('name')){
        if(body.hasOwnProperty('age')){
            if(body.hasOwnProperty('phone')){
                if(body.phone.hasOwnProperty('personal') && body.phone.hasOwnProperty('work') && body.phone.hasOwnProperty('ext')){
                    if(body.hasOwnProperty('privileges')){
                        if(body.hasOwnProperty('favorites')){
                            if(body.favorites.hasOwnProperty('artist') && body.favorites.hasOwnProperty('food')){
                                if(body.hasOwnProperty('finished')){
                                    if(body.finished.length === 2){
                                        if(Number.isInteger(body.finished[0]) && Number.isInteger(body.finished[1])){
                                            if(body.hasOwnProperty('badges')){
                                                if(body.badges.length === 2){
                                                    if((typeof body.badges[0] === 'string' || body.badges[0] instanceof String) && (typeof body.badges[1] === 'string' || body.badges[1] instanceof String)){
                                                        if(body.hasOwnProperty('points')){
                                                            if(Array.isArray(body.points)){
                                                                const pointsArray = body.points;
                                                                let correctFields = 0;
                                                                for (const points in pointsArray) {
                                                                    if(Number.isInteger(pointsArray[points].points) && Number.isInteger(pointsArray[points].bonus)){
                                                                        correctFields++;
                                                                    }
                                                                }
                                                                if(correctFields === pointsArray.length){
                                                                    validRequest = true;
                                                                }
                                                            }
                                                        }                                                    
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if(!validRequest){
        res.status(400).send({"code": "bad_request"});
    }else{
        employees.push(req.body);
        res.status(200).send({"code": "Employee added successfully"});
    }
});

app.get("/api/employees/:name", (req, res, err) => {
    let foundEmployee = false;
    for (const employee in employees) {
        if(employees[employee].name === req.params.name){
            foundEmployee = true;
            res.status(200).json(employees[employee]);
            break;
        }
    }
    if(!foundEmployee){
        res.status(401).send({"code": "bad_request"});
    }
});

app.listen(8000, () => {
    console.log('Ready');
});