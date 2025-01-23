import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


class Sidebar extends React.Component {
  render() {
    return (
      <div className="d-flex flex-column justify-content bg-dark text-white p-4 ">

        <a href=" d-flex align-items-center">
            <i className="bi bi-bootstrap"></i>
         <span>Document Management </span>
        </a>
        <hr className="text-secondary mt-2" />
        <ul className="nav nav-pills flex-column p-0 m-0">
            <li className="nav-item p-1">
                <a href="#" className="nav-link text-white" >
                <i className="bi bi-speedometer me-2 fs-5"></i>

                    <span>New Business</span>
                </a>
            </li>
            <li className="nav-item p-1">
                <a href="#" className="nav-link text-white" >
                <i className="bi bi-group me-2 fs-5"></i>

                    <span>Collections</span>
                </a>
            </li>
            <li className="nav-item p-1">
                <a href="#" className="nav-link text-white" >
                <i className="bi bi-document me-2 fs-5"></i>

                    <span className="material-icons">Busniess Documents</span>
                </a>
            </li>
        </ul>
        {/* <h2>Online: {this.props.online}</h2>
        <h2>Users</h2>
        <ul>
          {this.props.users.map((user, i) => {
            return (
              <li key={i}>
                <span>{user.name}</span>
              </li>
            );
          })}
        </ul> */}
      </div>
    );
  }
}
export default Sidebar;