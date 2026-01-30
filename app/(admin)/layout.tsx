import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SideBar from "@/components/SideBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="bg-gray-200 pt-10">
          <SideBar />
        </div>
        {children}
      </div>

      <Footer />
    </>
  );
}
