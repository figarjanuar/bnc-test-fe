import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MainLayout({ children, title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userName, serUserName] = useState('')
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  useEffect(() => {
    if(userName == '') {
      const userData = JSON.parse(localStorage.getItem('userInfo'))
      serUserName(userData.name)
    }
  }, [userName])

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-200 ease-in-out md:relative md:translate-x-0 md:block`}>
        <nav>
          <Link href="/home" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Home</Link>
          <Link href="/fund-transfer" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Fund Transfer</Link>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden ">
        <div className='flex justify-end py-5 px-2 gap-5 bg-gray-200'>
          <p>{userName}</p>
          <p>|</p>
          <p className="cursor-pointer" onClick={handleLogout}>Logout</p>
        </div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <div className="bg-white shadow-md rounded p-6 mb-4">
            <p className='m-0'>{title}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}