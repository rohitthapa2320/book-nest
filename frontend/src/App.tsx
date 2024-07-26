import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./context/AppContext";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import HotelDetails from "./pages/HotelDetails";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout isAuthPage={false} showSearchBar={true}>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout isAuthPage={true}>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout isAuthPage={true}>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout isAuthPage={false} showSearchBar={true}>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:id"
          element={
            <Layout isAuthPage={false}>
              <HotelDetails />
            </Layout>
          }
        />
        {isLoggedIn && (
          <>
            <Route
              path="/my-hotels"
              element={
                <Layout isAuthPage={true}>
                  <MyHotels />
                </Layout>
              }
            />
            <Route
              path="/add-hotel"
              element={
                <Layout isAuthPage={true}>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout isAuthPage={true}>
                  <EditHotel />
                </Layout>
              }
            />
          </>
        )}
        <Route
          path="*"
          element={
            <Layout isAuthPage={false}>
              <p>Not Found Page</p>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
