import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


class Sidebar extends React.Component {
    render() {
        return (
            <div className=" d-flex flex-column justify-content-between bg-dark text-white p-4 vh-100 ">
                <div>

                    <a href=" d-flex align-items-center">
                        <i className="bi bi-bootstrap fs-5 me-3"></i>
                        <span fs-4>Document Management </span>
                    </a>
                    <hr className="text-secondary mt-2" />
                    <ul className="nav nav-pills flex-column p-0 m-0">
                        <li className="nav-item p-1">
                            <a href="new" className="nav-link text-white" >
                                <i className="bi bi-document me-3 fs-5"></i>

                                <span className="fs-5">Process</span>
                            </a>
                        </li>

                        <li className="nav-item p-1">
                            <a href="process" className="nav-link text-white" >
                                <i className="bi bi-group me-3 fs-5"></i>

                                <span className="fs-5">Collections</span>
                            </a>
                        </li>
                        <li className="nav-item p-1">
                            <a href="users" className="nav-link text-white" >
                                <i className="bi bi-document me-3 fs-5"></i>

                                <span className="fs-5">Roles</span>
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
                <div>
                    <hr className="text-secondary mt-2" />
                    <i className="bi bi-speedometer me-2 fs-5"></i>
                    <span>Settings</span>
                </div>


            </div>
        );
    }
}
export default Sidebar;