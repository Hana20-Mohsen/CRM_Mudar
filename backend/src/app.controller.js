import connectDB from "./DB/connection.js";
import userController from './modules/user/user.controller.js'
import taskController from './modules/tasks/task.controller.js'
import reviewController from './modules/review/review.controller.js'
import boardController from './modules/board/board.controller.js'
import listController from './modules/list/list.controller.js'
import departmentController from './modules/department/department.controller.js'
import reportController from './modules/report/report.controller.js'
import assignedtasksController from './modules/assignedTasks/assignedTasks.controller.js'
import leadController from './modules/leads/lead.controller.js'
import contactsController from './modules/contacts/contacts.controller.js'
import dealsController from './modules/deals/dealsController.js'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs'
import { globalErrorHandling } from "./utilities/error/error.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log('__dirname : ', __dirname);


const bootstrap = (app, express) => {
  app.use(express.json());
  // app.use('/static', express.static(path.join(__dirname, 'utilities/email/template/img')));

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://crm-mudar-hanas-projects-30a8b9bd.vercel.app",
      "https://crm-mudar.vercel.app",
      'https://crm-mudar-git-main-hanas-projects-30a8b9bd.vercel.app',
      'https://crm-mudar-jk4nw6ze1-hanas-projects-30a8b9bd.vercel.app'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ SAME config

  // app.options('*', cors());
  // -----------------socket io middleware-----------------
  //   app.use((req, res, next) => {
  //     req.io = io; 
  //     next();
  // });
  console.log("__dirname", __dirname);

  const uploadsPath = path.join(__dirname, '../uploads');
  console.log('Serving static files from:', uploadsPath);
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  app.use('/uploads', express.static(uploadsPath));

  app.get('/', (req, res, next) => {
    return res.status(200).json({
      message: "welcome in crm project..."
    })
  })



  app.use('/api/v1/user', userController)
  app.use('/api/v1/review', reviewController)
  app.use('/api/v1/task', taskController)
  app.use('/api/v1/board', boardController)
  app.use('/api/v1/list', listController)
  app.use('/api/v1/department', departmentController)
  app.use('/api/v1/report', reportController)
  app.use('/api/v1/assignedTasks', assignedtasksController)
  app.use('/api/v1/lead', leadController)
  app.use('/api/v1/contact', contactsController)
  app.use('/api/v1/deal', dealsController)

  app.all('*', (req, res, next) => {
    return res.status(404).json({
      message: 'In-Valid routing!!'
    })
  })

  app.use(globalErrorHandling)

  connectDB()
}

export default bootstrap;