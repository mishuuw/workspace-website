import navBar from "./navBar.jsx"

export default function NotFound() {
    return (
        <>
            {navBar()}
            <h1>Page not found or access is forbidden.</h1>
        </>
    )
}