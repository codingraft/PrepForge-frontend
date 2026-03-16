import { Outlet } from "react-router";
import Topbar from "./Topbar";

const AppLayout = ({ backTo, backLabel }) => {
    return (
        <div className="app-shell">
            <Topbar backTo={backTo} backLabel={backLabel} />
            <Outlet />
        </div>
    );
};

export default AppLayout;
