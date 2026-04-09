import fs from 'fs'
import path from 'path'
import { hash } from 'bcryptjs'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  role: 'owner' | 'admin'
  claimedBusinessSlug: string | null
  resetToken?: string
  resetTokenExpires?: string
  createdAt: string
}

export interface Claim {
  id: string
  businessSlug: string
  businessName: string
  userEmail: string
  userName: string
  verificationCode: string
  codeExpiresAt: string
  verified: boolean
  status: 'pending' | 'approved' | 'rejected'
  proofImage?: string
  message?: string
  createdAt: string
}

// ─── File paths ─────────────────────────────────────────────────────────────

const USERS_FILE = path.join(process.cwd(), 'companies', 'users.json')
const CLAIMS_FILE = path.join(process.cwd(), 'companies', 'claims.json')
const PENDING_LISTINGS_FILE = path.join(process.cwd(), 'companies', 'pending-listings.json')

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJSON<T>(filePath: string): T[] {
  try {
    if (!fs.existsSync(filePath)) return []
    const raw = fs.readFileSync(filePath, 'utf-8').trim()
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeJSON<T>(filePath: string, data: T[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── Users ──────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  return readJSON<User>(USERS_FILE)
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id)
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  const users = getUsers()
  const passwordHash = await hash(password, 10)
  const user: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: email.toLowerCase(),
    name,
    passwordHash,
    role: 'owner',
    claimedBusinessSlug: null,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeJSON(USERS_FILE, users)
  return user
}

export function updateUser(id: string, updates: Partial<User>) {
  const users = getUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...updates }
  writeJSON(USERS_FILE, users)
  return users[idx]
}

// ─── Claims ─────────────────────────────────────────────────────────────────

export function getClaims(): Claim[] {
  return readJSON<Claim>(CLAIMS_FILE)
}

export function getClaimBySlug(slug: string): Claim | undefined {
  return getClaims().find(c => c.businessSlug === slug && c.status !== 'rejected')
}

export function getClaimsByStatus(status: Claim['status']): Claim[] {
  return getClaims().filter(c => c.status === status)
}

export function createClaim(data: Omit<Claim, 'id' | 'createdAt'>): Claim {
  const claims = getClaims()
  const claim: Claim = {
    ...data,
    id: `claim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  }
  claims.push(claim)
  writeJSON(CLAIMS_FILE, claims)
  return claim
}

export function updateClaim(id: string, updates: Partial<Claim>): Claim | null {
  const claims = getClaims()
  const idx = claims.findIndex(c => c.id === id)
  if (idx === -1) return null
  claims[idx] = { ...claims[idx], ...updates }
  writeJSON(CLAIMS_FILE, claims)
  return claims[idx]
}

// ─── Claimed businesses tracker ─────────────────────────────────────────────

export function isBusinessClaimed(slug: string): boolean {
  return getClaims().some(c => c.businessSlug === slug && c.status === 'approved')
}

export function getApprovedClaimForBusiness(slug: string): Claim | undefined {
  return getClaims().find(c => c.businessSlug === slug && c.status === 'approved')
}

export function getClaimedSlugs(): Set<string> {
  return new Set(getClaims().filter(c => c.status === 'approved').map(c => c.businessSlug))
}

// ─── Quote Leads ───────────────────────────────────────────────────────────

const LEADS_FILE = path.join(process.cwd(), 'companies', 'quote-leads.json')

export interface QuoteLead {
  id: string
  name: string
  email: string
  phone: string
  serviceType: string
  quantity: string
  deadline: string
  description: string
  providers: { slug: string; name: string }[]
  createdAt: string
}

export function getQuoteLeads(): QuoteLead[] {
  return readJSON<QuoteLead>(LEADS_FILE)
}

export function createQuoteLead(data: Omit<QuoteLead, 'id' | 'createdAt'>): QuoteLead {
  const leads = getQuoteLeads()
  const lead: QuoteLead = {
    ...data,
    id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  }
  leads.push(lead)
  writeJSON(LEADS_FILE, leads)
  return lead
}

// ─── Pending Listings ───────────────────────────────────────────────────────

export interface PendingListing {
  id: string
  userId: string
  userEmail: string
  userName: string
  businessName: string
  description: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  website: string
  servicesOffered: string[]
  productCategories: string[]
  printingMethods: string[]
  moq: number
  turnaroundDays: number
  rushAvailable: boolean
  pickup: boolean
  delivery: boolean
  ecoFriendly: boolean
  galleryImages: string[]
  coverImage: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export function getPendingListings(): PendingListing[] {
  return readJSON<PendingListing>(PENDING_LISTINGS_FILE)
}

export function createPendingListing(data: Omit<PendingListing, 'id' | 'createdAt'>): PendingListing {
  const listings = getPendingListings()
  const listing: PendingListing = {
    ...data,
    id: `listing_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  }
  listings.push(listing)
  writeJSON(PENDING_LISTINGS_FILE, listings)
  return listing
}

export function updatePendingListing(id: string, updates: Partial<PendingListing>): PendingListing | null {
  const listings = getPendingListings()
  const idx = listings.findIndex(l => l.id === id)
  if (idx === -1) return null
  listings[idx] = { ...listings[idx], ...updates }
  writeJSON(PENDING_LISTINGS_FILE, listings)
  return listings[idx]
}
