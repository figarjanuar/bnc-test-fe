'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import MainLayout from '../layouts/MainLayout'
import TransactionDetailModal from './components/TransactionDetailModal'

export default function Home() {
  const [overviewData, setOverviewData] = useState({})
  const [transactions, setTransactions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const overviewResponse = await axios.get('http://localhost:8080/api/transactions/overview', {
        headers: { authorization: `Bearer ${token}` }
      })
      setOverviewData(overviewResponse.data)

      const trxDetail = await axios.get('http://localhost:8080/api/transactions', {
        headers: { authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 10,
          status: ''
        }
      })
      setTransactions(trxDetail.data.transactions)
      setTotalPages(trxDetail.data.totalPages)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const updateTrx = async (refId, action) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const payload = { action }

      const overviewResponse = await axios.post(`http://localhost:8080/api/transactions/${refId}/audit`, payload, {
        headers: { authorization: `Bearer ${token}` }
      })
      fetchData()
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const currency = (number) => {
    const parsedNumber = parseFloat(number)
    return parsedNumber.toLocaleString("id-ID", {style:"currency", currency:"IDR"})
  }

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  const OverviewCard = ({text, value, color}) => {
    return (
      <div className='bg-gray-300 border shadow-lg rounded-lg p-5 flex-1'>
        <p className='text-gray-400 mb-5'>{text}</p>
        <p className={`${color} text-7xl font-bold`}>{value}</p>
      </div>
    )
  }

  const TablePagination = ({ totalPages, currentPage, onPageChange }) => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 rounded-md ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      )
    }
    return (
      <div className="flex justify-center space-x-2">
        {pages}
      </div>
    )
  }

  return (
    <MainLayout title='Last login:'>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="font-bold">Transaction Overview</p>
        <div className='flex gap-5'>
          <OverviewCard color="text-yellow-500" text="Awaiting approval" value={overviewData['awaiting approval']} />
          <OverviewCard color="text-green-500" text="Successfully" value={overviewData.approved} />
          <OverviewCard color="text-red-500" text="Rejected" value={overviewData.rejected} />
        </div>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <p className="font-bold">Transactions</p>
        <table className="min-w-full bg-white border rounded-lg mb-5">
          <thead className='border bg-slate-300'>
            <tr className='border'>
              <th className="py-2 border">Reference No</th>
              <th className="py-2 border">Total Transfer Amount</th>
              <th className="py-2 border">Total Transfer Records</th>
              <th className="py-2 border">From Account No</th>
              <th className="py-2 border">Maker</th>
              <th className="py-2 border">Transfer Date</th>
              <th className="py-2 border sticky right-0">Operation</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="p-2 border">{transaction.reference_no}</td>
                <td className="p-2 border">{currency(transaction.total_amount)}</td>
                <td className="p-2 border">{transaction.total_records}</td>
                <td className="p-2 border">{transaction.from_account_no}</td>
                <td className="p-2 border">{transaction.name} {transaction.status}</td>
                <td className="p-2 border">{new Date(transaction.transfer_date).toLocaleString('id-ID', {year: 'numeric',month: '2-digit',day: '2-digit',}) || "N/A"}</td>
                <td className="p-2 border sticky right-0">
                  {(transaction.status == 'Awaiting Approval') && 
                    <><p className="cursor-pointer text-green-400 font-bold" onClick={() => updateTrx(transaction.reference_no, 'Approve')}>Approve</p>
                    <p className="cursor-pointer text-red-400 font-bold" onClick={() => updateTrx(transaction.reference_no, 'Reject')}>Reject</p></>
                  }
                  <p className="cursor-pointer text-yellow-400 font-bold" onClick={() => handleRowClick(transaction)}>Detail</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      {selectedTransaction && (
        <TransactionDetailModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          transaction={selectedTransaction}
        />
      )}
    </MainLayout>
  )
}
