import React from 'react';
import { render } from "react-dom";
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Company from './company';
import Event from './event';
import Logincompany from './logincompany';
import Maincom from './maincom';
import Cdetail from './cdetail';
import Survey2 from './survey2';
import Survey3 from './survey3';
import Esgreport from './esgreport';
import Mypage from './mypage';
import Insertevent from './insertevent';
import Loginuser from './loginuser';
import Survey1 from './survey1';
import Managemain from './managemain';
import Managecom from './managecom';
import SignUp_User from './signUp_user';
import SignUp_Company from './signUp_company';
import Modal from 'react-modal'

Modal.setAppElement('#root');

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path='/home/company/:companyId' element={<Company />} />
      <Route path='/event/:companyid/:eventidx' element={<Event />} />
      <Route path='/logincompany' element={<Logincompany />} />
      <Route path='/home' element={<Maincom />} />
      <Route path='/cdetail/:companyId' element={<Cdetail />} />
      <Route path='/survey1' element={<Survey1 />} />
      <Route path='/survey2' element={<Survey2 />} />
      <Route path='/survey3' element={<Survey3 />} />
      <Route path='/esgreport' element={<Esgreport />} />
      <Route path='/home/user/:userId' element={<Mypage />} />
      <Route path='/insertevent' element={<Insertevent />} />
      <Route path='/loginuser' element={<Loginuser />} />
      <Route path='/managemain' element={<Managemain />} />
      <Route path='/managemain/:companyId' element={<Managecom />} />
      <Route path='/signup_company' element={<SignUp_Company />} />
      <Route path='/signup_user' element={<SignUp_User />} />
      <Route path='/esgreport' element={<Esgreport />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
