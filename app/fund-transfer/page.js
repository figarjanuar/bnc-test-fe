'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import MainLayout from '../layouts/MainLayout'
import Toast from '../components/Toast'

export default function Transfer() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showToast, setShowToast] = useState(false)
  const [toastData, setToastData] = useState({})
  const [csvData, setCsvData] = useState({})

  const router = useRouter()

  const currency = (number) => {
    const parsedNumber = parseFloat(number)
    return parsedNumber.toLocaleString("id-ID", {style:"currency", currency:"IDR"})
  }

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      console.log(csvData.totalAmount, data.totalAmount);
      if (csvData.totalAmount != data.totalAmount) {
        return setError('Invalid total amount')
      }

      if (csvData.totalRecords != data.totalRecord) {
        return setError('Invalid total record')
      }

      const payload = {...data, transactions: csvData.transactions, fromAccountNo: csvData.transactions[0].toAccountNo}

      await axios.post('http://localhost:8080/api/transactions/batch', payload, {
        headers: { authorization: `Bearer ${token}` }
      })
      router.push('/home')
    } catch (error) {
      console.log(error);
      setError('Transfer failed. Please check the details and try again.')
      setSuccess('')
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      if (!file) {
        alert('Please select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8080/api/transactions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${token}`
        }
      });
      setCsvData(response.data)
      console.log('Upload successful!', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <MainLayout title="Create Transaction">
      <div className="flex flex-col bg-white shadow-md rounded p-5">
        <h1 className="text-4xl font-bold mb-8">Transfer</h1>
        <input
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
          type="file"
          accept=".csv"
          onChange={handleUpload}
        />

        {(csvData.invalidRecords == 0) &&
          <div className='w-full border rounded-lg bg-yellow-200 p-5 mb-6'>
            <p>Total Record: {csvData.totalRecords}</p>
            <p>Total Amount: {currency(csvData.totalAmount)}</p>
          </div>
        }

        {(csvData.invalidRecords && csvData.invalidRecords != 0) &&
          <div className='w-full border rounded-lg bg-red-200 p-5 mb-6'>
            <p>Total Error Record: {csvData.invalidRecords}, Please reupload file</p>
          </div>
        }

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <label>Instruction Type</label>
          {errors.instructionType && <p className="text-red-500 text-xs italic">{errors.instructionType.message}</p>}
          <div className='flex gap-5 mb-4'>
            <div className='flex'>
              <input
                {...register('instructionType', { required: 'Instruction Type is required' })}
                defaultValue="Immediate"
                className="text-gray-700 border rounded-lg focus:outline-none mr-2"
                type="radio"
              />
              <label>Immediate</label>
            </div>
            <div className='flex'>
              <input
                {...register('instructionType', { required: 'Instruction Type is required' })}
                defaultValue="Standing"
                className="text-gray-700 border rounded-lg focus:outline-none mr-2"
                type="radio"
              />
              <label className=''>Standing Instruction</label>
            </div>
          </div>

          <label>Total Transfer Record</label>
          {errors.totalRecord && <p className="text-red-500 text-xs italic">{errors.totalRecord.message}</p>}
          <input
            {...register('totalRecord', { required: 'Total Transfer Record is required' })}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
            type="number"
          />

          <label>Transfer Amount</label>
          {errors.totalAmount && <p className="text-red-500 text-xs italic">{errors.totalAmount.message}</p>}
          <input
            {...register('totalAmount', { required: 'Transfer Amount is required' })}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mb-4"
            type="number"
          />

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Transfer
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>

      {showToast && 
        <Toast 
          message={toastData.message}
          type={toastData.type}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      }
    </MainLayout>
  )
}