import { Link } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

const Topbar = ({ backTo, backLabel }) => {
    const { user, handleLogout } = useAuth();

    return (
        <header className="topbar">
            <div className="topbar__left">
                {backTo && (
                    <Link to={backTo} className="topbar__back" aria-label={backLabel || "Go back"}>
                        <ArrowLeft size={18} />
                    </Link>
                )}
                <Link to="/" className="topbar__logo">PrepForge</Link>
            </div>
            <div className="topbar__right">
                <span className="topbar__user">{user?.username}</span>
                <button className="btn btn--ghost" onClick={handleLogout}>
                    Sign out
                </button>
            </div>
        </header>
    );
};

export default Topbar;
