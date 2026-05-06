import { supabaseAdmin } from '@/lib/supabase'
import { productName, statusInfo, formatTenge, formatDateTime } from '@/lib/orderHelpers'
import OrdersFilters from './OrdersFilters'
import RefundButton from './RefundButton'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Order {
  id: number
  created_at: string
  order_id: string
  email_plain: string | null
  amount: number | null
  product_id: string | null
  status: string | null
  ip_address: string | null
}

interface SearchParams {
  status?: string
  days?: string
  q?: string
}

async function loadOrders(params: SearchParams): Promise<{ orders: Order[]; stats: Stats }> {
  const days = parseInt(params.days ?? '30', 10) || 30
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  let query = supabaseAdmin
    .from('orders')
    .select('id, created_at, order_id, email_plain, amount, product_id, status, ip_address')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(500)

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }

  if (params.q) {
    query = query.or(`email_plain.ilike.%${params.q}%,order_id.ilike.%${params.q}%`)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  const orders = (data ?? []) as Order[]

  const stats: Stats = {
    total: orders.length,
    paid: orders.filter(o => o.status === 'paid').length,
    pending: orders.filter(o => o.status === 'pending' || o.status === 'pending_reminded').length,
    failed: orders.filter(o => o.status === 'failed').length,
    revenue: orders.filter(o => o.status === 'paid').reduce((s, o) => s + (o.amount ?? 0), 0),
  }
  return { orders, stats }
}

interface Stats {
  total: number
  paid: number
  pending: number
  failed: number
  revenue: number
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent ?? ''}`}>{value}</p>
    </div>
  )
}

const TONE_CLASSES = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
} as const

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { orders, stats } = await loadOrders(searchParams)
  const days = searchParams.days ?? '30'

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Заказы</h1>
            <p className="text-sm text-gray-500">Последние {days} дн. · показано {orders.length}</p>
          </div>
          <a href="/admin/orders" className="text-sm text-gray-500 hover:text-gray-900">↻ обновить</a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Всего" value={String(stats.total)} />
          <StatCard label="Оплачено" value={String(stats.paid)} accent="text-emerald-600" />
          <StatCard label="В ожидании" value={String(stats.pending)} accent="text-amber-600" />
          <StatCard label="Выручка" value={formatTenge(stats.revenue)} accent="text-emerald-600" />
        </div>

        <OrdersFilters status={searchParams.status ?? 'all'} days={days} q={searchParams.q ?? ''} />

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white mt-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Товар</th>
                <th className="px-4 py-3 font-medium text-right">Сумма</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    За выбранный период ничего не найдено
                  </td>
                </tr>
              ) : (
                orders.map(o => {
                  const s = statusInfo(o.status)
                  return (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDateTime(o.created_at)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.order_id}</td>
                      <td className="px-4 py-3">
                        {o.email_plain ? (
                          <a href={`mailto:${o.email_plain}`} className="text-blue-600 hover:underline">
                            {o.email_plain}
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{productName(o.product_id)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatTenge(o.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${TONE_CLASSES[s.tone]}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {o.status === 'paid' && (
                          <RefundButton orderId={o.order_id} amount={o.amount} />
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
