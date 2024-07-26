import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";

interface LayoutProps {
  children: React.ReactNode;
  isAuthPage: boolean;
  showSearchBar?: boolean;
}

const Layout = ({ children, isAuthPage, showSearchBar }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {!isAuthPage && <Hero />}
      {showSearchBar && (
        <div className="container mx-auto">
          <SearchBar />
        </div>
      )}
      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
