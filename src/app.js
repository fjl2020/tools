const express=require('express');
const morgan=require('morgan');
const cors=require('cors');
const validateUser=require('./Utils/validateUser')

const app=express();

const BodyParser=require('body-parser');

app.set('port',process.env.PORT||4000);

app.set('key','secret');

app.disable('x-powered-by');
//middlewares
app.use(express.json());
// app.use(bodyParser.urlencoded({extended:true}))

// app.use(morgan('dev'));
app.use(cors());

//routes
app.use('/api/login',require('./Routes/loginRoutes'));
app.use('/api/operarios',validateUser,require('./Routes/operarioRoutes'));
app.use('/api/maquinas',validateUser,require('./Routes/maquinaRoutes'));
app.use('/api/movMaquinas',validateUser,require('./Routes/movMaquinaRoutes'));
app.use('/api/stack',validateUser,require('./Routes/stackRoutes'));


module.exports=app;