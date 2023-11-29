// import { useRouter } from 'next/router'
// import { useSelector, useDispatch } from 'react-redux'
// import { AppState } from '../store/store'
// import { useEffect, useState } from 'react'
// import { AppDispatch } from '@/components/store/store'
// import { fetchUserById } from '@/components/store/user'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faAddressBook, faAngleRight, faBars, faFileInvoice, faHouse, faUserPlus, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
// import { FaHistory } from 'react-icons/fa'
// import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// import Loader from '../spinners/Loader'
// import AddProject from '../image/AddProject'
// import Bill from '../image/Bill'

// const SideBar = () => {
//     const router = useRouter()
//     const uname = useSelector<AppState>(state => state.user.user?.name) as string
//     const loading = useSelector<AppState>(state => state.user.isLoading) as boolean
//     const dispatch = useDispatch<AppDispatch>()
//     const { collapseSidebar } = useProSidebar();

//     const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

//     useEffect(() => {
//         const userId = localStorage.getItem('user') as string
//         dispatch(fetchUserById(userId))
//     }, [])

//     return (
//         <>
//             <Sidebar style={{ height: "100vh" }} defaultCollapsed={false} className='md:static sm:fixed'>
//                 <Menu>
//                     <MenuItem
//                         icon={<MenuOutlinedIcon />}
//                         onClick={() => {
//                             collapseSidebar();
//                         }}
//                         style={{ textAlign: "center" }}
//                         className='my-4'
//                     >
//                         <div className='p-4'>
//                             {loading ? <Loader /> : uname.toLowerCase().startsWith('gammaedge') ? <img src="/images/logo.png" alt="" className="w-full h-9" /> : <img src="/images/cubexoLogo.png" alt="" className="w-3/4" />
//                             }
//                         </div>
//                     </MenuItem>

//                     <MenuItem className='mt-4 mb-2'
//                         icon={<FontAwesomeIcon icon={faHouse} className='text-stone-900 text-lg' />}
//                         onClick={() => router.push('/dashboard')}>
//                         <span className='capitalize tracking-normal font-semibold text-slate-700'>Dashboard</span>
//                     </MenuItem>

//                     {/* <MenuItem className='mt-4 mb-2'
//                         icon={
//                             <div className={`group relative ${isCollapsed ? 'cursor-pointer' : ''}`}
//                                 onMouseEnter={() => {
//                                     if (isCollapsed) {
//                                         setIsCollapsed(true);
//                                     }
//                                 }}
//                                 onMouseLeave={() => setIsCollapsed(false)}>
//                                 <FontAwesomeIcon icon={faHouse} className='text-stone-900 text-lg' />

//                                 {isCollapsed && (
//                                     <div className='hidden group-hover:block absolute left-full top-0 bg-black text-white p-1 rounded-md shadow-lg'>
//                                         Dashboard
//                                     </div>
//                                 )}
//                             </div>

//                         }

//                         onClick={() => router.push('/dashboard')}>
//                         <span className='capitalize tracking-normal font-semibold text-slate-700'>Dashboard</span>
//                     </MenuItem> */}

//                     <MenuItem className='my-2'
//                         icon={<FontAwesomeIcon icon={faSquarePlus} className='text-stone-900 text-lg' />}
//                         onClick={() => router.push('/addClient')}>
//                         <span className='capitalize tracking-normal font-semibold text-slate-700'>Add Client</span>
//                     </MenuItem>
//                     <MenuItem className='my-2'
//                         // icon={<FontAwesomeIcon icon={faAddressBook} className='text-stone-900 text-lg' />}
//                         icon={<AddProject />}
//                         onClick={() => router.push('/addProject')}>
//                         <span className='capitalize tracking-normal font-semibold text-slate-700'>Add Project</span>
//                     </MenuItem>
//                     <MenuItem className='my-2'
//                         // icon={<ReceiptOutlinedIcon className='text-xl' />}
//                         icon={<Bill />}
//                         onClick={() => router.push('/generateInvoice')}>
//                         <span className='capitalize tracking-normal font-semibold text-slate-700'>Generate Invoice</span>
//                     </MenuItem>
//                     <MenuItem className='my-2'
//                         icon={<FaHistory className='text-lg' />}
//                         onClick={() => router.push('/history')}>
//                         <span className='capitalize tracking-normal font-semibold text-slate-700'>Invoice History</span>
//                     </MenuItem>
//                 </Menu>
//             </Sidebar>
//         </>
//     )
// }

// export default SideBar

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../store/store";
import { useEffect } from "react";
import { AppDispatch } from "@/components/store/store";
import { fetchUserById } from "@/components/store/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FaHistory } from "react-icons/fa";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import Loader from "../spinners/Loader";
import AddProject from "../image/AddProject";
import Bill from "../image/Bill";

const SideBar = () => {
  const router = useRouter();
  const uname = useSelector<AppState>(
    (state) => state.user.user?.name
  ) as string;
  const loading = useSelector<AppState>(
    (state) => state.user.isLoading
  ) as boolean;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const userId = localStorage.getItem("user") as string;
    dispatch(fetchUserById(userId));
  }, []);

  return (
    <>
      <Sidebar
        style={{ height: "100vh", width: '300px', minWidth: '300px' }}
        collapsed={false}
        className="md:static sm:fixed"
      >
        <Menu>
          <MenuItem
            // icon={<MenuOutlinedIcon />}
            style={{ textAlign: "center" }}
            className="my-4"
          >
            <div className="p-4 flex justify-center items-center">
              {loading ? (
                <Loader />
              ) : uname.toLowerCase().startsWith("gammaedge") ? (
                <img src="/images/logo.png" alt="" className="w-full" />
              ) : (
                <img src="/images/cubexoLogo.png" alt="" className="w-3/4" />
              )}
            </div>
          </MenuItem>

          <MenuItem
            className="mt-8 mb-2"
            icon={
              <FontAwesomeIcon
                icon={faHouse}
                className="text-stone-900 text-lg"
              />
            }
            onClick={() => router.push("/dashboard")}
          >
            <span className="capitalize tracking-normal font-semibold text-slate-700">
              Dashboard
            </span>
          </MenuItem>

          <MenuItem
            className="my-2"
            icon={
              <FontAwesomeIcon
                icon={faSquarePlus}
                className="text-stone-900 text-lg"
              />
            }
            onClick={() => router.push("/addClient")}
          >
            <span className="capitalize tracking-normal font-semibold text-slate-700">
              Add Client
            </span>
          </MenuItem>
          <MenuItem
            className="my-2"
            icon={<AddProject />}
            onClick={() => router.push("/addProject")}
          >
            <span className="capitalize tracking-normal font-semibold text-slate-700">
              Add Project
            </span>
          </MenuItem>
          <MenuItem
            className="my-2"
            icon={<Bill />}
            onClick={() => router.push("/generateInvoice")}
          >
            <span className="capitalize tracking-normal font-semibold text-slate-700">
              Generate Invoice
            </span>
          </MenuItem>
          <MenuItem
            className="my-2"
            icon={<FaHistory className="text-lg" />}
            onClick={() => router.push("/history")}
          >
            <span className="capitalize tracking-normal font-semibold text-slate-700">
              Invoice History
            </span>
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  );
};

export default SideBar;
