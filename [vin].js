import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function RecentAppraisals() {
  const [appraisals, setAppraisals] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/list-appraisals')
      .then(r => r.json())
      .then(d => { setAppraisals(d); setLoading(false) })
  }, [])

  const filtered = appraisals.filter(a => {
    const v = a.data?.vehicle || {}
    const term = search.toLowerCase()
    return (
      a.vin.toLowerCase().includes(term) ||
      `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(term)
    )
  })

  return (
    <>
      <Head>
        <title>Recent Appraisals — Carmel Auto Gallery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight:'100vh', background:'#f5f0e8', fontFamily:"'Georgia', serif", padding:'20px 16px' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*{box-sizing:border-box;}`}</style>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:11, letterSpacing:3, color:'#8a7560', textTransform:'uppercase', fontFamily:'Inter, sans-serif' }}>Carmel Auto Gallery</div>
          <div style={{ fontSize:22, fontWeight:700, color:'#1a1a1a', marginTop:4 }}>Appraisal History</div>
          <div style={{ width:40, height:2, background:'#c8a96e', margin:'10px auto 0' }} />
        </div>

        {/* Action Buttons */}
        <div style={{ display:'flex', gap:10, marginBottom:20 }}>
          <button onClick={() => router.push('/')}
            style={{ flex:1, padding:'14px', background:'#1a1a1a', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, fontFamily:'Inter, sans-serif', cursor:'pointer' }}>
            + New Appraisal
          </button>
        </div>

        {/* Search */}
        <div style={{ marginBottom:16 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by VIN, make, model..."
            style={{ width:'100%', padding:'12px 14px', borderRadius:10, border:'1.5px solid #e0d4c0', fontFamily:'Inter, sans-serif', fontSize:14, outline:'none', background:'#fff' }}
          />
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign:'center', color:'#aaa', fontFamily:'Inter, sans-serif', padding:40 }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', color:'#aaa', fontFamily:'Inter, sans-serif', padding:40 }}>
            {search ? 'No appraisals match your search.' : 'No appraisals yet. Create your first one!'}
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.map(a => {
              const v = a.data?.vehicle || {}
              const offer = a.data?.offer
              const expenses = a.data?.expenses || []
              const totalExp = expenses.reduce((s, e) => s + (parseFloat(String(e.amount).replace(/[^0-9.]/g,'')) || 0), 0)
              const net = offer ? Math.max(0, parseFloat(offer) - totalExp) : null
              const date = new Date(a.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })

              return (
                <div key={a.vin}
                  onClick={() => router.push(`/appraisal/${a.vin}`)}
                  style={{ background:'#fff', borderRadius:10, padding:'16px 18px', boxShadow:'0 1px 6px rgba(0,0,0,0.06)', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1.5px solid transparent', transition:'border 0.15s' }}
                  onMouseOver={e => e.currentTarget.style.borderColor='#c8a96e'}
                  onMouseOut={e => e.currentTarget.style.borderColor='transparent'}
                >
                  <div>
                    <div style={{ fontFamily:'Inter, sans-serif', fontWeight:700, fontSize:15, color:'#1a1a1a', marginBottom:3 }}>
                      {v.year} {v.make} {v.model || '—'}
                    </div>
                    <div style={{ fontFamily:'Inter, sans-serif', fontSize:11, color:'#8a7560', letterSpacing:1, marginBottom:2 }}>
                      VIN: {a.vin}
                    </div>
                    <div style={{ fontFamily:'Inter, sans-serif', fontSize:11, color:'#bbb' }}>{date}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    {net !== null && (
                      <div style={{ fontFamily:'Inter, sans-serif', fontSize:18, fontWeight:800, color:'#4caf50' }}>
                        ${net.toLocaleString()}
                      </div>
                    )}
                    <div style={{ fontSize:11, color:'#aaa', fontFamily:'Inter, sans-serif', marginTop:2 }}>
                      {v.mileage ? Number(String(v.mileage).replace(/,/g,'')).toLocaleString() + ' mi' : ''} {v.condition || ''}
                    </div>
                    <div style={{ fontSize:11, color:'#c8a96e', fontFamily:'Inter, sans-serif', marginTop:4 }}>View →</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
