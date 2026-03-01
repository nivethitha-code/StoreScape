import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import storeLogo from '../assets/store_logo.jpeg'

const API = import.meta.env.VITE_API_URL

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [showSignup, setShowSignup] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const [loginData, setLoginData] = useState({ employee_id: '', password: '', role: '' })
  const [signupData, setSignupData] = useState({
    employee_id: '', employee_name: '', position: '', phone_number: '', password: ''
  })
  const [forgotData, setForgotData] = useState({ employee_id: '', new_password: '', confirm_password: '' })

  useEffect(() => {
    setShowSignup(location.pathname === '/signup')
  }, [location.pathname])

  const handleLogin = async (e) => {
    e.preventDefault()
    const { employee_id, password, role } = loginData
    if (!employee_id || !password || !role) { alert('Please fill in all fields.'); return }
    try {
      const res = await axios.post(`${API}/login/`, { employee_id, password, role })
      if (res.data.role === 'admin') navigate('/admin')
      else navigate('/cashier')
    } catch (err) {
      alert(err.response?.data?.detail || 'Login failed.')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    const { employee_id, employee_name, position, phone_number, password } = signupData
    if (!employee_id || !employee_name || !position || !phone_number || !password) {
      alert('Please fill in all required fields.'); return
    }
    try {
      await axios.post(`${API}/employees/`, {
        employee_id, employee_name, position, phone_number, branch_id: null, password
      })
      alert('Account created successfully! Please login.')
      setShowSignup(false)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.detail || 'Signup failed.')
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    const { employee_id, new_password, confirm_password } = forgotData
    if (!employee_id || !new_password || !confirm_password) { alert('Please fill in all fields.'); return }
    if (new_password !== confirm_password) { alert('Passwords do not match!'); return }
    try {
      await axios.post(`${API}/employees/reset-password/`, null, {
        params: { employee_id, new_password }
      })
      alert('Password reset successful! Please login with your new password.')
      setShowForgotPassword(false)
    } catch (err) {
      alert(err.response?.data?.detail || 'Password reset failed.')
    }
  }

  return (
    <div style={styles.body}>
      <motion.div style={styles.container}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>

        {/* Image side */}
        <motion.div style={{ ...styles.imageContainer, order: showSignup ? 1 : 0 }}>
          <motion.img src={storeLogo} style={styles.logo}
            animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} />
        </motion.div>

        {/* Form side */}
        <motion.div style={{ ...styles.formContainer, order: showSignup ? -1 : 0 }}>
          <div style={styles.scrollArea}>
            <AnimatePresence mode="wait">

              {/* Login Form — larger inputs to fill the card */}
              {!showSignup && !showForgotPassword && (
                <motion.form key="login" onSubmit={handleLogin} style={styles.form}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <h2 style={styles.h2}>Login</h2>
                  <input style={styles.inputLg} type="text" placeholder="EMPLOYEE ID (e.g. E001)" required
                    value={loginData.employee_id} onChange={e => setLoginData({ ...loginData, employee_id: e.target.value })} />
                  <input style={styles.inputLg} type="password" placeholder="PASSWORD" required
                    value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                  <select style={styles.selectLg} required
                    value={loginData.role} onChange={e => setLoginData({ ...loginData, role: e.target.value })}>
                    <option value="" disabled>Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="cashier">Cashier</option>
                  </select>
                  <button style={styles.btnLg} type="submit">LOGIN</button>
                  <div style={styles.links}>
                    <p style={styles.toggleLink} onClick={() => { setShowSignup(true); navigate('/signup') }}>Create an account</p>
                    <p style={styles.toggleLink} onClick={() => setShowForgotPassword(true)}>Forget password?</p>
                  </div>
                </motion.form>
              )}

              {/* Signup Form — compact inputs, scrollable */}
              {showSignup && !showForgotPassword && (
                <motion.form key="signup" onSubmit={handleSignup} style={styles.form}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <h2 style={styles.h2}>Sign Up</h2>
                  <input style={styles.input} type="text" placeholder="EMPLOYEE ID (e.g. E003)" required
                    value={signupData.employee_id} onChange={e => setSignupData({ ...signupData, employee_id: e.target.value })} />
                  <input style={styles.input} type="text" placeholder="FULL NAME" required
                    value={signupData.employee_name} onChange={e => setSignupData({ ...signupData, employee_name: e.target.value })} />
                  <input style={styles.input} type="text" placeholder="PHONE NUMBER" required
                    value={signupData.phone_number} onChange={e => setSignupData({ ...signupData, phone_number: e.target.value })} />
                  <select style={styles.select} required
                    value={signupData.position} onChange={e => setSignupData({ ...signupData, position: e.target.value })}>
                    <option value="" disabled>Select Position</option>
                    <option value="admin">Admin</option>
                    <option value="cashier">Cashier</option>
                  </select>
                  <input style={styles.input} type="password" placeholder="SET PASSWORD" required
                    value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} />
                  <button style={styles.btn} type="submit">CREATE ACCOUNT</button>
                  <div style={styles.links}>
                    <p style={styles.toggleLink} onClick={() => { setShowSignup(false); navigate('/') }}>Already have an account</p>
                  </div>
                </motion.form>
              )}

              {/* Forgot Password Form — larger inputs to fill the card */}
              {showForgotPassword && (
                <motion.form key="forgot" onSubmit={handleForgotPassword} style={styles.form}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <h2 style={styles.h2}>Reset Password</h2>
                  <input style={styles.inputLg} type="text" placeholder="EMPLOYEE ID (e.g. E001)" required
                    value={forgotData.employee_id} onChange={e => setForgotData({ ...forgotData, employee_id: e.target.value })} />
                  <input style={styles.inputLg} type="password" placeholder="NEW PASSWORD" required
                    value={forgotData.new_password} onChange={e => setForgotData({ ...forgotData, new_password: e.target.value })} />
                  <input style={styles.inputLg} type="password" placeholder="CONFIRM NEW PASSWORD" required
                    value={forgotData.confirm_password} onChange={e => setForgotData({ ...forgotData, confirm_password: e.target.value })} />
                  <button style={styles.btnLg} type="submit">RESET PASSWORD</button>
                  <div style={styles.links}>
                    <p style={styles.toggleLink} onClick={() => setShowForgotPassword(false)}>Back to Login</p>
                  </div>
                </motion.form>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

const styles = {
  body: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%', background: 'linear-gradient(to right, #3498db, #2980b9)', fontFamily: "'Roboto', sans-serif", margin: 0, padding: 0, boxSizing: 'border-box', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 },
  container: { display: 'flex', alignItems: 'center', width: '600px', height: '380px', padding: '30px', background: 'rgba(255,255,255,0.9)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', overflow: 'hidden' },
  imageContainer: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  logo: { width: '150px', height: '150px', borderRadius: '50%', filter: 'drop-shadow(0 0 10px rgba(52,152,219,0.3))' },
  formContainer: { flex: 1, height: '100%', display: 'flex', alignItems: 'center', overflow: 'hidden' },
  scrollArea: { width: '100%', paddingLeft: '20px', paddingRight: '4px' },
  form: { display: 'flex', flexDirection: 'column', width: '100%' },

  // Compact — for signup (5 fields, scrollable)
  input: { margin: '6px 0', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '10px', background: 'white', color: '#333', fontSize: '14px', fontWeight: 300, width: '100%', boxSizing: 'border-box' },
  select: { margin: '6px 0', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '10px', background: 'white', color: '#333', fontSize: '14px', fontWeight: 300, width: '100%', boxSizing: 'border-box' },
  btn: { background: '#3498db', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '20px', fontSize: '15px', fontWeight: 400, marginTop: '12px', width: '100%', boxSizing: 'border-box' },

  // Large — for login & reset password (3 fields, fills card nicely)
  inputLg: { margin: '10px 0', padding: '14px 14px', border: '1px solid #e0e0e0', borderRadius: '10px', background: 'white', color: '#333', fontSize: '15px', fontWeight: 300, width: '100%', boxSizing: 'border-box' },
  selectLg: { margin: '10px 0', padding: '14px 14px', border: '1px solid #e0e0e0', borderRadius: '10px', background: 'white', color: '#333', fontSize: '15px', fontWeight: 300, width: '100%', boxSizing: 'border-box' },
  btnLg: { background: '#3498db', color: 'white', border: 'none', padding: '14px', cursor: 'pointer', borderRadius: '20px', fontSize: '16px', fontWeight: 400, marginTop: '16px', width: '100%', boxSizing: 'border-box' },

  links: { display: 'flex', justifyContent: 'space-between', marginTop: '12px' },
  h2: { marginBottom: '8px', color: '#3498db', fontSize: '22px', fontWeight: 700, textTransform: 'uppercase' },
  toggleLink: { color: '#3498db', cursor: 'pointer', fontSize: '13px', fontWeight: 300 },
}