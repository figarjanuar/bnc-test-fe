'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import MainLayout from '../layouts/MainLayout'

export default function TopUp() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await axios.post('http://localhost:8080/topup', data, {
        headers: { authorization: `Bearer ${token}` }
      })
      setSuccess('Top up successful')
      setError('')
    } catch (error) {
      setError('Top up failed. Please check the amount and try again.')
      setSuccess('')
    }
  }

  return (
    <MainLayout>
    <div className="flex flex-col bg-white shadow-md rounded p-5">
      <h1 className="text-4xl font-bold mb-8">Top Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
        <input
          {...register('amount', { 
            required: 'Amount is required', 
            min: { value: 0, message: 'Amount must be positive' },
            max: { value: 10000000, message: 'Amount must not exceed Rp10.000.000' }
          })}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
          type="number"
          placeholder="Amount"
        />
        {errors.amount && <p className="text-red-500 text-xs italic">{errors.amount.message}</p>}
        <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Top Up
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
    </MainLayout>
  )
}