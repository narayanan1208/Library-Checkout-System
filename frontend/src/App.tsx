import { BrowserRouter, Route, Routes } from "react-router-dom";
import BooksProvider from "./context/BooksContext";
import "./App.css";
import HomePage from "./pages/HomePage";
import NavBar from "./components/NavBar";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import BookView from "./pages/BookView";
import UserAccount from "./pages/UserAccount";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <>
      <BooksProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/:id" element={<BookView />} />
            <Route path="/user-account" element={<UserAccount />} />
          </Routes>
        </BrowserRouter>
      </BooksProvider>
    </>
  );
}

export default App;
