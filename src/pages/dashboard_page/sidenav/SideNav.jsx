// import React from 'react';
// import './SideNav.css';
// import { NavLink } from 'react-router-dom';
// import { GoHomeFill } from "react-icons/go";
// import { BiLogOut } from "react-icons/bi";
// import { IoSettingsOutline } from "react-icons/io5";
// import { IoMdHelpCircleOutline } from "react-icons/io";
// import { TbReport } from "react-icons/tb";
// import { IoMdTime } from 'react-icons/io';
// import { BsFuelPumpDiesel } from "react-icons/bs";
// import { LiaRouteSolid } from "react-icons/lia";
// import { FaRegBuilding } from "react-icons/fa";

// const SideNav = () => {
//     return (
//         <div className='sidenav-container desktop'>
//             <div className="logo">
//                 <h1>Sana Sana</h1>
//             </div>
//             <div className="sidenav-content">
//                 <div className="sidenav-data">
//                     <NavLink>Home</NavLink>
//                     <ul className="sidenav-links">
//                         <li>
//                             <NavLink to='/dashboard' className="sidenav-link">
//                                 <GoHomeFill />
//                                 Dashboard
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to='/assets' className="sidenav-link">
//                                 <FaRegBuilding />
//                                 Assets
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to='/maintenance' className="sidenav-link">
//                                 <IoMdTime />
//                                 Maintenance
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to='/routes' className="sidenav-link">
//                                 <LiaRouteSolid />
//                                 Routes
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to='/fuel' className="sidenav-link">
//                                 <BsFuelPumpDiesel />
//                                 Fuel
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to='/reports' className="sidenav-link">
//                                 <TbReport />
//                                 Reports
//                             </NavLink>
//                         </li>
//                     </ul>
//                 </div>
//                 <hr />
//                 <div className="sidenav-data">
//                     <NavLink>General</NavLink>
//                 </div>
//                 <ul className="sidenav-links">
//                         <li>
//                             <NavLink to='/settings' className="sidenav-link">
//                                 <IoSettingsOutline />
//                                 Settings
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink to='/help' className="sidenav-link">
//                                 <IoMdHelpCircleOutline />
//                                 Help Center
//                             </NavLink>
//                         </li>
//                         <li>
//                             <NavLink className="sidenav-link">
//                                 <BiLogOut />
//                                 Logout
//                             </NavLink>
//                         </li>
//                     </ul>
//             </div>
//         </div>
//     )
// }

// export default SideNav