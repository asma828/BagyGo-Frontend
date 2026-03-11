// ── User & Auth Models ────────────────────────────────────

export type UserRole = 'EXPEDITEUR' | 'TRANSPORTEUR';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  rating: number;
  totalDeliveries: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

// ── Trip Models ───────────────────────────────────────────

export type TripStatus = 'OPEN' | 'FULL' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: number;
  transporter: User;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  estimatedArrival: string;
  availableSpace: number; // kg
  pricePerKg: number;
  status: TripStatus;
  notes?: string;
  createdAt: string;
}

export interface CreateTripRequest {
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  estimatedArrival: string;
  availableSpace: number;
  pricePerKg: number;
  notes?: string;
}

// ── Baggage Request Models ────────────────────────────────

export type RequestStatus = 'OPEN' | 'PENDING' | 'ACCEPTED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface BaggageRequest {
  id: number;
  sender: User;
  departureCity: string;
  arrivalCity: string;
  desiredDate: string;
  weightKg: number;
  description: string;
  proposedPrice: number;
  status: RequestStatus;
  isFragile: boolean;
  imageUrl?: string;
  createdAt: string;
  offersCount: number;
}

export interface CreateBaggageRequest {
  departureCity: string;
  arrivalCity: string;
  desiredDate: string;
  weightKg: number;
  description: string;
  proposedPrice: number;
  isFragile: boolean;
}

// ── Transport Offer Models ────────────────────────────────

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'COUNTERED' | 'DECLINED';

export interface TransportOffer {
  id: number;
  baggageRequest: BaggageRequest;
  transporter: User;
  proposedPrice: number;
  message?: string;
  status: OfferStatus;
  createdAt: string;
}

export interface CreateOfferRequest {
  baggageRequestId: number;
  proposedPrice: number;
  message?: string;
}

// ── Message Models ────────────────────────────────────────

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: number;
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
}

// ── Rating Model ──────────────────────────────────────────

export interface Rating {
  id: number;
  fromUser: User;
  toUser: User;
  score: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface RatingSummary {
  average: number;          // rounded to 1 decimal
  total: number;
  distribution: Record<number, number>; // 5→count, 4→count … 1→count
  recent: Rating[];         // latest 5
}

export interface CreateRatingRequest {
  toUserId: number;
  score: number;    // 1-5
  comment?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

// ── Dashboard Stats ───────────────────────────────────────

export interface SenderDashboard {
  activeRequests: number;
  offersReceived: number;
  delivered: number;
  avgRating: number;
  recentActivity: ActivityItem[];
}

export interface TransporterDashboard {
  activeTrips: number;
  offersMade: number;
  delivered: number;
  earnings: number;
  avgRating: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'NEW_OFFER' | 'DELIVERED' | 'RATING' | 'MESSAGE' | 'ACCEPTED';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

// ── API Response Wrapper ──────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}