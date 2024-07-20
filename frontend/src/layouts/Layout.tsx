import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

interface LayoutProps{
  children: React.ReactNode;
  isAuthPage: boolean
};

const Layout = ({
  children,
  isAuthPage
}:LayoutProps) => {
  return(
    <div className="flex flex-col min-h-screen">
      <Header />
      {
        !isAuthPage && <Hero /> 
      }
      <div className="container mx-auto py-10 flex-1">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout;