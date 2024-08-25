import "./navigate-style.css";
import categories from "./categories.json";
import navigateData from "./navigate.json";
import { useLocation, Link } from "react-router-dom";

interface Props {
    basepath: string;
}

function Navigate({ basepath }: Props) {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav>
            <ul>
                {navigateData.map((item) => (
                    <li key={item.href}>
                        <Link className={currentPath === item.href ? 'active' : ''} to={`${basepath}/#${item.href.slice(1)}`}> {item.title} </Link>
                    </li>
                ))}

                {categories.map((item) => (
                    <li key={item}>
                        <Link className={currentPath === `/${item}` ? 'active' : ''}  to={`${basepath}/#${item}`}> {item} </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navigate;
