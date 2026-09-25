export type UserRole = 'requester' | 'helper' | 'admin';
export type HelperStatus = 'available' | 'busy' | 'away' | 'offline';
export type VerificationLevel = 'basic' | 'phone_verified' | 'identity_verified' | 'trusted_helper';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  name: string;
  nameTamil?: string;
  avatar: string;
  phone: string;
  email: string;
  role: UserRole;
  isHelperModeOn: boolean;
  helperStatus: HelperStatus;
  rating: number;
  reviewCount: number;
  completedTasksCount: number;
  trustScore: number;
  verificationLevel: VerificationLevel;
  userVerificationStatus?: VerificationStatus;
  helperVerificationStatus?: VerificationStatus;
  registeredAt?: string;
  documents?: {
    idProof?: string;
    skillCert?: string;
    drivingLicense?: string;
    policeVerification?: boolean;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  skills: string[];
  helperPoints: number;
  badges: string[];
  wallet: {
    available: number;
    pending: number;
    thisMonth: number;
    totalEarnings: number;
  };
}

export interface VerificationAuditLog {
  id: string;
  userId: string;
  userName: string;
  adminId: string;
  adminName: string;
  type: 'user_verification' | 'helper_verification';
  action: 'verified' | 'rejected' | 'requested_info';
  previousStatus: VerificationStatus;
  newStatus: VerificationStatus;
  note?: string;
  timestamp: string;
}

export interface IncomingTaskPopupEvent {
  taskId: string;
  title: string;
  category: string;
  budget: number;
  distance: number;
  etaMinutes: number;
  requesterName: string;
  requesterAvatar: string;
  requesterRating: number;
  address: string;
  expiresInSeconds: number;
}

export type TaskCategory = 
  | 'physical'
  | 'digital'
  | 'transport'
  | 'food'
  | 'education'
  | 'household'
  | 'repair'
  | 'emergency'
  | 'other';

export type TaskUrgency = 'low' | 'medium' | 'high' | 'immediate';

export type TaskLifecycleState =
  | 'DRAFT'
  | 'AI_ANALYSIS'
  | 'PUBLISHED'
  | 'HELPER_REQUESTED'
  | 'ACCEPTED'
  | 'OTP_REQUIRED'
  | 'OTP_VERIFIED'
  | 'TASK_STARTED'
  | 'IN_PROGRESS'
  | 'HELPER_COMPLETED'
  | 'REQUESTER_CONFIRMED'
  | 'PAYMENT_RELEASED'
  | 'RATING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface AIAnalysisResult {
  validity: 'GOOD' | 'NEEDS_REVIEW' | 'SUSPICIOUS';
  safety: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
  estimatedDifficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  suggestedBudgetMin: number;
  suggestedBudgetMax: number;
  confidenceScore: number; // 0 - 100
  recommendation: string;
  warnings?: string[];
  reasons?: string[];
  flaggedKeywords?: string[];
}

export interface HelpRequest {
  id: string;
  title: string;
  titleTamil?: string;
  description: string;
  category: TaskCategory;
  budget: number;
  urgency: TaskUrgency;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  preferredTime: string;
  contactPreference: 'chat' | 'call' | 'in_person';
  attachments?: string[];
  voiceNoteUrl?: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requesterRating: number;
  requesterPhone: string;
  helperId?: string;
  helperName?: string;
  helperAvatar?: string;
  helperRating?: number;
  helperPhone?: string;
  helperLocation?: {
    lat: number;
    lng: number;
  };
  state: TaskLifecycleState;
  otp?: string;
  otpAttempts?: number;
  otpVerifiedAt?: string;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  aiAnalysis?: AIAnalysisResult;
  paymentStatus: 
    | 'PAYMENT_PENDING'
    | 'PAYMENT_AUTHORIZED'
    | 'PAYMENT_CAPTURED'
    | 'TASK_IN_PROGRESS'
    | 'TASK_COMPLETED'
    | 'PAYMENT_RELEASED'
    | 'PAYMENT_FAILED'
    | 'REFUND_PENDING'
    | 'REFUNDED';
  paymentId?: string;
  disputeReason?: string;
  cancellationReason?: string;
}

export interface ChatMessage {
  id: string;
  taskId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  text: string;
  type: 'text' | 'image' | 'voice' | 'location' | 'system' | 'otp';
  mediaUrl?: string;
  location?: { lat: number; lng: number; label: string };
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'new_task' | 'task_accepted' | 'otp_generated' | 'helper_arrived' | 'new_message' | 'task_completed' | 'payment_released' | 'new_review' | 'badge_unlocked' | 'sos_alert';
  title: string;
  titleTamil?: string;
  message: string;
  messageTamil?: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit' | 'payout' | 'escrow_hold' | 'refund';
  amount: number;
  description: string;
  taskId?: string;
  status: 'completed' | 'pending' | 'failed';
  method?: 'upi' | 'bank_transfer' | 'razorpay_escrow';
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  amount: number;
  method: 'upi' | 'bank_account';
  accountDetails: string;
  status: 'pending' | 'processed' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  taskId: string;
  taskTitle: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  helperId: string;
  rating: number; // 1 - 5
  tags: string[];
  comment: string;
  createdAt: string;
}

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userAvatar: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: string;
  status: 'active' | 'resolved' | 'false_alarm';
  emergencyContactsNotified: string[];
}

export interface AdminAnalytics {
  totalUsers: number;
  activeHelpers: number;
  openTasks: number;
  completedTasks: number;
  totalRevenue: number;
  helperEarnings: number;
  pendingPayouts: number;
  activeDisputes: number;
  sosAlertsCount: number;
}
