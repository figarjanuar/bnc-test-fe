'use client'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm, useWatch } from 'react-hook-form'
import axios from 'axios'
import Link from 'next/link'
import AuthLayout from '../layouts/AuthLayout'
import Toast from '../components/Toast'

export default function Resigter() {
  const { register, getValues, handleSubmit, formState: { errors } } = useForm()
  const [showToast, setShowToast] = useState(false)
  const [toastData, setToastData] = useState({})
  const [isLoadingOtp, setIsLoadingOtp] = useState(false)
  const router = useRouter()

  const sendOtp = async () => {
    setIsLoadingOtp(true)
    try {
      const response = await axios.post('http://localhost:8080/api/auth/send-otp', { email: getValues('email') })
      setShowToast(true)
      setToastData({
        message: 'Success Send OTP',
        type: 'success'
      })
      setIsLoadingOtp(false)
    } catch (error) {
      let errorMessage = 'Fail Send OTP'
      if(error.response.data) {
        errorMessage = error.response.data.message;
      }
      setShowToast(true)
      setToastData({
        message: errorMessage,
        type: 'error'
      })
      setIsLoadingOtp(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await axios.post('http://localhost:8080/api/auth/register', data)
      localStorage.setItem('token', response.data.accessToken)
      localStorage.setItem('userInfo', response.data.userInfo)
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
      <h4>Do not have account? <Link href="/" className='text-orange-400'>Login here</Link></h4>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg mt-8">
        <label>Corporate Account Number</label>
        {errors.corporateBankAccountNumber && <p className="text-red-500 text-xs italic">{errors.corporateBankAccountNumber.message}</p>}
        <input
          {...register('corporateBankAccountNumber', { required: 'Corporate Account Number is required' })}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
          type="text"
        />

        <label>Corporate Name</label>
        {errors.corporateName && <p className="text-red-500 text-xs italic">{errors.corporateName.message}</p>}
        <input
          {...register('corporateName', { required: 'Corporate Name is required' })}
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

        <label>User Name</label>
        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
        <input
          {...register('name', { required: 'User Name is required' })}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
          type="text"
        />

        <label>Role</label>
        {errors.role && <p className="text-red-500 text-xs italic">{errors.role.message}</p>}
        <select
          {...register('role', { required: 'Role is required' })}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4 bg-white"
        >
          <option value="">Select a role</option>
          <option value="Maker">Maker</option>
          <option value="Approver">Approver</option>
        </select>

        <label>Phone Number</label>
        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
        <div className="flex">
          <select
            className="w-20 px-3 py-2 text-gray-700 border rounded-lg rounded-r-none focus:outline-none mb-4"
          >
            <option value="+62">+62</option>
          </select>
          <input
            {...register('phoneNumber', { required: 'Phone Number is required' })}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg rounded-l-none focus:outline-none mb-4"
            type="number"
          />
        </div>
        <label>Email</label>
        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
        <div className="flex">
          <input
            {...register('email', { required: 'Email is required' })}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
            type="email"
          />
        </div>

        <label>Verification Code</label>
        {errors.otpCode && <p className="text-red-500 text-xs mt-1">{errors.otpCode.message}</p>}
        <div className="flex">
          <input
            {...register('otpCode', { required: 'Verification Code is required', })}
            className="w-full px-3 py-2 text-gray-700 border border-r-0 rounded-l-lg focus:outline-none"
            type="text"
          />
          <button
            disabled={isLoadingOtp}
            type='button' 
            className="px-4 py-2 border rounded-r-lg transition duration-300 w-60"
            onClick={() => sendOtp()}
          >
            {isLoadingOtp ? 'Sending...' : 'Send OTP Code'}
          </button>
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5">
          Register
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