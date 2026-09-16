export interface Car {
  name: string
  brand: string
  type: string
  price: number
  transmission: string
  seats: number
  fuel: string
  status: string
  icon: string
  tint: string
}

export interface FleetAssignment {
  id: number
  model: string
  type: string
  status: string
  driver: string
  phone: string
  borrowDate: string
  borrowTime: string
  returnDate: string
  returnTime: string
  route: string
}

export interface DashboardStat {
  label: string
  value: string
  note: string
}

export interface SettingItem {
  label: string
  note: string
  enabled: boolean
}

export interface BookingItem {
  id: number | string
  customer: string
  route: string
  borrowDate: string
  borrowTime: string
  returnDate: string
  returnTime: string
  status: string
}

export interface MessageItem {
  name: string
  preview: string
  time: string
  type: string
  typeLabel: string
}

export const initialCars: Car[] = [
  { name: 'Mazda 3', brand: 'Mazda', type: 'Compact Sedan', price: 85, transmission: 'Automatic', seats: 5, fuel: 'Petrol', status: 'Available', icon: '🚘', tint: 'blue' },
  { name: 'Toyota Camry', brand: 'Toyota', type: 'Comfort Sedan', price: 95, transmission: 'Automatic', seats: 5, fuel: 'Hybrid', status: 'Available', icon: '🚙', tint: 'navy' },
  { name: 'Suzuki Ertiga', brand: 'Suzuki', type: 'Family MPV', price: 80, transmission: 'Automatic', seats: 7, fuel: 'Petrol', status: 'Available', icon: '🚙', tint: 'slate' },
  { name: 'Honda Civic', brand: 'Honda', type: 'Sport Sedan', price: 105, transmission: 'Automatic', seats: 5, fuel: 'Petrol', status: 'Available', icon: '🚗', tint: 'sky' },
  { name: 'Nissan X-Trail', brand: 'Nissan', type: 'Luxury SUV', price: 125, transmission: 'Automatic', seats: 7, fuel: 'Petrol', status: 'Available', icon: '🚘', tint: 'blue' },
]

export const brandFilters = ['Any brand', 'Mazda', 'Toyota', 'Suzuki', 'Honda', 'Nissan']

export const initialFleetAssignments: FleetAssignment[] = [
  { id: 1, model: 'Tesla Model 3', type: 'Electric', status: 'Booked', driver: 'Jenna Cooper', phone: '+1 415 555 0182', borrowDate: 'Sep 18', borrowTime: '09:30', returnDate: 'Sep 22', returnTime: '18:00', route: 'Downtown → Airport' },
  { id: 2, model: 'BMW 3 Series', type: 'Executive', status: 'Available', driver: 'Unassigned', phone: '—', borrowDate: 'Available', borrowTime: '—', returnDate: '—', returnTime: '—', route: 'Ready for booking' },
  { id: 3, model: 'Range Rover', type: 'Luxury SUV', status: 'Booked', driver: 'Victor Lee', phone: '+1 415 555 0154', borrowDate: 'Sep 20', borrowTime: '12:15', returnDate: 'Sep 24', returnTime: '17:00', route: 'City Center → Old Town' },
  { id: 4, model: 'Mercedes C-Class', type: 'Premium', status: 'Available', driver: 'Unassigned', phone: '—', borrowDate: 'Available', borrowTime: '—', returnDate: '—', returnTime: '—', route: 'Ready for booking' },
]

export const adminDashboardStats: DashboardStat[] = [
  { label: 'Available cars', value: '36', note: '+8 from last week' },
  { label: 'Bookings', value: '18', note: '5 pending pickup' },
  { label: 'Revenue', value: '₱42.5k', note: '+12.4% this month' },
  { label: 'Customer rating', value: '4.9', note: 'Based on 284 reviews' },
]

export const userDashboardStats: DashboardStat[] = [
  { label: 'Upcoming rentals', value: '3', note: '2 confirmed' },
  { label: 'Rentals this month', value: '12', note: '5 new bookings' },
  { label: 'Loyalty points', value: '840', note: 'Upgrade available' },
  { label: 'Membership', value: 'Gold', note: 'Priority assistance' },
]

export const fleetStats: DashboardStat[] = [
  { label: 'Active vehicles', value: '36', note: 'Operational today' },
  { label: 'Idle vehicles', value: '8', note: 'Waiting for pickup' },
  { label: 'Maintenance', value: '3', note: 'Due this week' },
]

export const trips = [
  { name: 'Jenna Cooper', borrowDate: 'Sep 18', borrowTime: '09:30', returnDate: 'Sep 22' },
  { name: 'Victor Lee', borrowDate: 'Sep 20', borrowTime: '12:15', returnDate: 'Sep 24' },
  { name: 'Alicia Moss', borrowDate: 'Sep 22', borrowTime: '15:40', returnDate: 'Sep 26' },
]

export const initialSettings: SettingItem[] = [
  { label: 'Auto-confirm bookings', note: 'Send instant confirmation to customers', enabled: true },
  { label: 'Document reminders', note: 'Remind customers before pickup', enabled: true },
  { label: 'Late return alerts', note: 'Notify managers on return issues', enabled: false },
]

export const initialBookings: BookingItem[] = []
export const initialMessages: MessageItem[] = []
