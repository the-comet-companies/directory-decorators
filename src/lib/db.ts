import { hash } from 'bcryptjs'
import { supabase } from './supabase'

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

// ─── Row mappers (snake_case ↔ camelCase) ───────────────────────────────────

type UserRow = {
  id: string
  email: string
  name: string
  password_hash: string
  role: string
  claimed_business_slug: string | null
  reset_token: string | null
  reset_token_expires: string | null
  created_at: string
}

function userFromRow(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    role: row.role as 'owner' | 'admin',
    claimedBusinessSlug: row.claimed_business_slug,
    resetToken: row.reset_token || undefined,
    resetTokenExpires: row.reset_token_expires || undefined,
    createdAt: row.created_at,
  }
}

type ClaimRow = {
  id: string
  business_slug: string
  business_name: string
  user_email: string
  user_name: string
  verification_code: string | null
  code_expires_at: string | null
  verified: boolean
  status: string
  proof_image: string | null
  message: string | null
  created_at: string
}

function claimFromRow(row: ClaimRow): Claim {
  return {
    id: row.id,
    businessSlug: row.business_slug,
    businessName: row.business_name,
    userEmail: row.user_email,
    userName: row.user_name,
    verificationCode: row.verification_code || '',
    codeExpiresAt: row.code_expires_at || '',
    verified: row.verified,
    status: row.status as Claim['status'],
    proofImage: row.proof_image || undefined,
    message: row.message || undefined,
    createdAt: row.created_at,
  }
}

type QuoteLeadRow = {
  id: string
  name: string
  email: string
  phone: string | null
  service_type: string | null
  quantity: string | null
  deadline: string | null
  description: string | null
  providers: { slug: string; name: string }[]
  created_at: string
}

function leadFromRow(row: QuoteLeadRow): QuoteLead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    serviceType: row.service_type || '',
    quantity: row.quantity || '',
    deadline: row.deadline || '',
    description: row.description || '',
    providers: row.providers || [],
    createdAt: row.created_at,
  }
}

type PendingListingRow = {
  id: string
  user_id: string
  user_email: string
  user_name: string
  business_name: string
  description: string | null
  address: string | null
  city: string | null
  state: string | null
  phone: string | null
  email: string | null
  website: string | null
  services_offered: string[]
  product_categories: string[]
  printing_methods: string[]
  moq: number
  turnaround_days: number
  rush_available: boolean
  pickup: boolean
  delivery: boolean
  eco_friendly: boolean
  gallery_images: string[]
  cover_image: string | null
  status: string
  created_at: string
}

function listingFromRow(row: PendingListingRow): PendingListing {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    userName: row.user_name,
    businessName: row.business_name,
    description: row.description || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    phone: row.phone || '',
    email: row.email || '',
    website: row.website || '',
    servicesOffered: row.services_offered || [],
    productCategories: row.product_categories || [],
    printingMethods: row.printing_methods || [],
    moq: row.moq,
    turnaroundDays: row.turnaround_days,
    rushAvailable: row.rush_available,
    pickup: row.pickup,
    delivery: row.delivery,
    ecoFriendly: row.eco_friendly,
    galleryImages: row.gallery_images || [],
    coverImage: row.cover_image || '',
    status: row.status as PendingListing['status'],
    createdAt: row.created_at,
  }
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*')
  if (error || !data) return []
  return (data as UserRow[]).map(userFromRow)
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .maybeSingle()
  if (error || !data) return undefined
  return userFromRow(data as UserRow)
}

export async function getUserById(id: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return undefined
  return userFromRow(data as UserRow)
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  const passwordHash = await hash(password, 10)
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const row = {
    id,
    email: email.toLowerCase(),
    name,
    password_hash: passwordHash,
    role: 'owner',
    claimed_business_slug: null,
  }
  const { data, error } = await supabase.from('users').insert(row).select().single()
  if (error || !data) throw new Error(error?.message || 'Failed to create user')
  return userFromRow(data as UserRow)
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const row: Record<string, unknown> = {}
  if (updates.email !== undefined) row.email = updates.email
  if (updates.name !== undefined) row.name = updates.name
  if (updates.passwordHash !== undefined) row.password_hash = updates.passwordHash
  if (updates.role !== undefined) row.role = updates.role
  if (updates.claimedBusinessSlug !== undefined) row.claimed_business_slug = updates.claimedBusinessSlug
  if (updates.resetToken !== undefined) row.reset_token = updates.resetToken || null
  if (updates.resetTokenExpires !== undefined) row.reset_token_expires = updates.resetTokenExpires || null

  const { data, error } = await supabase.from('users').update(row).eq('id', id).select().maybeSingle()
  if (error || !data) return null
  return userFromRow(data as UserRow)
}

// ─── Claims ─────────────────────────────────────────────────────────────────

export async function getClaims(): Promise<Claim[]> {
  const { data, error } = await supabase.from('claims').select('*').order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as ClaimRow[]).map(claimFromRow)
}

export async function getClaimBySlug(slug: string): Promise<Claim | undefined> {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('business_slug', slug)
    .neq('status', 'rejected')
    .maybeSingle()
  if (error || !data) return undefined
  return claimFromRow(data as ClaimRow)
}

export async function getClaimsByStatus(status: Claim['status']): Promise<Claim[]> {
  const { data, error } = await supabase.from('claims').select('*').eq('status', status)
  if (error || !data) return []
  return (data as ClaimRow[]).map(claimFromRow)
}

export async function createClaim(data: Omit<Claim, 'id' | 'createdAt'>): Promise<Claim> {
  const id = `claim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const row = {
    id,
    business_slug: data.businessSlug,
    business_name: data.businessName,
    user_email: data.userEmail,
    user_name: data.userName,
    verification_code: data.verificationCode || null,
    code_expires_at: data.codeExpiresAt || null,
    verified: data.verified,
    status: data.status,
    proof_image: data.proofImage || null,
    message: data.message || null,
  }
  const { data: inserted, error } = await supabase.from('claims').insert(row).select().single()
  if (error || !inserted) throw new Error(error?.message || 'Failed to create claim')
  return claimFromRow(inserted as ClaimRow)
}

export async function updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | null> {
  const row: Record<string, unknown> = {}
  if (updates.businessSlug !== undefined) row.business_slug = updates.businessSlug
  if (updates.businessName !== undefined) row.business_name = updates.businessName
  if (updates.userEmail !== undefined) row.user_email = updates.userEmail
  if (updates.userName !== undefined) row.user_name = updates.userName
  if (updates.verificationCode !== undefined) row.verification_code = updates.verificationCode || null
  if (updates.codeExpiresAt !== undefined) row.code_expires_at = updates.codeExpiresAt || null
  if (updates.verified !== undefined) row.verified = updates.verified
  if (updates.status !== undefined) row.status = updates.status
  if (updates.proofImage !== undefined) row.proof_image = updates.proofImage || null
  if (updates.message !== undefined) row.message = updates.message || null

  const { data, error } = await supabase.from('claims').update(row).eq('id', id).select().maybeSingle()
  if (error || !data) return null
  return claimFromRow(data as ClaimRow)
}

// ─── Claimed businesses tracker ─────────────────────────────────────────────

export async function isBusinessClaimed(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('claims')
    .select('id')
    .eq('business_slug', slug)
    .eq('status', 'approved')
    .limit(1)
  if (error) return false
  return (data?.length || 0) > 0
}

export async function getApprovedClaimForBusiness(slug: string): Promise<Claim | undefined> {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('business_slug', slug)
    .eq('status', 'approved')
    .maybeSingle()
  if (error || !data) return undefined
  return claimFromRow(data as ClaimRow)
}

export async function getClaimedSlugs(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('claims')
    .select('business_slug')
    .eq('status', 'approved')
  if (error || !data) return new Set()
  return new Set((data as { business_slug: string }[]).map(c => c.business_slug))
}

// ─── Quote Leads ───────────────────────────────────────────────────────────

export async function getQuoteLeads(): Promise<QuoteLead[]> {
  const { data, error } = await supabase
    .from('quote_leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as QuoteLeadRow[]).map(leadFromRow)
}

export async function createQuoteLead(data: Omit<QuoteLead, 'id' | 'createdAt'>): Promise<QuoteLead> {
  const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const row = {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    service_type: data.serviceType || null,
    quantity: data.quantity || null,
    deadline: data.deadline || null,
    description: data.description || null,
    providers: data.providers,
  }
  const { data: inserted, error } = await supabase.from('quote_leads').insert(row).select().single()
  if (error || !inserted) throw new Error(error?.message || 'Failed to create lead')
  return leadFromRow(inserted as QuoteLeadRow)
}

// ─── Pending Listings ───────────────────────────────────────────────────────

export async function getPendingListings(): Promise<PendingListing[]> {
  const { data, error } = await supabase
    .from('pending_listings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as PendingListingRow[]).map(listingFromRow)
}

export async function createPendingListing(data: Omit<PendingListing, 'id' | 'createdAt'>): Promise<PendingListing> {
  const id = `listing_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const row = {
    id,
    user_id: data.userId,
    user_email: data.userEmail,
    user_name: data.userName,
    business_name: data.businessName,
    description: data.description || null,
    address: data.address || null,
    city: data.city || null,
    state: data.state || null,
    phone: data.phone || null,
    email: data.email || null,
    website: data.website || null,
    services_offered: data.servicesOffered,
    product_categories: data.productCategories,
    printing_methods: data.printingMethods,
    moq: data.moq,
    turnaround_days: data.turnaroundDays,
    rush_available: data.rushAvailable,
    pickup: data.pickup,
    delivery: data.delivery,
    eco_friendly: data.ecoFriendly,
    gallery_images: data.galleryImages,
    cover_image: data.coverImage || null,
    status: data.status,
  }
  const { data: inserted, error } = await supabase.from('pending_listings').insert(row).select().single()
  if (error || !inserted) throw new Error(error?.message || 'Failed to create listing')
  return listingFromRow(inserted as PendingListingRow)
}

export async function updatePendingListing(id: string, updates: Partial<PendingListing>): Promise<PendingListing | null> {
  const row: Record<string, unknown> = {}
  if (updates.businessName !== undefined) row.business_name = updates.businessName
  if (updates.description !== undefined) row.description = updates.description || null
  if (updates.address !== undefined) row.address = updates.address || null
  if (updates.city !== undefined) row.city = updates.city || null
  if (updates.state !== undefined) row.state = updates.state || null
  if (updates.phone !== undefined) row.phone = updates.phone || null
  if (updates.email !== undefined) row.email = updates.email || null
  if (updates.website !== undefined) row.website = updates.website || null
  if (updates.servicesOffered !== undefined) row.services_offered = updates.servicesOffered
  if (updates.productCategories !== undefined) row.product_categories = updates.productCategories
  if (updates.printingMethods !== undefined) row.printing_methods = updates.printingMethods
  if (updates.moq !== undefined) row.moq = updates.moq
  if (updates.turnaroundDays !== undefined) row.turnaround_days = updates.turnaroundDays
  if (updates.rushAvailable !== undefined) row.rush_available = updates.rushAvailable
  if (updates.pickup !== undefined) row.pickup = updates.pickup
  if (updates.delivery !== undefined) row.delivery = updates.delivery
  if (updates.ecoFriendly !== undefined) row.eco_friendly = updates.ecoFriendly
  if (updates.galleryImages !== undefined) row.gallery_images = updates.galleryImages
  if (updates.coverImage !== undefined) row.cover_image = updates.coverImage || null
  if (updates.status !== undefined) row.status = updates.status

  const { data, error } = await supabase.from('pending_listings').update(row).eq('id', id).select().maybeSingle()
  if (error || !data) return null
  return listingFromRow(data as PendingListingRow)
}
