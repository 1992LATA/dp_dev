import React from "react";
import { BiAddToQueue } from "react-icons/bi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";


class Sidebar extends React.Component {
    render() {
        return (
            <div className=" fixed bg-gray-800 px-4 h-full py-2 w-64 ">
                <div className='my-2 mb-4'>

                   <div>
                    <h1 className="text-2x text-white font-bold" >Admin</h1>
                   </div>
                    <hr/>
                    <ul className="mt-3">
                        <li className="mb-2 rounded">
                            <a href="new" className='px-3' >
                                <BiAddToQueue className = ' inline-block w-6 h-6 mr-2 -mt-2' ></BiAddToQueue>
                                Add Document
                            </a>
                        </li>

                        <li className='mb-2 rounded'>
                            <a href="process" className='px-3' >
                                <MdOutlineCollectionsBookmark className = 'inline-block w-6 h-6 mr-2 -mt-2'></MdOutlineCollectionsBookmark>
                                Collections
                            </a>
                        </li>
                        <li className='mb-2 rounded'>
                            <a href="users" className='px-3' >
                                <BsFillPeopleFill className = 'inline-block w-6 h-6 mr-2 -mt-2 ' ></BsFillPeopleFill>
                                Roles
                            </a>
                        </li>

                        {/* <li className="nav-item p-1">
                        <a href="home" className="nav-link text-white" >
                            <i className="bi bi-speedometer me-3 fs-5"></i>

                            <span fs-5>Business Process</span>
                        </a>
                    </li> */}
                    
                        {/* <li className="nav-item p-1">
                        <a href="edit/:id" className="nav-link text-white" >
                            <i className="bi bi-document me-2 fs-5"></i>

                            <span className="material-icons">Document Upload</span>
                        </a>
                    </li> */}
                    </ul>
                </div>
              

            </div>
        );
    }
}
export default Sidebar;