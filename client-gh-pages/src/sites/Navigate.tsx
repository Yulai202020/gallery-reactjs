import "./navigate-style.css";
import categories from "./categories.json"
import navigateData from "./navigate.json";
import { useLocation } from "react-router-dom";

interface Probs {
    basepath: string,
}

function Navigate({ basepath } : Probs) {
    console.log(basepath);

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav>
            <ul>
                {navigateData.map((item) => (
                    <li>
                        <a className={currentPath === item.href ? 'active' : ''} href={basepath +"/#" + item.href.slice(1)}>{item.title}</a>
                    </li>
                ))}

                {categories.map((item) => (
                    <li>
                        <a className={currentPath.slice(1) === item ? 'active' : ''} href={basepath +"/#" + item}>{item}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );

}

export default Navigate;