import './App.css';
import { Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';


import Login from './components/Login';
import Navbar from './components/navbar/Navbar';
import Profile from './components/profile/Profile';
import Locality from './components/locality/Locality';
import Zone from './components/zone/Zone';
import Index from './components/zone/inside/Index';
import User from './components/user/User';
import UserDetails from './components/user/UserDetails';
import RIndex from './components/request/Index';
import AIndex from './components/attendance/Index';
import MIndex from './components/attendance/master/Index';
import ReportIndex from './components/reports/Index';
import UpdateAttendance from './components/attendance/inside/UpdateAttendance';
import Home from './components/home/Home';
function App() {
  if (Cookies.get('tkn') && Cookies.get('isAuth') === 'true' && Cookies.get('isr').split("00000")[1] === 'isra') {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} ></Route>
          <Route path="/profile" exact element={<Profile />} ></Route>
          <Route path="/locality" exact element={<Locality />} ></Route>
          <Route path="/zone" exact element={<Zone />} ></Route>
          <Route path="/zone/:id" exact element={<Index />} ></Route>
          <Route path="/users" exact element={<User />} ></Route>
          <Route path="/user/:id" exact element={<UserDetails />} ></Route>
          <Route path="/requests" exact element={<RIndex />} ></Route>
          <Route path="/attendance" exact element={<AIndex />} ></Route>
          <Route path="/attendance/master" exact element={<MIndex />} ></Route>
          <Route path="/attendance/:id" exact element={<UpdateAttendance />} ></Route>
          <Route path="/reports" exact element={<ReportIndex />} ></Route>
        </Routes>
      </>
    );
  } else {
    return (
      <>
        <Routes>
          <Route path="/" exact element={<Login />} ></Route>
        </Routes>
      </>
    );
  }
}

export default App;
