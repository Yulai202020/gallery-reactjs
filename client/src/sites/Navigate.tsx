import "./navigate-style.css";
import navigateData from './navigate.json';
import { useLocation } from "react-router-dom";

function Navigate() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav>
            <ul>
                {navigateData.map((item) => (
                    <li>
                        <a className={currentPath === item.href ? 'active' : ''} href={item.href}>{item.title}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navigate;