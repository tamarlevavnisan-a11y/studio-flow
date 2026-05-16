import GreetingCard from '../components/dashboard/GreetingCard'
import NextEventCard from '../components/dashboard/NextEventCard'
import ClientsApprovalCard from '../components/dashboard/ClientsApprovalCard'
import HealthCard from '../components/dashboard/HealthCard'
import TasksCard from '../components/dashboard/TasksCard'
import NotificationsCard from '../components/dashboard/NotificationsCard'

export default function Dashboard() {
  return (
    <div className="space-y-4">
      {/* Hero greeting — full width */}
      <GreetingCard />

      {/* 3-column middle row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NextEventCard />
        <ClientsApprovalCard />
        <HealthCard />
      </div>

      {/* 2-column bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TasksCard />
        <NotificationsCard />
      </div>
    </div>
  )
}
