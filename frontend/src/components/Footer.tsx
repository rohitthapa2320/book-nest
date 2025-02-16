const Footer = () => {
  return (
    <div className="bg-blue-800 py-6 px-4">
      <div className="container flex mx-auto flex-col md:flex-row justify-between items-center">
        <span className="text-3xl text-white font-bold tracking-tight">
          HotelHub.com
        </span>
        <span className="text-white flex font-bold tracking-tight flex-col mt-4 md:flex-row gap-4">
          <p className="cursor-pointer underline">Privacy Policy</p>
          <p className="cursor-pointer underline">Terms of Service</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
