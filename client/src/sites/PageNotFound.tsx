import useTitle from "./useTitle";

function PageNotFound() {
    useTitle("Page not found");

    return (
        <>
        <p>Page wasn't found.</p>
        </>
    );
}

export default PageNotFound;