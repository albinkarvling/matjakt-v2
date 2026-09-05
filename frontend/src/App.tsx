import "./App.css";
import { Route, Routes } from "react-router";
import { SearchPage } from "./features/SearchPage/SearchPage";

function App() {
    return (
        <Routes>
            <Route path="/search" Component={SearchPage} />
        </Routes>
    );
}

export default App;
