import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export default function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')

  // Data states
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [warehouses, setWarehouses] = useState([])

  // Search states
  const [productSearch, setProductSearch] = useState('')
  const [supplierSearch, setSupplierSearch] = useState('')
  const [warehouseSearch, setWarehouseSearch] = useState('')

  // Modal states
  const [productModal, setProductModal] = useState(false)
  const [supplierModal, setSupplierModal] = useState(false)
  const [warehouseModal, setWarehouseModal] = useState(false)

  // Error states
  const [productError, setProductError] = useState('')
  const [supplierError, setSupplierError] = useState('')
  const [warehouseError, setWarehouseError] = useState('')

  // Form states
  const [productForm, setProductForm] = useState({ product_id: '', product_name: '', warehouse_id: '', rate_per_unit: '', stock: '' })
  const [supplierForm, setSupplierForm] = useState({ supplier_id: '', supplier_name: '', contact: '', address: '' })
  const [warehouseForm, setWarehouseForm] = useState({ warehouse_id: '', location: '' })

  // Edit mode
  const [editingProduct, setEditingProduct] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState(false)

  useEffect(() => { loadProducts(); loadSuppliers(); loadWarehouses() }, [])

  // ── Loaders ──────────────────────────────────────────────
  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API}/products/`)
      setProducts(res.data); setProductError('')
    } catch (e) { setProductError('Failed to load products: ' + e.message) }
  }
  const loadSuppliers = async () => {
    try {
      const res = await axios.get(`${API}/suppliers/`)
      setSuppliers(res.data); setSupplierError('')
    } catch (e) { setSupplierError('Failed to load suppliers: ' + e.message) }
  }
  const loadWarehouses = async () => {
    try {
      const res = await axios.get(`${API}/warehouses/`)
      setWarehouses(res.data); setWarehouseError('')
    } catch (e) { setWarehouseError('Failed to load warehouses: ' + e.message) }
  }

  // ── Product CRUD ──────────────────────────────────────────
  const openAddProduct = () => {
    setProductForm({ product_id: '', product_name: '', warehouse_id: '', rate_per_unit: '', stock: '' })
    setEditingProduct(false); setProductModal(true)
  }
  const openEditProduct = async (id) => {
    try {
      const res = await axios.get(`${API}/products/${id}`)
      setProductForm(res.data); setEditingProduct(true); setProductModal(true)
    } catch (e) { alert('Error loading product: ' + e.message) }
  }
  const saveProduct = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(productForm).forEach(([k, v]) => fd.append(k, v))
    try {
      if (editingProduct) await axios.put(`${API}/products/${productForm.product_id}`, fd)
      else await axios.post(`${API}/products/`, fd)
      alert(editingProduct ? 'Product updated!' : 'Product added!')
      setProductModal(false); loadProducts()
    } catch (e) { alert('Error saving product: ' + (e.response?.data?.detail || e.message)) }
  }
  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try { await axios.delete(`${API}/products/${id}`); loadProducts() }
    catch (e) { alert('Error deleting product: ' + e.message) }
  }

  // ── Supplier CRUD ─────────────────────────────────────────
  const openAddSupplier = () => {
    setSupplierForm({ supplier_id: '', supplier_name: '', contact: '', address: '' })
    setEditingSupplier(false); setSupplierModal(true)
  }
  const openEditSupplier = async (id) => {
    try {
      const res = await axios.get(`${API}/suppliers/${id}`)
      setSupplierForm(res.data); setEditingSupplier(true); setSupplierModal(true)
    } catch (e) { alert('Error loading supplier: ' + e.message) }
  }
  const saveSupplier = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(supplierForm).forEach(([k, v]) => fd.append(k, v))
    try {
      if (editingSupplier) await axios.put(`${API}/suppliers/${supplierForm.supplier_id}`, fd)
      else await axios.post(`${API}/suppliers/`, fd)
      alert(editingSupplier ? 'Supplier updated!' : 'Supplier added!')
      setSupplierModal(false); loadSuppliers()
    } catch (e) { alert('Error saving supplier: ' + (e.response?.data?.detail || e.message)) }
  }
  const deleteSupplier = async (id) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return
    try { await axios.delete(`${API}/suppliers/${id}`); loadSuppliers() }
    catch (e) { alert('Error deleting supplier: ' + e.message) }
  }

  // ── Warehouse CRUD ────────────────────────────────────────
  const openAddWarehouse = () => {
    setWarehouseForm({ warehouse_id: '', location: '' })
    setEditingWarehouse(false); setWarehouseModal(true)
  }
  const openEditWarehouse = async (id) => {
    try {
      const res = await axios.get(`${API}/warehouses/${id}`)
      setWarehouseForm(res.data); setEditingWarehouse(true); setWarehouseModal(true)
    } catch (e) { alert('Error loading warehouse: ' + e.message) }
  }
  const saveWarehouse = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(warehouseForm).forEach(([k, v]) => fd.append(k, v))
    try {
      if (editingWarehouse) await axios.put(`${API}/warehouses/${warehouseForm.warehouse_id}`, fd)
      else await axios.post(`${API}/warehouses/`, fd)
      alert(editingWarehouse ? 'Warehouse updated!' : 'Warehouse added!')
      setWarehouseModal(false); loadWarehouses()
    } catch (e) { alert('Error saving warehouse: ' + (e.response?.data?.detail || e.message)) }
  }
  const deleteWarehouse = async (id) => {
    if (!confirm('Are you sure you want to delete this warehouse?')) return
    try { await axios.delete(`${API}/warehouses/${id}`); loadWarehouses() }
    catch (e) { alert('Error deleting warehouse: ' + e.message) }
  }

  // ── Filtered data ─────────────────────────────────────────
  const filteredProducts = products.filter(p => p.product_name.toLowerCase().includes(productSearch.toLowerCase()))
  const filteredSuppliers = suppliers.filter(s => s.supplier_name.toLowerCase().includes(supplierSearch.toLowerCase()))
  const filteredWarehouses = warehouses.filter(w => w.location.toLowerCase().includes(warehouseSearch.toLowerCase()))

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f4f4f4', margin: 0, padding: 0, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', width: '100%' }}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
        <button style={s.btn} onClick={() => navigate('/')}>Logout</button>
      </div>

      <div style={s.container}>
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', padding: '20px' }}>
        {/* Tabs */}
        <div style={s.tabs}>
          {['products', 'suppliers', 'warehouses'].map(tab => (
            <div key={tab} style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}
              onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {/* ── Products Tab ── */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h2 style={s.h2}>Product Management</h2>
            <div style={s.filters}>
              <input style={s.filterInput} type="text" placeholder="Search products..."
                value={productSearch} onChange={e => setProductSearch(e.target.value)} />
              <button style={{ ...s.btn, ...s.addBtn }} onClick={openAddProduct}>Add Product</button>
            </div>
            {productError && <div style={s.errorMsg}>{productError}</div>}
            <table style={s.table}>
              <thead><tr>{['ID','Name','Warehouse ID','Rate Per Unit','Stock','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.product_id} style={s.tr}>
                    <td style={s.td}>{p.product_id}</td>
                    <td style={s.td}>{p.product_name}</td>
                    <td style={s.td}>{p.warehouse_id}</td>
                    <td style={s.td}>{p.rate_per_unit}</td>
                    <td style={s.td}>{p.stock}</td>
                    <td style={s.td}>
                      <button style={{ ...s.btn, ...s.editBtn }} onClick={() => openEditProduct(p.product_id)}>Edit</button>
                      <button style={{ ...s.btn, ...s.deleteBtn }} onClick={() => deleteProduct(p.product_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* ── Suppliers Tab ── */}
        {activeTab === 'suppliers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h2 style={s.h2}>Supplier Management</h2>
            <div style={s.filters}>
              <input style={s.filterInput} type="text" placeholder="Search suppliers..."
                value={supplierSearch} onChange={e => setSupplierSearch(e.target.value)} />
              <button style={{ ...s.btn, ...s.addBtn }} onClick={openAddSupplier}>Add Supplier</button>
            </div>
            {supplierError && <div style={s.errorMsg}>{supplierError}</div>}
            <table style={s.table}>
              <thead><tr>{['ID','Name','Contact Number','Address','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {filteredSuppliers.map(sup => (
                  <tr key={sup.supplier_id} style={s.tr}>
                    <td style={s.td}>{sup.supplier_id}</td>
                    <td style={s.td}>{sup.supplier_name}</td>
                    <td style={s.td}>{sup.contact}</td>
                    <td style={s.td}>{sup.address}</td>
                    <td style={s.td}>
                      <button style={{ ...s.btn, ...s.editBtn }} onClick={() => openEditSupplier(sup.supplier_id)}>Edit</button>
                      <button style={{ ...s.btn, ...s.deleteBtn }} onClick={() => deleteSupplier(sup.supplier_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* ── Warehouses Tab ── */}
        {activeTab === 'warehouses' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <h2 style={s.h2}>Warehouse Management</h2>
            <div style={s.filters}>
              <input style={s.filterInput} type="text" placeholder="Search warehouses..."
                value={warehouseSearch} onChange={e => setWarehouseSearch(e.target.value)} />
              <button style={{ ...s.btn, ...s.addBtn }} onClick={openAddWarehouse}>Add Warehouse</button>
            </div>
            {warehouseError && <div style={s.errorMsg}>{warehouseError}</div>}
            <table style={s.table}>
              <thead><tr>{['ID','Location','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {filteredWarehouses.map(w => (
                  <tr key={w.warehouse_id} style={s.tr}>
                    <td style={s.td}>{w.warehouse_id}</td>
                    <td style={s.td}>{w.location}</td>
                    <td style={s.td}>
                      <button style={{ ...s.btn, ...s.editBtn }} onClick={() => openEditWarehouse(w.warehouse_id)}>Edit</button>
                      <button style={{ ...s.btn, ...s.deleteBtn }} onClick={() => deleteWarehouse(w.warehouse_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
        </div>
      </div>

      {/* ── Product Modal ── */}
      <AnimatePresence>
        {productModal && (
          <Modal onClose={() => setProductModal(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
            <form onSubmit={saveProduct}>
              <FormGroup label="Product ID"><input style={s.formInput} value={productForm.product_id} readOnly={editingProduct} required onChange={e => setProductForm({ ...productForm, product_id: e.target.value })} /></FormGroup>
              <FormGroup label="Product Name"><input style={s.formInput} value={productForm.product_name} required onChange={e => setProductForm({ ...productForm, product_name: e.target.value })} /></FormGroup>
              <FormGroup label="Warehouse ID"><input style={s.formInput} value={productForm.warehouse_id} required onChange={e => setProductForm({ ...productForm, warehouse_id: e.target.value })} /></FormGroup>
              <FormGroup label="Rate Per Unit"><input style={s.formInput} type="number" step="0.01" min="0" value={productForm.rate_per_unit} required onChange={e => setProductForm({ ...productForm, rate_per_unit: e.target.value })} /></FormGroup>
              <FormGroup label="Stock"><input style={s.formInput} type="number" min="0" value={productForm.stock} required onChange={e => setProductForm({ ...productForm, stock: e.target.value })} /></FormGroup>
              <div style={s.modalFooter}>
                <button type="button" style={{ ...s.btn, ...s.deleteBtn }} onClick={() => setProductModal(false)}>Cancel</button>
                <button type="submit" style={{ ...s.btn, ...s.addBtn }}>Save</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Supplier Modal ── */}
      <AnimatePresence>
        {supplierModal && (
          <Modal onClose={() => setSupplierModal(false)} title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}>
            <form onSubmit={saveSupplier}>
              <FormGroup label="Supplier ID"><input style={s.formInput} value={supplierForm.supplier_id} readOnly={editingSupplier} required onChange={e => setSupplierForm({ ...supplierForm, supplier_id: e.target.value })} /></FormGroup>
              <FormGroup label="Supplier Name"><input style={s.formInput} value={supplierForm.supplier_name} required onChange={e => setSupplierForm({ ...supplierForm, supplier_name: e.target.value })} /></FormGroup>
              <FormGroup label="Contact Number"><input style={s.formInput} pattern="[0-9]{10}" title="Must be 10 digits" value={supplierForm.contact} required onChange={e => setSupplierForm({ ...supplierForm, contact: e.target.value })} /></FormGroup>
              <FormGroup label="Address"><textarea style={{ ...s.formInput, height: '60px' }} value={supplierForm.address} onChange={e => setSupplierForm({ ...supplierForm, address: e.target.value })} /></FormGroup>
              <div style={s.modalFooter}>
                <button type="button" style={{ ...s.btn, ...s.deleteBtn }} onClick={() => setSupplierModal(false)}>Cancel</button>
                <button type="submit" style={{ ...s.btn, ...s.addBtn }}>Save</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Warehouse Modal ── */}
      <AnimatePresence>
        {warehouseModal && (
          <Modal onClose={() => setWarehouseModal(false)} title={editingWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}>
            <form onSubmit={saveWarehouse}>
              <FormGroup label="Warehouse ID"><input style={s.formInput} value={warehouseForm.warehouse_id} readOnly={editingWarehouse} required onChange={e => setWarehouseForm({ ...warehouseForm, warehouse_id: e.target.value })} /></FormGroup>
              <FormGroup label="Location"><input style={s.formInput} value={warehouseForm.location} required onChange={e => setWarehouseForm({ ...warehouseForm, location: e.target.value })} /></FormGroup>
              <div style={s.modalFooter}>
                <button type="button" style={{ ...s.btn, ...s.deleteBtn }} onClick={() => setWarehouseModal(false)}>Cancel</button>
                <button type="submit" style={{ ...s.btn, ...s.addBtn }}>Save</button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Reusable Modal Component ───────────────────────────────
function Modal({ onClose, title, children }) {
  return (
    <motion.div style={s.modalOverlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div style={s.modalContent}
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
        <div style={s.modalHeader}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button style={s.closeBtn} onClick={onClose}>×</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>
      {children}
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────
const s = {
  header: { backgroundColor: '#3498db', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 },
  container: { width: '100%', margin: 0, background: '#f4f4f4', padding: '20px', boxSizing: 'border-box', minHeight: 'calc(100vh - 60px)' },
  tabs: { display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd' },
  tab: { padding: '10px 20px', cursor: 'pointer', borderBottom: '2px solid transparent' },
  tabActive: { borderBottom: '2px solid #3498db', color: '#3498db' },
  h2: { color: '#333', marginTop: 0 },
  table: { width: '100%', borderCollapse: 'collapse', margin: '20px 0' },
  th: { border: '1px solid #ddd', padding: '10px', textAlign: 'left', backgroundColor: '#f2f2f2' },
  td: { border: '1px solid #ddd', padding: '10px', textAlign: 'left' },
  tr: {},
  btn: { backgroundColor: '#dc3545', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', margin: '0 2px' },
  addBtn: { backgroundColor: '#28a745', color: 'white' },
  editBtn: { backgroundColor: '#ffc107', color: 'black' },
  deleteBtn: { backgroundColor: '#dc3545', color: 'white' },
  filters: { marginBottom: '20px', display: 'flex', gap: '10px' },
  filterInput: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px' },
  errorMsg: { color: '#dc3545', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '15px' },
  modalOverlay: { display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '80%', maxWidth: '500px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  formInput: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
}