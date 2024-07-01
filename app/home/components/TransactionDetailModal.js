import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios'

const currency = (number) => {
  const parsedNumber = parseFloat(number)
  return parsedNumber.toLocaleString("id-ID", {style:"currency", currency:"IDR"})
}

export default function TransactionDetailModal({ isOpen, closeModal, transaction }) {
  const [trxDetail, setTrxDetail] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/')
          return
        }

        const detail = await axios.get(`http://localhost:8080/api/transactions/${transaction.id}`, {
          headers: { authorization: `Bearer ${token}` }
        })
        console.log(detail.data);
        setTrxDetail(detail.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [transaction.id])
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Transaction Detail
                </Dialog.Title>
                <div className="mt-5">
                  <div className='flex'>
                    <div className='flex-1'>
                      <p className='mb-2'>From Account No.: {transaction.from_account_no}</p>
                      <p className='mb-2'>Submit Date and Time: {new Date(transaction.created_at).toLocaleString()}</p>
                      <p className='mb-2'>Transfer Date: {transaction.transfer_date ? new Date(transaction.transfer_date).toLocaleDateString() : 'N/A'}</p>
                      <p className='mb-2'>Instruction Type: {transaction.instruction_type}</p>
                      <p className='mb-2'>Total Transfer Record: {transaction.total_records}</p>
                      <p className='mb-2'>Total Amount: {currency(transaction.total_amount)}</p>
                      <p className='mb-2'>Estimated Service Fee: Rp 0</p>
                    </div>
                    <div className='flex-1'>
                      <p className='mb-2'>Maker: {transaction.name}</p>
                      <p className='mb-2'>Reference No.: {transaction.reference_no}</p>
                      <p className='mb-2'>Transfer Type: Online</p>
                    </div>
                  </div>
                  <table className="min-w-full mt-4 bg-white">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>To Account No.</th>
                        <th>To Account Name</th>
                        <th>To Account Bank</th>
                        <th>Transfer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trxDetail.map((detail, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{detail.to_account_no}</td>
                          <td>{detail.to_account_name}</td>
                          <td>{detail.to_bank_name}</td>
                          <td>{currency(detail.transfer_amount)}</td>
                          <td>{transaction.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
