import koaRouter from 'koa-Router';
// import AdminController from '../controller/AdminController';
import IndexController from '../controller/indexController';
// import LoginController from '../controller/LoginController';
import AuthMiddleware from '../middleware/AuthMiddleware'
// import UploadController from '../controller/UploadController';
const router=new koaRouter({prefix:'/admin'});
router.get('/',IndexController.index)
router.use(AuthMiddleware)
// router.post('/login',LoginController.index)
// router.get('/admin/list',AdminController.getAdminList)
// router.post('/upload',UploadController.index)
// router.post('/upload1',UploadController.upload)
export default router;
