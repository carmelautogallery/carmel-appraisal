import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
export default async function handler(req, res) {
  const { vin } = req.query
  if (!vin) return res.status(400).json({ error: 'VIN required' })
  const { data, error } = await supabase.from('appraisals').select('*').eq('vin', vin.toUpperCase()).single()
  if (error) return res.status(404).json({ error: 'Appraisal not found' })
  return res.status(200).json(data)
}
