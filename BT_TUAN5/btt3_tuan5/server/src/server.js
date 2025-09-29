import 'dotenv/config';
//import các nguồn cần dùng
import express from 'express';
import configViewEngine from './config/viewEngine.js';
import apiRoutes from './routes/api.js';
import connection from './config/database.js';
//import getHomepage from './controllers/homeController.js';
import cors from 'cors';
const app = express(); // cấu hình app là express

// cấu hình port, nếu tìm thấy port trong env, không thì trả về 8888
const port = process.env.PORT || 8888;
app.use(cors()); //config cors
app.use(express.json()); ////config req.body cho json
app.use(express.urlencoded({ extended: true })); // for form data
configViewEngine(app); //config template engine

//config route cho view ejs
const webAPI = express.Router();
//webAPI.get("/", getHomepage);
app.use("/", webAPI);

//khai bảo route cho API
app.use("/v1/api/", apiRoutes);

(async () => {
  try {
    // kết nối database using mongoose
    await connection();
    //láng nghe port trong env
    app.listen(port, () => {
      console.log(`Backend Nodejs App listening on port ${port}`);
    });
  } catch (error) {
    console.log(">>> Error connect to DB: ", error);
  }
})();
