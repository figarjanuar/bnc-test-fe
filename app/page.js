'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm, useWatch } from 'react-hook-form'
import axios from 'axios'
import Link from 'next/link'
import Toast from './components/Toast'
import AuthLayout from './layouts/AuthLayout'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showToast, setShowToast] = useState(false)
  const [toastData, setToastData] = useState({})
  const router = useRouter()

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await axios.post('http://localhost:8080/api/auth/login', data)
      console.log(response.data);
      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo))
      router.push('/home')
    } catch (error) {
      let errorMessage = 'Fail to Register'
      if(error.response.data) {
        errorMessage = error.response.data.message;
      }
      setShowToast(true)
      setToastData({
        message: errorMessage,
        type: 'error'
      })
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-4xl font-bold mb-8">Test App</h1>
      <h4>Do not have account? <Link href="/register" className='text-orange-400'>Register here</Link></h4>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mt-8">
        <label>Corporate Account Number</label>
        {errors.corporateBankAccountNumber && <p className="text-red-500 text-xs italic">{errors.corporateBankAccountNumber.message}</p>}
        <input
          {...register('corporateBankAccountNumber', { required: 'Corporate Account Number is required' })}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
          type="text"
        />

        <label>User ID</label>
        {errors.userId && <p className="text-red-500 text-xs italic">{errors.userId.message}</p>}
        <input
          {...register('userId', { required: 'User ID is required' })}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
          type="text"
        />

        <label>Password</label>
        {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
        <input
          {...register('password', { required: 'Password is required' })}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
          type="password"
        />

        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-5">
          Login
        </button>
      </form>

      {showToast && 
        <Toast 
          message={toastData.message}
          type={toastData.type}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      }
    </AuthLayout>
  )
}