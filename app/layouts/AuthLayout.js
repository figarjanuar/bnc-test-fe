import Navbar from "../components/Navbar";

export default function AuthLayout({ children }) {
  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg w-[600px] flex flex-col align-middle justify-center items-center">
        {children}
      </div>
    </div>
    </>
  )
}