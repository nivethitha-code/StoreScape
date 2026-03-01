import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

function generateBillNumber() {
  const date = new Date()
  const prefix = 'ASS'
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const dateStr = date.getFullYear().toString().slice(-2) +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    date.getDate().toString().padStart(2, '0')
  return `${prefix}-${dateStr}-${random}`
}

function getCurrentDate() { return new Date().toISOString().split('T')[0] }
function getCurrentTime() { return new Date().toTimeString().slice(0, 5) }

const emptyRow = () => ({ salesId: '', productId: '', itemName: '', qty: 1, rate: '', amount: 0 })

export default function BillPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [phoneDisabled, setPhoneDisabled] = useState(false)
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const [showBill, setShowBill] = useState(false)

  const [customer, setCustomer] = useState(null)
  const [newCust, setNewCust] = useState({ customer_id: '', customer_name: '', email: '', address: '', start_date: '', expiry_date: '', membership_status: 'Non-Member' })

  const [products, setProducts] = useState([])
  const [billRows, setBillRows] = useState([emptyRow()])

  const [billNo, setBillNo] = useState(generateBillNumber())
  const [billDate, setBillDate] = useState(getCurrentDate())
  const [billTime, setBillTime] = useState(getCurrentTime())
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const fetchMembershipStatus = async () => {
    if (!phone) { alert('Please enter a phone number.'); return }
    if (!/^\d{10}$/.test(phone)) { alert('Please enter a valid 10-digit phone number.'); return }
    try {
      const res = await axios.get(`${API}/customers/?phone_number=${phone}`)
      if (res.data.length > 0) {
        setCustomer(res.data[0])
        setShowBill(true)
        await fetchProducts()
      } else {
        alert('Customer not found. Please register as a new customer.')
        setShowNewCustomer(true)
        setPhoneDisabled(true)
      }
    } catch (e) { alert('Error checking customer: ' + e.message) }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products/`)
      setProducts(res.data)
    } catch (e) { alert('Error fetching products: ' + e.message) }
  }

  const registerNewCustomer = async () => {
    const { customer_id, customer_name, start_date, expiry_date } = newCust
    if (!customer_id || !customer_name || !start_date || !expiry_date) {
      alert('Please fill in all required fields.'); return
    }
    try {
      const res = await axios.post(`${API}/customers/`, { ...newCust, phone_number: phone })
      setCustomer(res.data)
      setShowBill(true)
      setShowNewCustomer(false)
      await fetchProducts()
    } catch (e) { alert('Error registering customer: ' + (e.response?.data?.detail || e.message)) }
  }

  const updateRow = (index, field, value) => {
    const rows = [...billRows]
    rows[index][field] = value
    if (field === 'qty' || field === 'rate') {
      rows[index].amount = (parseFloat(rows[index].qty || 0) * parseFloat(rows[index].rate || 0)).toFixed(2)
    }
    setBillRows(rows)
  }

  const validateProductId = async (index, productId) => {
    if (!productId) return
    try {
      const res = await axios.get(`${API}/products/`)
      const found = res.data.find(p => p.product_id === productId)
      if (!found) { alert(`Product ID ${productId} does not exist.`); updateRow(index, 'productId', '') }
    } catch (e) { console.error('Error validating product:', e) }
  }

  const addRow = () => setBillRows([...billRows, emptyRow()])
  const removeRow = () => { if (billRows.length > 0) setBillRows(billRows.slice(0, -1)) }

  const subtotal = billRows.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0)
  const isMember = customer?.membership_status === 'Active Member'
  const discount = isMember ? subtotal * 0.05 : 0
  const total = subtotal - discount

  const printBill = async () => {
    const validRows = billRows.filter(r => r.salesId && r.productId && r.itemName && r.qty && r.rate)
    if (validRows.length === 0) { alert('Please add at least one valid item.'); return }

    const salesIds = [...new Set(validRows.map(r => r.salesId))]
    const currentSalesId = salesIds[0]

    const sale = {
      sales_id: currentSalesId,
      customer_id: customer.customer_id,
      sales_date: billDate,
      payment_method: paymentMethod
    }

    try {
      await axios.post(`${API}/sales/`, sale)
      for (const row of validRows) {
        await axios.post(`${API}/sales_details/`, {
          sales_id: row.salesId,
          product_id: row.productId,
          quantity: parseInt(row.qty),
          total_amount: parseFloat(row.amount)
        })
      }
      window.print()
    } catch (e) { alert('Error saving sale: ' + (e.response?.data?.detail || e.message)) }
  }

  const resetBill = () => {
    if (!confirm('Are you sure you want to start a new bill?')) return
    setShowBill(false)
    setShowNewCustomer(false)
    setPhone('')
    setPhoneDisabled(false)
    setCustomer(null)
    setNewCust({ customer_id: '', customer_name: '', email: '', address: '', start_date: '', expiry_date: '', membership_status: 'Non-Member' })
    setBillRows([emptyRow()])
    setBillNo(generateBillNumber())
    setBillDate(getCurrentDate())
    setBillTime(getCurrentTime())
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", textAlign: 'center', backgroundColor: '#f4f4f4', margin: 0, padding: 0, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', width: '100%' }}>
      {/* Header with Logout */}
      <div style={{ backgroundColor: '#3498db', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Cashier Dashboard</h1>
        <button style={{ padding: '8px 16px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 500 }} onClick={() => navigate('/')}>Logout</button>
      </div>
      
      <div style={{ width: '100%', padding: '20px', boxSizing: 'border-box' }}>

        {/* ── Customer Form ── */}
        {!showBill && (
          <div style={bs.customerForm}>
            <h2 style={{ color: '#3498db' }}>CUSTOMER DETAILS</h2>
            <input style={bs.input} type="text" placeholder="Enter Phone Number"
              value={phone} disabled={phoneDisabled} onChange={e => setPhone(e.target.value)} />
            <button style={bs.primaryBtn} onClick={fetchMembershipStatus}>Proceed</button>

            {showNewCustomer && (
              <div style={{ marginTop: '20px', textAlign: 'left' }}>
                <h3>New Customer Registration</h3>
                {[
                  { label: 'Customer ID', key: 'customer_id', type: 'text' },
                  { label: 'Customer Name', key: 'customer_name', type: 'text' },
                  { label: 'Email (Optional)', key: 'email', type: 'email' },
                  { label: 'Address (Optional)', key: 'address', type: 'text' },
                  { label: 'Membership Start Date', key: 'start_date', type: 'date' },
                  { label: 'Membership Expiry Date', key: 'expiry_date', type: 'date' },
                ].map(f => (
                  <div key={f.key} style={bs.formRow}>
                    <label style={bs.label}>{f.label}</label>
                    <input style={bs.input} type={f.type} value={newCust[f.key]}
                      onChange={e => setNewCust({ ...newCust, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div style={bs.formRow}>
                  <label style={bs.label}>Membership Status:</label>
                  <select style={bs.input} value={newCust.membership_status}
                    onChange={e => setNewCust({ ...newCust, membership_status: e.target.value })}>
                    <option value="Non-Member">Non-Member</option>
                    <option value="Active Member">Active Member</option>
                  </select>
                </div>
                <button style={bs.successBtn} onClick={registerNewCustomer}>Register Customer</button>
              </div>
            )}
          </div>
        )}

        {/* ── Bill Split View ── */}
        {showBill && (
          <div style={bs.splitContainer}>
            {/* Left: Products Panel */}
            <div style={bs.productPanel}>
              <h2 style={{ color: '#3498db' }}>PRODUCT DETAILS</h2>
              <table style={bs.table}>
                <thead>
                  <tr>{['Product ID', 'Product Name', 'Rate', 'Stock'].map(h => <th key={h} style={bs.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.product_id}>
                      <td style={bs.td}>{p.product_id}</td>
                      <td style={bs.td}>{p.product_name}</td>
                      <td style={bs.td}>{parseFloat(p.rate_per_unit).toFixed(2)}</td>
                      <td style={bs.td}>{p.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right: Bill Panel */}
            <div style={bs.billPanel} className="print-only">
              <div style={{ textAlign: 'center' }}><h2 style={{ color: '#3498db' }}>RETAIL STORE</h2></div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ textAlign: 'left' }}>
                  <p><strong>Cash Bill</strong></p>
                  <p>Customer ID: <span>{customer?.customer_id}</span></p>
                  <p>Phone: <span>{customer?.phone_number}</span></p>
                  <p>Membership: <span style={{ color: isMember ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{customer?.membership_status}</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p>Bill No: <input style={bs.inlineInput} value={billNo} onChange={e => setBillNo(e.target.value)} /></p>
                  <p>Date: <input style={bs.inlineInput} type="date" value={billDate} onChange={e => setBillDate(e.target.value)} /></p>
                  <p>Time: <input style={bs.inlineInput} type="time" value={billTime} onChange={e => setBillTime(e.target.value)} /></p>
                </div>
              </div>
              <hr />

              {/* Bill Table */}
              <table style={bs.table}>
                <thead>
                  <tr>
                    <th style={{ ...bs.th, width: '12%' }}>Sales ID</th>
                    <th style={{ ...bs.th, width: '13%' }}>Product ID</th>
                    <th style={{ ...bs.th, width: '30%' }}>Item Name</th>
                    <th style={{ ...bs.th, width: '10%' }}>Qty</th>
                    <th style={{ ...bs.th, width: '15%' }}>Rate</th>
                    <th style={{ ...bs.th, width: '20%' }}>Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {billRows.map((row, i) => (
                    <tr key={i}>
                      <td style={bs.td}><input style={bs.cellInput} placeholder="Sales ID" value={row.salesId} onChange={e => updateRow(i, 'salesId', e.target.value)} /></td>
                      <td style={bs.td}><input style={bs.cellInput} placeholder="Product ID" value={row.productId}
                        onChange={e => updateRow(i, 'productId', e.target.value)}
                        onBlur={e => validateProductId(i, e.target.value)} /></td>
                      <td style={bs.td}><input style={bs.cellInput} placeholder="Item Name" value={row.itemName} onChange={e => updateRow(i, 'itemName', e.target.value)} /></td>
                      <td style={bs.td}><input style={bs.cellInput} type="number" min="1" value={row.qty} onChange={e => updateRow(i, 'qty', e.target.value)} /></td>
                      <td style={bs.td}><input style={bs.cellInput} type="number" min="0" step="0.01" value={row.rate} onChange={e => updateRow(i, 'rate', e.target.value)} /></td>
                      <td style={bs.td}><input style={bs.cellInput} readOnly value={row.amount} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add/Remove buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }} className="no-print">
                <button style={bs.successBtn} onClick={addRow}>Add Item</button>
                <button style={bs.dangerBtn} onClick={removeRow}>Remove Item</button>
              </div>

              {/* Summary */}
              <div style={bs.summary}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p>Payment Method:</p>
                    <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                      value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                    </select>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p>Subtotal: ₹<span>{subtotal.toFixed(2)}</span></p>
                    {isMember && <p style={{ color: '#2ecc71' }}>Member Discount (5%): ₹<span>{discount.toFixed(2)}</span></p>}
                    <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Total Amount: ₹<span>{total.toFixed(2)}</span></p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', textAlign: 'left' }}>
                <p><strong>Thank you for shopping with us!</strong></p>
                <p>Visit again soon!</p>
              </div>

              <div className="no-print" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button style={bs.primaryBtn} onClick={printBill}>Print Bill</button>
                <button style={bs.dangerBtn} onClick={resetBill}>New Bill</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-only, .print-only * { visibility: visible; }
          .print-only { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; }
          .no-print { display: none !important; }
          input, select { border: none; outline: none; }
        }
      `}</style>
    </div>
  )
}

const bs = {
  customerForm: { background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginBottom: '20px' },
  splitContainer: { display: 'flex', gap: '20px', width: '100%', flexDirection: 'row', flexWrap: 'nowrap', minHeight: '110vh' },
  productPanel: { flex: 1, padding: '25px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: 'white', overflowY: 'auto' },
  billPanel: { flex: 1, padding: '25px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', background: 'white', overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '15px 0' },
  th: { borderBottom: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f4f4f4', fontWeight: 600 },
  td: { borderBottom: '1px solid #ddd', padding: '10px', textAlign: 'left' },
  input: { width: '100%', padding: '10px', margin: '8px 0', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  cellInput: { width: '100%', padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' },
  inlineInput: { padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' },
  primaryBtn: { marginTop: '15px', padding: '12px 20px', fontSize: '16px', cursor: 'pointer', border: 'none', borderRadius: '5px', color: 'white', backgroundColor: '#3498db', fontWeight: 500 },
  logoutBtn: { marginTop: '15px', padding: '12px 20px', fontSize: '16px', cursor: 'pointer', border: 'none', borderRadius: '5px', color: 'white', backgroundColor: '#e74c3c', fontWeight: 500 },
  successBtn: { marginTop: '15px', padding: '12px 20px', fontSize: '16px', cursor: 'pointer', border: 'none', borderRadius: '5px', color: 'white', backgroundColor: '#2ecc71', fontWeight: 500 },
  dangerBtn: { marginTop: '15px', padding: '12px 20px', fontSize: '16px', cursor: 'pointer', border: 'none', borderRadius: '5px', color: 'white', backgroundColor: '#e74c3c', fontWeight: 500 },
  summary: { marginTop: '20px', padding: '15px', backgroundColor: '#f4f4f4', borderRadius: '5px' },
  formRow: { display: 'block', marginBottom: '15px', textAlign: 'left' },
  label: { display: 'block', fontWeight: 500, marginBottom: '5px' },
}