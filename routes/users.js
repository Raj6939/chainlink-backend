import { Router } from "express";
import transfer from "../controller/userController.js"
export default()=>{
  const router = Router();
  router.get('/send/:id',transfer.sendRequest)
  return router
}