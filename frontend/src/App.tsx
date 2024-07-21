import { Route, BrowserRouter as Router , Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout isAuthPage={false}>
            <p>Home Page</p>
          </Layout>
        } />
        <Route path="/register" element={
          <Layout isAuthPage={true}>
            <Register />
          </Layout>
        } />
        <Route path="/sign-in" element={
          <Layout isAuthPage={true}>
            <SignIn />
          </Layout>
        } />
        <Route path="/search" element={
          <Layout isAuthPage={false}>
            <p>Search Page</p>
          </Layout>
        } />
        <Route path="*" element={
          <Layout isAuthPage={false}>
            <p>Not Found Page</p>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App;