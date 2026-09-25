import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import type {
  User,
  HelpRequest,
  ChatMessage,
  NotificationItem,
  WalletTransaction,
  Review,
  SOSAlert,
  VerificationAuditLog
} from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Durable Database for HelpMate
let demoUsers: User[] = [
  {
    id: "user-1",
    name: "Arun Kumar",
    nameTamil: "அருண் குமார்",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98765 43210",
    email: "arun.kumar@gmail.com",
    role: "requester" as const,
    isHelperModeOn: false,
    helperStatus: "offline" as const,
    rating: 4.8,
    reviewCount: 18,
    completedTasksCount: 14,
    trustScore: 92,
    verificationLevel: "identity_verified" as const,
    userVerificationStatus: "verified" as const,
    helperVerificationStatus: "verified" as const,
    registeredAt: "2026-06-15T10:30:00.000Z",
    documents: {
      idProof: "Aadhaar Verified (XXXX-XXXX-4921)",
      drivingLicense: "TN-37-2022-0091823",
      policeVerification: true,
    },
    location: {
      lat: 11.0168,
      lng: 76.9558,
      address: "100 Feet Road, Gandhipuram",
      city: "Coimbatore",
    },
    skills: ["Bike Assistance", "Moving Assistance", "Online Forms"],
    helperPoints: 480,
    badges: ["New Helper", "Active Helper", "Verified User"],
    wallet: {
      available: 1200,
      pending: 0,
      thisMonth: 600,
      totalEarnings: 3200,
    },
  },
  {
    id: "user-2",
    name: "Kumar M.",
    nameTamil: "குமார் எம்.",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98421 11223",
    email: "kumar.m@gmail.com",
    role: "helper" as const,
    isHelperModeOn: true,
    helperStatus: "available" as const,
    rating: 4.9,
    reviewCount: 125,
    completedTasksCount: 125,
    trustScore: 98,
    verificationLevel: "trusted_helper" as const,
    userVerificationStatus: "verified" as const,
    helperVerificationStatus: "verified" as const,
    registeredAt: "2026-05-10T08:15:00.000Z",
    documents: {
      idProof: "Aadhaar & PAN Verified",
      skillCert: "Certified Mechanic & Technician",
      drivingLicense: "TN-38-2020-0012948",
      policeVerification: true,
    },
    location: {
      lat: 11.0205,
      lng: 76.9582,
      address: "Cross Cut Road, Gandhipuram",
      city: "Coimbatore",
    },
    skills: ["Bike Assistance", "Physical Help", "Moving Assistance", "Delivery", "Repair"],
    helperPoints: 1240,
    badges: ["Active Helper", "Trusted Helper", "Top Helper", "Emergency Hero", "Verified Helper"],
    wallet: {
      available: 8150,
      pending: 300,
      thisMonth: 4250,
      totalEarnings: 8450,
    },
  },
  {
    id: "user-3",
    name: "Priya S.",
    nameTamil: "பிரியா எஸ்.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "+91 97890 55443",
    email: "priya.tech@gmail.com",
    role: "helper" as const,
    isHelperModeOn: true,
    helperStatus: "available" as const,
    rating: 4.8,
    reviewCount: 64,
    completedTasksCount: 58,
    trustScore: 95,
    verificationLevel: "trusted_helper" as const,
    userVerificationStatus: "verified" as const,
    helperVerificationStatus: "verified" as const,
    registeredAt: "2026-06-01T14:20:00.000Z",
    documents: {
      idProof: "Passport Verified",
      skillCert: "IT Support Professional",
      policeVerification: true,
    },
    location: {
      lat: 11.0125,
      lng: 76.9621,
      address: "Ram Nagar",
      city: "Coimbatore",
    },
    skills: ["Digital Help", "Computer Repair", "Online Forms", "Tutoring"],
    helperPoints: 920,
    badges: ["Active Helper", "Trusted Helper", "Verified Helper"],
    wallet: {
      available: 5400,
      pending: 150,
      thisMonth: 2800,
      totalEarnings: 6200,
    },
  },
  {
    id: "user-4",
    name: "Arjun R.",
    nameTamil: "அர்ஜுன் ஆர்.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+91 94432 99881",
    email: "arjun.r@gmail.com",
    role: "helper" as const,
    isHelperModeOn: true,
    helperStatus: "busy" as const,
    rating: 5.0,
    reviewCount: 92,
    completedTasksCount: 89,
    trustScore: 99,
    verificationLevel: "trusted_helper" as const,
    userVerificationStatus: "verified" as const,
    helperVerificationStatus: "verified" as const,
    registeredAt: "2026-04-12T11:00:00.000Z",
    documents: {
      idProof: "Aadhaar Verified",
      skillCert: "Licensed Electrician Grade A",
      policeVerification: true,
    },
    location: {
      lat: 11.0182,
      lng: 76.9695,
      address: "Peelamedu",
      city: "Coimbatore",
    },
    skills: ["Electrical", "Plumbing", "Repair", "Household"],
    helperPoints: 1650,
    badges: ["Top Helper", "Super Helper", "Emergency Hero", "Verified Helper"],
    wallet: {
      available: 9800,
      pending: 0,
      thisMonth: 5100,
      totalEarnings: 14200,
    },
  },
  {
    id: "user-5",
    name: "Deepak Natarajan",
    nameTamil: "தீபக் நடராஜன்",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98840 77123",
    email: "deepak.n@gmail.com",
    role: "requester" as const,
    isHelperModeOn: false,
    helperStatus: "offline" as const,
    rating: 4.5,
    reviewCount: 3,
    completedTasksCount: 2,
    trustScore: 78,
    verificationLevel: "basic" as const,
    userVerificationStatus: "pending" as const,
    helperVerificationStatus: "pending" as const,
    registeredAt: "2026-08-16T09:45:00.000Z",
    documents: {
      idProof: "Aadhaar Card Uploaded (Pending Review)",
      policeVerification: false,
    },
    location: {
      lat: 11.028,
      lng: 76.942,
      address: "Saibaba Colony",
      city: "Coimbatore",
    },
    skills: ["Household Help", "General Assistance"],
    helperPoints: 60,
    badges: ["New Member"],
    wallet: {
      available: 500,
      pending: 0,
      thisMonth: 0,
      totalEarnings: 0,
    },
  },
  {
    id: "user-6",
    name: "Kavitha R.",
    nameTamil: "கவிதா ஆர்.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+91 97910 88234",
    email: "kavitha.tutor@gmail.com",
    role: "helper" as const,
    isHelperModeOn: true,
    helperStatus: "available" as const,
    rating: 4.7,
    reviewCount: 12,
    completedTasksCount: 11,
    trustScore: 88,
    verificationLevel: "phone_verified" as const,
    userVerificationStatus: "pending" as const,
    helperVerificationStatus: "pending" as const,
    registeredAt: "2026-08-17T16:20:00.000Z",
    documents: {
      idProof: "Voter ID Uploaded",
      skillCert: "B.Ed Teaching Certificate",
      policeVerification: false,
    },
    location: {
      lat: 11.009,
      lng: 76.968,
      address: "Singanallur",
      city: "Coimbatore",
    },
    skills: ["Tutoring", "Digital Help", "Tamil & English Translation"],
    helperPoints: 240,
    badges: ["Active Helper"],
    wallet: {
      available: 1800,
      pending: 0,
      thisMonth: 1800,
      totalEarnings: 1800,
    },
  },
  {
    id: "admin-1",
    name: "Admin Office",
    nameTamil: "நிர்வாக அலுவலகம்",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    phone: "+91 90000 00001",
    email: "admin@helpmate.org",
    role: "admin" as const,
    isHelperModeOn: false,
    helperStatus: "offline" as const,
    rating: 5.0,
    reviewCount: 0,
    completedTasksCount: 0,
    trustScore: 100,
    verificationLevel: "trusted_helper" as const,
    userVerificationStatus: "verified" as const,
    helperVerificationStatus: "verified" as const,
    registeredAt: "2026-01-01T00:00:00.000Z",
    location: {
      lat: 11.0168,
      lng: 76.9558,
      address: "HelpMate Operations HQ",
      city: "Coimbatore",
    },
    skills: ["Platform Management", "Safety Team"],
    helperPoints: 5000,
    badges: ["Super Helper", "Platform Admin"],
    wallet: {
      available: 54000,
      pending: 0,
      thisMonth: 22000,
      totalEarnings: 85000,
    },
  },
];

let demoVerificationAuditLogs: VerificationAuditLog[] = [
  {
    id: "log-1",
    userId: "user-2",
    userName: "Kumar M.",
    adminId: "admin-1",
    adminName: "Admin Office",
    type: "helper_verification",
    action: "verified",
    previousStatus: "pending",
    newStatus: "verified",
    note: "All identity proofs, driving license, and police clearances verified.",
    timestamp: "2026-05-12T14:30:00.000Z",
  },
  {
    id: "log-2",
    userId: "user-3",
    userName: "Priya S.",
    adminId: "admin-1",
    adminName: "Admin Office",
    type: "user_verification",
    action: "verified",
    previousStatus: "pending",
    newStatus: "verified",
    note: "Passport and phone verified successfully.",
    timestamp: "2026-06-02T10:00:00.000Z",
  },
];

let demoTasks: HelpRequest[] = [
  {
    id: "task-101",
    title: "Push broken bike to nearest mechanic",
    titleTamil: "பழுதடைந்த இருசக்கர வாகனத்தை அருகிலுள்ள பட்டறைக்கு தள்ள வேண்டும்",
    description: "My scooter clutch cable snapped near Gandhipuram signal. Need assistance to push the bike ~800 meters to the workshop on Cross Cut Road.",
    category: "transport" as const,
    budget: 100,
    urgency: "immediate" as const,
    location: {
      lat: 11.0168,
      lng: 76.9558,
      address: "Gandhipuram Signal, Coimbatore",
      city: "Coimbatore",
    },
    preferredTime: "Right Now (Within 10 mins)",
    contactPreference: "call" as const,
    attachments: [],
    requesterId: "user-1",
    requesterName: "Arun Kumar",
    requesterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    requesterRating: 4.8,
    requesterPhone: "+91 98765 43210",
    helperId: "user-2",
    helperName: "Kumar M.",
    helperAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    helperRating: 4.9,
    helperPhone: "+91 98421 11223",
    helperLocation: {
      lat: 11.0205,
      lng: 76.9582,
    },
    state: "ACCEPTED" as const,
    otp: "4827",
    otpAttempts: 0,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    aiAnalysis: {
      validity: "GOOD" as const,
      safety: "LOW_RISK" as const,
      estimatedDifficulty: "Easy" as const,
      estimatedTime: "15–20 minutes",
      suggestedBudgetMin: 80,
      suggestedBudgetMax: 120,
      confidenceScore: 96,
      recommendation: "Standard roadside assistance task. Very suitable for community helpers.",
    },
    paymentStatus: "PAYMENT_AUTHORIZED" as const,
  },
  {
    id: "task-102",
    title: "Setup WiFi printer and drivers on laptop",
    titleTamil: "மடிக்கணினியில் வைஃபை அச்சுப்பொறியை இணைத்து தர வேண்டும்",
    description: "Purchased a new HP Wireless printer. Need help connecting it to home Wi-Fi and installing test drivers on Windows 11 laptop.",
    category: "digital" as const,
    budget: 250,
    urgency: "medium" as const,
    location: {
      lat: 11.0125,
      lng: 76.9621,
      address: "Ram Nagar 2nd Street",
      city: "Coimbatore",
    },
    preferredTime: "Today afternoon around 3 PM",
    contactPreference: "chat" as const,
    requesterId: "user-1",
    requesterName: "Arun Kumar",
    requesterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    requesterRating: 4.8,
    requesterPhone: "+91 98765 43210",
    state: "PUBLISHED" as const,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    aiAnalysis: {
      validity: "GOOD" as const,
      safety: "LOW_RISK" as const,
      estimatedDifficulty: "Medium" as const,
      estimatedTime: "25–35 minutes",
      suggestedBudgetMin: 200,
      suggestedBudgetMax: 300,
      confidenceScore: 94,
      recommendation: "Digital assistance task with verified equipment requirements.",
    },
    paymentStatus: "PAYMENT_AUTHORIZED" as const,
  },
  {
    id: "task-103",
    title: "Need help lifting double-cot mattress to 2nd floor",
    titleTamil: "இரட்டை மெத்தையை 2வது மாடிக்கு தூக்க உதவி தேவை",
    description: "New mattress delivered at gate. Need one person with good physical strength for 10 minutes to carry it upstairs.",
    category: "physical" as const,
    budget: 150,
    urgency: "high" as const,
    location: {
      lat: 11.025,
      lng: 76.945,
      address: "R.S. Puram West",
      city: "Coimbatore",
    },
    preferredTime: "Within 1 hour",
    contactPreference: "call" as const,
    requesterId: "user-3",
    requesterName: "Priya S.",
    requesterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    requesterRating: 4.9,
    requesterPhone: "+91 97890 55443",
    state: "PUBLISHED" as const,
    createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    aiAnalysis: {
      validity: "GOOD" as const,
      safety: "LOW_RISK" as const,
      estimatedDifficulty: "Easy" as const,
      estimatedTime: "10–15 minutes",
      suggestedBudgetMin: 120,
      suggestedBudgetMax: 180,
      confidenceScore: 98,
      recommendation: "Short duration household manual assist task.",
    },
    paymentStatus: "PAYMENT_AUTHORIZED" as const,
  }
];

let demoMessages: ChatMessage[] = [
  {
    id: "msg-1",
    taskId: "task-101",
    senderId: "user-1",
    senderName: "Arun Kumar",
    senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    recipientId: "user-2",
    text: "Hi Kumar, I'm standing right beside the Indian Oil petrol bunk at the signal.",
    type: "text" as const,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: "msg-2",
    taskId: "task-101",
    senderId: "user-2",
    senderName: "Kumar M.",
    senderAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    recipientId: "user-1",
    text: "On my way! I'm on Cross Cut Road, will reach you in ~3 minutes. Please have the 4-digit OTP ready.",
    type: "text" as const,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  }
];

let demoNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "task_accepted",
    title: "Task Accepted!",
    titleTamil: "பணி ஏற்கப்பட்டது!",
    message: "Kumar M. has accepted your bike push request. Share OTP 4827 when he arrives.",
    messageTamil: "குமார் உங்கள் பைக் தள்ளும் கோரிக்கையை ஏற்றுக்கொண்டார். அவர் வந்ததும் OTP 4827 எண்ணை பகிரவும்.",
    taskId: "task-101",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    type: "new_task",
    title: "New Request 0.5 km away",
    titleTamil: "0.5 கிமீ தொலைவில் புதிய கோரிக்கை",
    message: "Setup WiFi printer and drivers on laptop (₹250)",
    messageTamil: "மடிக்கணினியில் வைஃபை அச்சுப்பொறி அமைத்தல் (₹250)",
    taskId: "task-102",
    read: true,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    type: "payment_released",
    title: "₹100 Credited to Wallet",
    titleTamil: "வாலட்டில் ₹100 வரவு வைக்கப்பட்டது",
    message: "Payment for 'Grocery delivery assist' was released successfully.",
    messageTamil: "பணியின் கட்டணம் ₹100 வெற்றிகரமாக வாலட்டில் வரவு வைக்கப்பட்டது.",
    read: true,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  }
];

let demoTransactions: WalletTransaction[] = [
  {
    id: "txn-1",
    userId: "user-2",
    type: "credit",
    amount: 100,
    description: "Earnings for Grocery assist task",
    taskId: "task-99",
    status: "completed",
    method: "razorpay_escrow",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "txn-2",
    userId: "user-2",
    type: "credit",
    amount: 250,
    description: "Earnings for Heavy luggage lifting",
    taskId: "task-98",
    status: "completed",
    method: "razorpay_escrow",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "txn-3",
    userId: "user-2",
    type: "payout",
    amount: 1500,
    description: "Bank transfer payout to SBI A/C ****4821",
    status: "completed",
    method: "bank_transfer",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  }
];

let demoReviews: Review[] = [
  {
    id: "rev-1",
    taskId: "task-99",
    taskTitle: "Grocery delivery assist",
    requesterId: "user-3",
    requesterName: "Priya S.",
    requesterAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    helperId: "user-2",
    rating: 5,
    tags: ["Fast", "Friendly", "Reliable"],
    comment: "Kumar was extremely courteous and arrived in less than 5 minutes! Super helpful.",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "rev-2",
    taskId: "task-98",
    taskTitle: "Heavy luggage lifting",
    requesterId: "user-1",
    requesterName: "Arun Kumar",
    requesterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    helperId: "user-2",
    rating: 5,
    tags: ["Professional", "Helpful"],
    comment: "Did the job quickly and safely. Highly recommended helper!",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  }
];

let demoSOSAlerts: SOSAlert[] = [];

// Gemini Client Lazy Initializer
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "HelpMate", time: new Date().toISOString() });
});

app.get("/api/config", (req, res) => {
  res.json({
    googleMapsConfigured: Boolean(process.env.GOOGLE_MAPS_API_KEY),
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID),
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_helpmate_demo",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Users
app.get("/api/users", (req, res) => {
  res.json(demoUsers);
});

app.get("/api/users/:id", (req, res) => {
  const user = demoUsers.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.post("/api/users/:id/helper-mode", (req, res) => {
  const { isHelperModeOn, helperStatus } = req.body;
  const user = demoUsers.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  
  if (typeof isHelperModeOn === "boolean") user.isHelperModeOn = isHelperModeOn;
  if (helperStatus) user.helperStatus = helperStatus;
  else if (!user.isHelperModeOn) user.helperStatus = "offline";
  else if (user.helperStatus === "offline") user.helperStatus = "available";

  res.json(user);
});

// AI Task Analyzer with Gemini 3.7 Flash
app.post("/api/tasks/analyze", async (req, res) => {
  const { title, description, category, budget, location, urgency } = req.body;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const prompt = `You are the AI Task Analyzer and Safety Guard for HelpMate, a hyper-local peer-to-peer task and assistance platform in India.
Analyze the following user-submitted help request for feasibility, safety, estimated time, recommended fair budget (in Indian Rupees INR ₹), difficulty, and community moderation flags.

Task Title: "${title || ""}"
Task Description: "${description || ""}"
Category: "${category || ""}"
User Proposed Budget: ₹${budget || 0}
Location: "${location?.address || location?.city || "Coimbatore"}"
Urgency: "${urgency || "medium"}"

Check for:
1. Physical/Personal safety risks, illegal activity, prohibited chemical/weapon/drug tasks, unsafe electrical work.
2. Fairness of proposed budget based on typical Indian urban/semi-urban task rates.
3. Realistic time and difficulty estimates.

Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "validity": "GOOD" | "NEEDS_REVIEW" | "SUSPICIOUS",
  "safety": "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK",
  "estimatedDifficulty": "Easy" | "Medium" | "Hard",
  "estimatedTime": "e.g. 20–30 minutes",
  "suggestedBudgetMin": number,
  "suggestedBudgetMax": number,
  "confidenceScore": number (0 to 100),
  "recommendation": "Short concise summary string explaining suitability or precautions",
  "warnings": ["array of warnings if any"],
  "reasons": ["array of reasons if flagged for review"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      return res.json(parsed);
    }
  } catch (err: any) {
    console.error("Gemini AI Task Analyzer error:", err?.message);
  }

  // Robust Heuristic Fallback if Gemini offline or unconfigured
  const lowerDesc = `${title} ${description}`.toLowerCase();
  const isDangerous = /dangerous|illegal|weapon|drugs|poison|scam|hack|password|card number|rob/i.test(lowerDesc);
  const isUnclear = !title || title.trim().length < 5;

  const baseBudget = Number(budget) || 100;
  const suggestedMin = Math.max(50, Math.round(baseBudget * 0.85));
  const suggestedMax = Math.max(suggestedMin + 30, Math.round(baseBudget * 1.25));

  const fallbackResult = {
    validity: isDangerous ? "SUSPICIOUS" : isUnclear ? "NEEDS_REVIEW" : "GOOD",
    safety: isDangerous ? "HIGH_RISK" : "LOW_RISK",
    estimatedDifficulty: category === "digital" || category === "repair" ? "Medium" : "Easy",
    estimatedTime: category === "repair" ? "30–45 minutes" : "15–25 minutes",
    suggestedBudgetMin: suggestedMin,
    suggestedBudgetMax: suggestedMax,
    confidenceScore: 92,
    recommendation: isDangerous
      ? "Task flagged due to safety concerns. Requires administrative review."
      : "Task appears well-specified, realistic, and suitable for nearby HelpMate helpers.",
    warnings: isDangerous ? ["Potentially unsafe or restricted activity detected."] : [],
    reasons: isDangerous ? ["Automated keyword filter matched safety guidelines."] : [],
  };

  res.json(fallbackResult);
});

// HelpMate AI Smart Assistant
app.post("/api/ai/chat", async (req, res) => {
  const { message, userId, userContext } = req.body;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const activeTasksCount = demoTasks.filter(t => t.state === "IN_PROGRESS" || t.state === "ACCEPTED").length;
      const nearbyHelpersCount = demoUsers.filter(u => u.isHelperModeOn && u.helperStatus === "available").length;

      const systemPrompt = `You are HelpMate AI, the intelligent, friendly, and protective assistant built into the HelpMate platform.
HelpMate connects nearby community members for fast, reliable help (pushing a broken bike, lifting household items, fixing wifi/laptops, local deliveries, tutoring).
Current live environment stats: ${nearbyHelpersCount} helpers currently online and available in Coimbatore, ${activeTasksCount} active tasks in progress.
Current user: ${userContext?.name || "Member"}.
Be concise, proactive, respectful, and guide the user on fair pricing, safety procedures (like the 4-digit start OTP and escrow protection), finding helpers, or troubleshooting.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `${systemPrompt}\n\nUser Question: ${message}`,
      });

      return res.json({ reply: response.text?.trim() || "I am here to assist you with HelpMate." });
    }
  } catch (err: any) {
    console.error("Gemini AI Chat error:", err?.message);
  }

  // Fallback Assistant Replies
  const lower = (message || "").toLowerCase();
  let reply = "Hello! I am HelpMate AI. You can ask me to estimate task budgets, check safety guidelines, find nearby helpers, or track your active tasks.";

  if (lower.includes("budget") || lower.includes("how much") || lower.includes("pay")) {
    reply = "For quick physical tasks (like pushing a bike ~1 km), standard fair rates are ₹80–₹120. For household lifting (15–30 mins), ₹150–₹200. For digital/printer troubleshooting, ₹200–₹350. The requester pays securely through escrow.";
  } else if (lower.includes("otp") || lower.includes("safe") || lower.includes("security")) {
    reply = "HelpMate uses a mandatory 4-digit Task Start OTP. The requester gets the code upon task acceptance and only reveals it when the helper physically arrives. Payment is safely held in escrow until the requester confirms satisfaction.";
  } else if (lower.includes("bike") || lower.includes("push")) {
    reply = "Roadside bike assistance is one of our top categories! We currently have Kumar M. (4.9 ⭐, 0.4 km away) available right now on Cross Cut Road.";
  } else if (lower.includes("task") || lower.includes("active")) {
    reply = "You have 1 active task: 'Push broken bike to nearest mechanic' accepted by Kumar M. with Start OTP: 4827.";
  }

  res.json({ reply });
});

// Tasks CRUD
app.get("/api/tasks", (req, res) => {
  res.json(demoTasks);
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: `task-${Date.now()}`,
    ...req.body,
    state: req.body.state || "PUBLISHED",
    createdAt: new Date().toISOString(),
    paymentStatus: req.body.paymentStatus || "PAYMENT_AUTHORIZED",
  };
  demoTasks.unshift(newTask);

  // Broadcast notification to nearby helpers
  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "new_task",
    title: "New Request Nearby",
    titleTamil: "அருகில் புதிய கோரிக்கை",
    message: `${newTask.title} (₹${newTask.budget})`,
    messageTamil: `${newTask.titleTamil || newTask.title} (₹${newTask.budget})`,
    taskId: newTask.id,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(newTask);
});

// Helper accepts task
app.post("/api/tasks/:id/accept", (req, res) => {
  const { helperId, helperName, helperAvatar, helperRating, helperPhone } = req.body;
  const task = demoTasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

  task.state = "ACCEPTED";
  task.helperId = helperId;
  task.helperName = helperName;
  task.helperAvatar = helperAvatar;
  task.helperRating = helperRating || 4.9;
  task.helperPhone = helperPhone || "+91 98421 11223";
  task.otp = generatedOtp;
  task.otpAttempts = 0;
  task.acceptedAt = new Date().toISOString();

  // Create notifications
  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "task_accepted",
    title: "Task Accepted!",
    titleTamil: "பணி ஏற்கப்பட்டது!",
    message: `${helperName} has accepted '${task.title}'. Start OTP: ${generatedOtp}`,
    messageTamil: `${helperName} உங்கள் பணியை ஏற்றுக்கொண்டார். தொடக்க OTP: ${generatedOtp}`,
    taskId: task.id,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json(task);
});

// Verify 4-digit Task Start OTP
app.post("/api/tasks/:id/verify-otp", (req, res) => {
  const { otp } = req.body;
  const task = demoTasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.otpAttempts = (task.otpAttempts || 0) + 1;

  if (task.otpAttempts > 5) {
    return res.status(400).json({ error: "Too many failed attempts. Task flagged for verification." });
  }

  if (task.otp !== otp) {
    return res.status(400).json({ error: "Incorrect OTP. Please ask the requester for the 4-digit start code.", attemptsLeft: 5 - task.otpAttempts });
  }

  task.state = "IN_PROGRESS";
  task.paymentStatus = "TASK_IN_PROGRESS";
  task.otpVerifiedAt = new Date().toISOString();
  task.startedAt = new Date().toISOString();

  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "otp_generated",
    title: "Task Started!",
    titleTamil: "பணி தொடங்கியது!",
    message: `OTP verified. '${task.title}' is now in progress.`,
    messageTamil: `OTP சரிபார்க்கப்பட்டது. பணி நடப்பில் உள்ளது.`,
    taskId: task.id,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, task });
});

// Helper marks task complete
app.post("/api/tasks/:id/complete", (req, res) => {
  const task = demoTasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.state = "HELPER_COMPLETED";
  task.completedAt = new Date().toISOString();

  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "task_completed",
    title: "Helper Completed Task",
    titleTamil: "உதவியாளர் பணியை முடித்தார்",
    message: `${task.helperName} marked '${task.title}' as completed. Please confirm to release payment.`,
    messageTamil: `${task.helperName} பணியை முடித்துவிட்டதாக தெரிவித்துள்ளார். பணத்தை விடுவிக்க உறுதிப்படுத்தவும்.`,
    taskId: task.id,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json(task);
});

// Requester confirms completion -> releases payment & adds points
app.post("/api/tasks/:id/confirm-complete", (req, res) => {
  const task = demoTasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.state = "COMPLETED";
  task.paymentStatus = "PAYMENT_RELEASED";

  // Credit helper wallet
  const helper = demoUsers.find((u) => u.id === task.helperId);
  if (helper) {
    helper.wallet.available += task.budget;
    helper.wallet.thisMonth += task.budget;
    helper.wallet.totalEarnings += task.budget;
    helper.completedTasksCount += 1;
    helper.helperPoints += 20; // +20 points for completed task

    demoTransactions.unshift({
      id: `txn-${Date.now()}`,
      userId: helper.id,
      type: "credit",
      amount: task.budget,
      description: `Payment released for '${task.title}'`,
      taskId: task.id,
      status: "completed",
      method: "razorpay_escrow",
      createdAt: new Date().toISOString(),
    });
  }

  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "payment_released",
    title: `Payment Released: ₹${task.budget}`,
    titleTamil: `கட்டணம் விடுவிக்கப்பட்டது: ₹${task.budget}`,
    message: `₹${task.budget} transferred to ${task.helperName}'s wallet. Please leave a rating!`,
    messageTamil: `₹${task.budget} உதவியாளர் வாலட்டில் வரவு வைக்கப்பட்டது. உங்கள் மதிப்பீட்டை வழங்கவும்!`,
    taskId: task.id,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, task, helper });
});

// Requester disputes task
app.post("/api/tasks/:id/dispute", (req, res) => {
  const { reason } = req.body;
  const task = demoTasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.state = "DISPUTED";
  task.paymentStatus = "REFUND_PENDING";
  task.disputeReason = reason || "Task incomplete or unsatisfactory";

  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "sos_alert",
    title: "Dispute Opened",
    titleTamil: "சிக்கல் பதிவு செய்யப்பட்டது",
    message: `Dispute created for '${task.title}'. HelpMate Admin is reviewing the case.`,
    messageTamil: `'${task.title}' பணிக்கு சிக்கல் பதிவு செய்யப்பட்டுள்ளது. நிர்வாகம் பரிசீலிக்கிறது.`,
    taskId: task.id,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, task });
});

// Reviews
app.get("/api/reviews", (req, res) => {
  res.json(demoReviews);
});

app.post("/api/reviews", (req, res) => {
  const { taskId, taskTitle, requesterId, requesterName, requesterAvatar, helperId, rating, tags, comment } = req.body;
  const newReview = {
    id: `rev-${Date.now()}`,
    taskId,
    taskTitle,
    requesterId,
    requesterName,
    requesterAvatar,
    helperId,
    rating: Number(rating) || 5,
    tags: tags || ["Friendly", "Fast"],
    comment: comment || "Great help!",
    createdAt: new Date().toISOString(),
  };

  demoReviews.unshift(newReview);

  // Update helper rating and points
  const helper = demoUsers.find((u) => u.id === helperId);
  if (helper) {
    helper.reviewCount += 1;
    helper.rating = Number(((helper.rating * (helper.reviewCount - 1) + newReview.rating) / helper.reviewCount).toFixed(1));
    if (newReview.rating === 5) {
      helper.helperPoints += 10; // +10 points for 5-star review
    }
  }

  res.status(201).json(newReview);
});

// Messages
app.get("/api/messages", (req, res) => {
  res.json(demoMessages);
});

app.post("/api/messages", (req, res) => {
  const newMsg = {
    id: `msg-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  demoMessages.push(newMsg);
  res.status(201).json(newMsg);
});

// Notifications
app.get("/api/notifications", (req, res) => {
  res.json(demoNotifications);
});

app.post("/api/notifications/mark-all-read", (req, res) => {
  demoNotifications.forEach(n => n.read = true);
  res.json({ success: true });
});

// Wallet & Payout
app.get("/api/transactions", (req, res) => {
  res.json(demoTransactions);
});

app.post("/api/payouts/withdraw", (req, res) => {
  const { userId, amount, method, accountDetails } = req.body;
  const user = demoUsers.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const numAmount = Number(amount);
  if (user.wallet.available < numAmount) {
    return res.status(400).json({ error: "Insufficient available balance" });
  }

  user.wallet.available -= numAmount;

  const txn: WalletTransaction = {
    id: `txn-${Date.now()}`,
    userId,
    type: "payout",
    amount: numAmount,
    description: `Payout to ${method.toUpperCase()}: ${accountDetails}`,
    status: "completed",
    method: method === "upi" ? "upi" : "bank_transfer",
    createdAt: new Date().toISOString(),
  };

  demoTransactions.unshift(txn);
  res.json({ success: true, txn, updatedWallet: user.wallet });
});

// Emergency SOS
app.get("/api/sos", (req, res) => {
  res.json(demoSOSAlerts);
});

app.post("/api/sos/trigger", (req, res) => {
  const { userId, location } = req.body;
  const user = demoUsers.find((u) => u.id === userId) || demoUsers[0];

  const alert: SOSAlert = {
    id: `sos-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userPhone: user.phone,
    userAvatar: user.avatar,
    location: location || user.location,
    timestamp: new Date().toISOString(),
    status: "active",
    emergencyContactsNotified: ["+91 99887 76655 (Dad)", "+91 98401 23456 (Sister)", "HelpMate Safety Dispatch"],
  };

  demoSOSAlerts.unshift(alert);

  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "sos_alert",
    title: "🚨 EMERGENCY SOS BROADCAST",
    titleTamil: "🚨 அவசர SOS எச்சரிக்கை",
    message: `SOS triggered by ${user.name} at ${alert.location.address}. Safety team alerted.`,
    messageTamil: `${user.name} அவசர SOS எச்சரிக்கை அனுப்பியுள்ளார். பாதுகாப்பு குழு தகவல்படப்பட்டுள்ளது.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, alert });
});

// Admin Analytics & Moderation
app.get("/api/admin/analytics", (req, res) => {
  const totalUsers = demoUsers.length;
  const activeHelpers = demoUsers.filter(u => u.isHelperModeOn && u.helperStatus === "available").length;
  const openTasks = demoTasks.filter(t => t.state === "PUBLISHED" || t.state === "ACCEPTED").length;
  const completedTasks = demoTasks.filter(t => t.state === "COMPLETED").length + 42;
  const helperEarnings = demoUsers.reduce((sum, u) => sum + u.wallet.totalEarnings, 0);
  const totalRevenue = Math.round(helperEarnings * 0.12) + 5400; // Platform 12% commission
  const activeDisputes = demoTasks.filter(t => t.state === "DISPUTED").length;

  res.json({
    totalUsers,
    activeHelpers,
    openTasks,
    completedTasks,
    totalRevenue,
    helperEarnings,
    pendingPayouts: 300,
    activeDisputes,
    sosAlertsCount: demoSOSAlerts.length,
  });
});

app.post("/api/admin/tasks/:id/action", (req, res) => {
  const { action } = req.body; // 'approve', 'reject', 'request_changes', 'suspend'
  const task = demoTasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (action === "approve") {
    task.state = "PUBLISHED";
  } else if (action === "reject") {
    task.state = "CANCELLED";
  }

  res.json({ success: true, task });
});

// Authentication & Login (User)
app.post("/api/auth/login", (req, res) => {
  const { identifier, password, otp, type } = req.body;
  
  if (!identifier) {
    return res.status(400).json({ error: "Email or Phone number is required." });
  }

  // Find matching user or fallback to demo user
  const cleanId = identifier.trim().toLowerCase();
  const matched = demoUsers.find(
    (u) => u.email.toLowerCase() === cleanId || u.phone.replace(/\s+/g, "") === cleanId.replace(/\s+/g, "")
  ) || demoUsers[0];

  res.json({
    success: true,
    user: matched,
    token: `token_${matched.id}_${Date.now()}`,
    message: "Login successful.",
  });
});

// Admin Authentication (/admin/login)
app.post("/api/admin/login", (req, res) => {
  const { email, password, otp } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Admin email and password are required." });
  }

  // Check admin credentials
  const cleanEmail = email.trim().toLowerCase();
  const isAdminEmail = cleanEmail === "admin@helpmate.org" || cleanEmail === "admin@helpmate.in" || cleanEmail.includes("admin");

  if (!isAdminEmail) {
    return res.status(401).json({ error: "Unauthorized. Admin credentials not recognized." });
  }

  if (password.length < 4) {
    return res.status(401).json({ error: "Invalid admin password." });
  }

  const adminUser = demoUsers.find((u) => u.role === "admin") || demoUsers[demoUsers.length - 1];

  res.json({
    success: true,
    user: adminUser,
    role: "admin",
    token: `adm_${Date.now()}_secure_session`,
    message: "Administrator session established.",
  });
});

// Admin Verification Logs
app.get("/api/admin/verification-logs", (req, res) => {
  res.json(demoVerificationAuditLogs);
});

// Admin User Verification
app.post("/api/admin/verify-user", (req, res) => {
  const { userId, action, adminId, adminName, note } = req.body;
  const user = demoUsers.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const prevStatus = user.userVerificationStatus || "pending";
  const newStatus = action === "verify" ? "verified" : action === "reject" ? "rejected" : "pending";

  user.userVerificationStatus = newStatus;
  if (action === "verify") {
    user.verificationLevel = "identity_verified";
    if (!user.badges.includes("Verified User")) {
      user.badges.push("Verified User");
    }
  } else if (action === "reject") {
    user.badges = user.badges.filter((b) => b !== "Verified User");
  }

  const log: VerificationAuditLog = {
    id: `log-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    adminId: adminId || "admin-1",
    adminName: adminName || "Admin Office",
    type: "user_verification",
    action: action === "verify" ? "verified" : action === "reject" ? "rejected" : "requested_info",
    previousStatus: prevStatus,
    newStatus: newStatus,
    note: note || `Admin ${action}ed user verification.`,
    timestamp: new Date().toISOString(),
  };

  demoVerificationAuditLogs.unshift(log);

  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "badge_unlocked",
    title: action === "verify" ? "🟢 Profile Verified!" : "🔴 Verification Update",
    titleTamil: action === "verify" ? "🟢 சுயவிவரம் சரிபார்க்கப்பட்டது!" : "🔴 சரிபார்ப்பு புதுப்பிப்பு",
    message: action === "verify" ? "Congratulations! Your HelpMate account is now verified." : `Verification status: ${newStatus}. Note: ${note || ""}`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, user, log });
});

// Admin Helper Verification
app.post("/api/admin/verify-helper", (req, res) => {
  const { userId, action, adminId, adminName, note } = req.body;
  const user = demoUsers.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: "Helper not found" });

  const prevStatus = user.helperVerificationStatus || "pending";
  const newStatus = action === "verify" ? "verified" : action === "reject" ? "rejected" : "pending";

  user.helperVerificationStatus = newStatus;
  if (action === "verify") {
    user.verificationLevel = "trusted_helper";
    if (!user.badges.includes("Verified Helper")) {
      user.badges.push("Verified Helper");
    }
  } else if (action === "reject") {
    user.badges = user.badges.filter((b) => b !== "Verified Helper");
  }

  const log: VerificationAuditLog = {
    id: `log-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    adminId: adminId || "admin-1",
    adminName: adminName || "Admin Office",
    type: "helper_verification",
    action: action === "verify" ? "verified" : action === "reject" ? "rejected" : "requested_info",
    previousStatus: prevStatus,
    newStatus: newStatus,
    note: note || `Admin ${action}ed helper status.`,
    timestamp: new Date().toISOString(),
  };

  demoVerificationAuditLogs.unshift(log);

  demoNotifications.unshift({
    id: `notif-${Date.now()}`,
    type: "badge_unlocked",
    title: action === "verify" ? "🟢 Verified Helper Status Approved!" : "🔴 Helper Verification Update",
    titleTamil: action === "verify" ? "🟢 சரிபார்க்கப்பட்ட உதவியாளர் தகுதி ஒப்புதல்!" : "🔴 உதவியாளர் சரிபார்ப்பு புதுப்பிப்பு",
    message: action === "verify" ? "You are now a Verified Helper! You receive priority task matching and trust badge." : `Helper verification status: ${newStatus}. Note: ${note || ""}`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  res.json({ success: true, user, log });
});

// Smart Nearby Helper Matching Algorithm
app.post("/api/helpers/match", (req, res) => {
  const { taskLocation, category, urgency } = req.body;

  // Filter and score available helpers whose Helper Mode = ON
  const candidateHelpers = demoUsers.filter((u) => u.role === "helper" || u.isHelperModeOn);

  const scoredHelpers = candidateHelpers.map((h) => {
    // Distance approximation (Coimbatore coordinates)
    const latDiff = (h.location.lat - (taskLocation?.lat || 11.0168)) * 111;
    const lngDiff = (h.location.lng - (taskLocation?.lng || 76.9558)) * 105;
    const distanceKm = Math.max(0.3, Math.round(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 10) / 10);
    const etaMinutes = Math.max(2, Math.round(distanceKm * 3.5));

    // Calculate match score
    let score = 0;
    if (h.isHelperModeOn && h.helperStatus === "available") score += 40;
    else if (h.isHelperModeOn && h.helperStatus === "busy") score += 15;
    else score -= 20;

    if (h.helperVerificationStatus === "verified" || h.verificationLevel === "trusted_helper") score += 25;
    score += (h.rating || 4.5) * 5; // e.g. 24.5
    score += Math.min(10, (h.completedTasksCount || 0) / 10);
    score -= distanceKm * 4; // closer is better

    return {
      helper: h,
      distanceKm,
      etaMinutes,
      matchScore: Math.max(10, Math.round(score)),
      isVerifiedHelper: h.helperVerificationStatus === "verified" || h.verificationLevel === "trusted_helper",
    };
  });

  // Sort descending by matchScore
  scoredHelpers.sort((a, b) => b.matchScore - a.matchScore);

  res.json({
    bestMatch: scoredHelpers[0] || null,
    rankedHelpers: scoredHelpers,
  });
});

// Reset Demo Data
app.post("/api/demo/reset", (req, res) => {
  demoTasks[0].state = "ACCEPTED";
  demoTasks[0].otp = "4827";
  demoTasks[0].otpAttempts = 0;
  demoUsers[0].isHelperModeOn = false;
  demoUsers[1].isHelperModeOn = true;
  demoUsers[1].helperStatus = "available";
  res.json({ success: true, message: "Demo data reset successfully" });
});

// Vite Middleware for SPA Development & Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🤝 HelpMate server running on http://localhost:${PORT}`);
  });
}

startServer();
