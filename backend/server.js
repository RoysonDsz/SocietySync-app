import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import connectDB from './db.js';
import assignRouter from './routes/assign.route.js';
import buildingRouter from './routes/building.route.js';
import complaintRouter from './routes/complaint.route.js';
import eventRouter from './routes/event.route.js';
import NotificationRouter from './routes/notification.route.js';
import parkingRouter from './routes/parking.route.js';
import signupRouter from './routes/signup.route.js';
import visitorRouter from './routes/visitor.route.js';
import alertRouter from './routes/visitorAlert.route.js';



const app = express();
app.use(cors());
app.use(bodyParser.json()); 
connectDB();

app.use('/api/user', signupRouter);
app.use('/api/notification', NotificationRouter);
app.use('/api/visitor', visitorRouter);
app.use('/api/complaint', complaintRouter);
app.use('/api/event', eventRouter);
app.use('/api/parking', parkingRouter);
app.use('/api/building', buildingRouter);
app.use('/api/assign', assignRouter);
app.use('/api/alert', alertRouter);


app.listen(5050, '0.0.0.0',()=>{
    console.log(`Server running on port 5050`)
});