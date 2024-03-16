import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { history } from "./utils";
import "./App.css";
import { AuthComponent } from "@/components/AuthComponent";
import { lazy, Suspense } from "react";
// 按需导入组件
// const Login = lazy(() => import('./pages/Login'))
const Layout = lazy(() => import("./pages/Layout"));
const Home = lazy(() => import("./pages/Home"));
const Excel = lazy(() => import("./pages/ExcelManage"));
const Publish = lazy(() => import("./pages/Publish"));
const About = lazy(() => import("./pages/About"));
const ExcelUpload = lazy(() => import("./pages/Start"));
const  CsvToTable = lazy(() => import("./pages/CsvToTable"));

function App() {
  return (
    // 路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                marginTop: 200,
              }}
            >
              loading...
            </div>
          }
        >
          <Routes>
            {/* 创建路由path和组件对应关系 */}
            {/* Layout需要鉴权处理的 */}
            {/* 这里的Layout不一定不能写死 要根据是否登录进行判断 */}
            <Route path="/" element={<Navigate to="/list" />}></Route>
            <Route path="/manage" element={<Layout />}>
              <Route path="analysis" index element={<Home />}></Route>
              <Route path="/manage" element={<Excel />}></Route>
            </Route>
            {/* 这个不需要 */}
            <Route
              path="/about"
              element={
                <AuthComponent>
                  <Layout />
                </AuthComponent>
              }
            >
              <Route path="/about" element={<About />}></Route>
            </Route>
            <Route
              path="/list"
              element={
                <AuthComponent>
                  <Layout />
                </AuthComponent>
              }
            >
              <Route path="/list" element={<ExcelUpload />}></Route>
              <Route path='/list/detail' element={< CsvToTable/>}></Route>
            </Route>
          </Routes>
        </Suspense>
      </div>
    </HistoryRouter>
  );
}

export default App;
