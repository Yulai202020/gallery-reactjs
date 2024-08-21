import useTitle from "./useTitle";

function PageNotFound() {
    useTitle("Page not found");

    return (
        <>
        <p>Page not found!</p>
        </>
    );
}

export default PageNotFound;