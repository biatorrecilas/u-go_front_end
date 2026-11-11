import { useEffect, useState } from "react";

export type NotificationKind = "request" | "approval" | "reminder" | "profile" | "ride_update" | "status" | "match";
export type RideVisibilityGroup = "woman" | "man" | "non_binary" | "other" | "prefer_not_to_say";
export type RideVehicleType = "car" | "motorcycle";
export type RideGenderRestriction = "none" | "women_only" | "men_only" | "non_binary_only" | "other_only";
export type RideStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type RideRequestStatus = "pending_driver" | "approved_by_driver" | "confirmed" | "rejected_by_driver" | "declined_by_passenger" | "cancelled_by_passenger";
export type BadgeKind = "feedback" | "achievement";
export type AvatarSkin = "fair" | "light" | "warm" | "tan" | "brown" | "deep";
export type AvatarHairColor = "black" | "dark_brown" | "brown" | "light_brown" | "blonde" | "red" | "gray" | "white" | `#${string}`;
export type AvatarHairStyle = "straight" | "wavy" | "curly" | "coily" | "afro" | "braids" | "locs" | "bun" | "buzz" | "bald";
export type AvatarHairLength = "short" | "medium" | "long";
export type AvatarFacialHair = "none" | "stubble" | "mustache" | "goatee" | "short_beard" | "beard";
export type AvatarOutfitType = "hoodie" | "jacket" | "tee" | "sweater" | "polo" | "varsity" | "overalls" | "jersey" | "turtleneck";
export type AvatarOutfitColor = "green" | "blue" | "coral" | "purple" | "yellow" | "charcoal" | `#${string}`;
export type AvatarHeadwear = "none" | "cap" | "beanie" | "headscarf";
export type AvatarEyewear = "none" | "round_glasses" | "square_glasses" | "sunglasses";
export type AvatarEarAccessory = "none" | "headphones" | "earrings" | "hearing_aid";
export type AvatarOutfitAccessory = "none" | "leaf_pin" | "animal_pin" | "course_pin";
export type AvatarAnimalPin = "cat" | "dog" | "bird" | "rabbit" | "fish" | "turtle";
export type AvatarExpression = "happy" | "calm" | "bored" | "wink";

export interface AvatarConfigRecord {
  enabled: boolean;
  skin: AvatarSkin;
  hairColor: AvatarHairColor;
  hairStyle: AvatarHairStyle;
  hairLength: AvatarHairLength;
  facialHair: AvatarFacialHair;
  facialHairColor: AvatarHairColor;
  outfitType: AvatarOutfitType;
  outfitColor: AvatarOutfitColor;
  headwear: AvatarHeadwear;
  eyewear: AvatarEyewear;
  earAccessory: AvatarEarAccessory;
  outfitAccessory: AvatarOutfitAccessory;
  animalPin: AvatarAnimalPin;
  coursePin: string;
  pinColor: `#${string}`;
  expression: AvatarExpression;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  href: string;
  kind?: NotificationKind;
  isNew?: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  university: string;
  course: string;
  avatar?: string;
  notifications: NotificationItem[];
}

interface AuthApiUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  ride_visibility_group: RideVisibilityGroup;
  account_status: string;
  is_email_verified: boolean;
  university: string;
  university_name: string;
  course: string;
  course_name: string;
  profile?: UserProfileRecord | null;
  badges?: UserBadgeRecord[];
  total_rides_driven?: number;
  total_rides_as_passenger?: number;
  unread_notifications_count?: number;
  avatar_url?: string | null;
}

interface NotificationApiItem {
  id: string;
  type: NotificationKind;
  title: string;
  body: string;
  link_path: string;
  is_read: boolean;
}

interface AuthMessageResponse {
  message: string;
  user?: AuthApiUser;
  debug_verification_code?: string;
  csrf_token?: string | null;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface UniversityOption {
  id: string;
  name: string;
  email_domain: string;
}

export interface BadgeRecord {
  id: string;
  code: string;
  name: string;
  description: string;
  badge_kind: BadgeKind;
  display_color?: string | null;
  is_active: boolean;
}

export interface UserBadgeRecord {
  id: string;
  badge: BadgeRecord;
  progress_value: string;
  target_value?: string | null;
  achieved_at?: string | null;
}

export interface UserProfileRecord {
  avatar_url?: string | null;
  cover_photo_url?: string | null;
  bio?: string | null;
  address_text?: string | null;
  semester?: number | null;
  avatar_config?: Partial<AvatarConfigRecord> | null;
  course?: string;
  course_name?: string;
  phone?: string;
  updated_at?: string;
}

export interface PublicProfileEvaluation {
  badge: BadgeRecord;
  count: number;
}

export interface PublicEngagedProfile {
  id: string;
  full_name: string;
  created_at: string;
  university_name: string;
  course_name: string;
  avatar_url?: string | null;
  cover_photo_url?: string | null;
  bio?: string | null;
  semester?: number | null;
  avatar_config?: Partial<AvatarConfigRecord> | null;
  achievements: UserBadgeRecord[];
  evaluations: PublicProfileEvaluation[];
  impact: {
    total_rides: number;
    rides_as_driver: number;
    rides_as_passenger: number;
    shared_distance_km: number;
    co2_saved_kg: number;
    feedback_count: number;
    co2_methodology: string;
  };
  engagement_title: string;
}

export interface CurrentUserRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  ride_visibility_group: RideVisibilityGroup;
  account_status: string;
  is_email_verified: boolean;
  university: string;
  university_name: string;
  course: string;
  course_name: string;
  avatar_url?: string | null;
  profile?: UserProfileRecord | null;
  badges: UserBadgeRecord[];
  total_rides_driven: number;
  total_rides_as_passenger: number;
  unread_notifications_count: number;
}

export interface CourseOption {
  id: string;
  university: string;
  name: string;
  is_active: boolean;
}

export interface PublicUserRecord {
  id: string;
  full_name: string;
  ride_visibility_group?: RideVisibilityGroup | null;
  avatar_url?: string | null;
}

interface NotificationApiPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationApiItem[];
}

export interface PlatformStats {
  active_users: number;
  completed_rides: number;
  active_rides: number;
  confirmed_matches: number;
  badge_feedback_count: number;
  universities_count: number;
  shared_distance_km: number;
  co2_saved_kg: number;
  co2_methodology: string;
  urban_tree_equivalent_count: number;
  urban_tree_equivalent_methodology: string;
  urban_tree_equivalent_source_url: string;
  updated_at: string;
}

export interface RideSeatRecord {
  id: string;
  seat_number: number;
  seat_status: "available" | "unavailable" | "reserved" | "occupied";
  reserved_for_request_id?: string | null;
  occupant_user?: PublicUserRecord | null;
  updated_at: string;
}

export interface RidePassengerRecord {
  id: string;
  passenger_user: PublicUserRecord;
  seat_number: number;
  confirmed_at: string;
  completed_at?: string | null;
  contact_phone?: string | null;
}

export interface RideRequestRecord {
  id: string;
  ride: string;
  passenger_user?: PublicUserRecord | null;
  seat_number?: number | null;
  status: RideRequestStatus;
  requested_at: string;
  driver_decision_at?: string | null;
  passenger_decision_at?: string | null;
  contact_unlocked_at?: string | null;
}

export interface RidePublicRecord {
  id: string;
  ride_series?: string | null;
  origin_text: string;
  destination_text: string;
  scheduled_start_at: string;
  vehicle_type: RideVehicleType;
  seat_capacity: number;
  gender_restriction: RideGenderRestriction;
  price_amount: string;
  distance_km?: string | null;
  duration_minutes?: number | null;
  notes?: string | null;
  status: RideStatus;
  created_at: string;
  updated_at: string;
  available_seat_numbers: number[];
  available_seat_count: number;
  match_score: number;
  is_recommended: boolean;
  match_reasons: string[];
  match_details: {
    origin_distance_km?: number | null;
    destination_distance_km?: number | null;
    departure_time_difference_minutes?: number | null;
  };
  accept_deviation?: boolean;
  deviation_distance_km?: string | null;
  deviation_time_min?: number | null;
}

export interface RideTrackingRecord {
  id: string;
  ride_series?: string | null;
  driver_user?: PublicUserRecord | null;
  origin_text: string;
  origin_lat?: string | null;
  origin_lng?: string | null;
  destination_text: string;
  destination_lat?: string | null;
  destination_lng?: string | null;
  scheduled_start_at: string;
  vehicle_type: RideVehicleType;
  vehicle_model: string;
  vehicle_plate?: string | null;
  seat_capacity: number;
  driver_contact_phone?: string | null;
  gender_restriction: RideGenderRestriction;
  price_amount: string;
  distance_km?: string | null;
  duration_minutes?: number | null;
  notes?: string | null;
  status: RideStatus;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  available_seat_numbers: number[];
  seats: RideSeatRecord[];
  passengers: RidePassengerRecord[];
  requests: RideRequestRecord[];
  my_request?: RideRequestRecord | null;
  can_view_contact?: boolean;
  accept_deviation?: boolean;
  deviation_distance_km?: string | null;
  deviation_time_min?: number | null;
}

export interface CreateRidePayload {
  origin_text: string;
  destination_text: string;
  scheduled_start_at: string | null;
  vehicle_type: RideVehicleType;
  vehicle_model: string;
  vehicle_plate: string;
  seat_capacity: number;
  driver_contact_phone: string;
  gender_restriction: RideGenderRestriction;
  price_amount: string;
  notes?: string;
  available_seat_numbers?: number[];
  origin_lat?: number | null;
  origin_lng?: number | null;
  destination_lat?: number | null;
  destination_lng?: number | null;
  distance_km?: number | null;
  duration_minutes?: number | null;
  is_recurring?: boolean;
  recurring_days?: string[];
  recurring_start_date?: string | null;
  recurring_end_date?: string | null;
  departure_time?: string;
  accept_deviation?: boolean;
  deviation_distance_km?: number | string | null;
  deviation_time_min?: number | string | null;
}

export interface RideFeedbackRecord {
  id: string;
  ride: string;
  giver_user: string;
  receiver_user: string;
  badge: string;
  badge_detail: BadgeRecord;
  created_at: string;
}

export interface UpdateProfilePayload {
  avatar_url?: string | null;
  cover_photo_url?: string | null;
  bio?: string | null;
  address_text?: string | null;
  semester?: number | null;
  course?: string;
  phone?: string;
}

export interface SignupPayload {
  full_name: string;
  email: string;
  phone: string;
  ride_visibility_group: "woman" | "man" | "non_binary" | "other" | "prefer_not_to_say" | "none";
  custom_gender?: string;
  university: string;
  course: string;
  password: string;
  confirm_password: string;
  address_text?: string;
  terms_version?: string;
  privacy_version?: string;
  accept_terms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember_me: boolean;
}

const API_BASE_URL = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL) ?? "/api";
const AUTH_STORAGE_KEY = "ugo-session";
const AUTH_EVENT = "ugo-auth-change";
const CSRF_COOKIE_KEY = "csrftoken";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitAuthChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

function getCookie(name: string) {
  if (!isBrowser()) {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

function normalizeAppPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

function mapNotification(notification: NotificationApiItem): NotificationItem {
  return {
    id: notification.id,
    title: notification.title,
    description: notification.body,
    href: normalizeAppPath(notification.link_path),
    kind: notification.type,
    isNew: !notification.is_read,
  };
}

function mapSession(user: AuthApiUser, notifications: NotificationApiItem[]): UserSession {
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    university: user.university_name,
    course: user.course_name,
    avatar: user.avatar_url ?? undefined,
    notifications: notifications.map(mapNotification),
  };
}

function extractErrorMessage(payload: unknown, fallbackMessage: string) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return fallbackMessage;
  }

  if ("detail" in payload && typeof payload.detail === "string") {
    return payload.detail;
  }

  const firstEntry = Object.values(payload).find(Boolean);
  if (Array.isArray(firstEntry) && typeof firstEntry[0] === "string") {
    return firstEntry[0];
  }
  if (typeof firstEntry === "string") {
    return firstEntry;
  }

  return fallbackMessage;
}

async function requestJson<T>(path: string, init?: RequestInit) {
  // Separa os headers do resto das configurações
  const { headers, ...restInit } = init ?? {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...restInit, // Espalha método, body, etc. ANTES dos headers
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}), // Adiciona o CSRF Token sem apagar o Content-Type
    },
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(payload, "Não foi possível concluir a solicitação."),
      response.status,
    );
  }

  return payload as T;
}

async function requestJsonWithCsrf<T>(path: string, init?: RequestInit) {
  const csrfToken = await ensureCsrfToken();

  return requestJson<T>(path, {
    ...init,
    headers: {
      "X-CSRFToken": csrfToken ?? "",
      ...(init?.headers ?? {}),
    },
  });
}

async function requestMultipartWithCsrf<T>(path: string, body: FormData) {
  const csrfToken = await ensureCsrfToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "X-CSRFToken": csrfToken ?? "" },
    body,
  });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json() : null;
  if (!response.ok) {
    throw new ApiError(extractErrorMessage(payload, "Não foi possível enviar as imagens."), response.status);
  }
  return payload as T;
}

function buildQueryString(params: Record<string, string | undefined | null>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function getSession(): UserSession | null {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as UserSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function saveSession(session: UserSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  emitAuthChange();
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  emitAuthChange();
}

export async function ensureCsrfToken() {
  const existingToken = getCookie(CSRF_COOKIE_KEY);
  if (existingToken) {
    return existingToken;
  }

  const payload = await requestJson<{ csrfToken: string }>("/auth/csrf/", {
    method: "GET",
    headers: {},
  });

  return payload.csrfToken;
}

export async function fetchUniversities() {
  return requestJson<UniversityOption[]>("/universities/", {
    method: "GET",
    headers: {},
  });
}

export async function fetchCourses(universityId?: string) {
  const query = universityId ? `?university=${encodeURIComponent(universityId)}` : "";
  return requestJson<CourseOption[]>(`/courses/${query}`, {
    method: "GET",
    headers: {},
  });
}

export async function fetchCurrentUser() {
  return requestJson<CurrentUserRecord>("/me/", {
    method: "GET",
    headers: {},
  });
}

export async function fetchCurrentUserProfile() {
  return requestJson<UserProfileRecord>("/me/profile/", {
    method: "GET",
    headers: {},
  });
}

export async function updateCurrentUserProfile(payload: UpdateProfilePayload) {
  return requestJsonWithCsrf<UserProfileRecord>("/me/profile/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateCurrentUserProfileForm(payload: FormData) {
  return requestMultipartWithCsrf<UserProfileRecord>("/me/profile/", payload);
}

export async function fetchBadges(badgeKind?: BadgeKind) {
  return requestJson<BadgeRecord[]>(`/badges/${buildQueryString({ badge_kind: badgeKind })}`, {
    method: "GET",
    headers: {},
  });
}

export async function fetchPublicRides(filters?: {
  status?: RideStatus;
  gender_restriction?: RideGenderRestriction;
  driver_user?: string;
  origin?: string;
  destination?: string;
  date?: string;
  time?: string;
  smart_match?: boolean;
  origin_lat?: number | null;
  origin_lng?: number | null;
  destination_lat?: number | null;
  destination_lng?: number | null;
  vehicle_type?: RideVehicleType | "";
  prefer_deviation?: boolean | null;
  max_distance_km?: number;
  time_flexibility_minutes?: number;
}) {
  return requestJson<RidePublicRecord[]>(`/rides/${buildQueryString({
    status: filters?.status,
    gender_restriction: filters?.gender_restriction,
    driver_user: filters?.driver_user,
    origin: filters?.origin,
    destination: filters?.destination,
    date: filters?.date,
    time: filters?.time,
    smart_match: filters?.smart_match ? "true" : undefined,
    origin_lat: filters?.origin_lat?.toString(),
    origin_lng: filters?.origin_lng?.toString(),
    destination_lat: filters?.destination_lat?.toString(),
    destination_lng: filters?.destination_lng?.toString(),
    vehicle_type: filters?.vehicle_type,
    prefer_deviation: filters?.prefer_deviation == null ? undefined : String(filters.prefer_deviation),
    max_distance_km: filters?.max_distance_km?.toString(),
    time_flexibility_minutes: filters?.time_flexibility_minutes?.toString(),
  })}`, {
    method: "GET",
    headers: {},
  });
}

export async function fetchTrackingRides(type?: "driver" | "passenger") {
  return requestJson<RideTrackingRecord[]>(`/rides/tracking/${buildQueryString({ type })}`, {
    method: "GET",
    headers: {},
  });
}

export async function createRide(payload: CreateRidePayload) {
  return requestJsonWithCsrf<RideTrackingRecord>("/rides/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRide(rideId: string, payload: Partial<CreateRidePayload>) {
  return requestJsonWithCsrf<RideTrackingRecord>(`/rides/${rideId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function startRide(rideId: string) {
  return requestJsonWithCsrf<RideTrackingRecord>(`/rides/${rideId}/start/`, {
    method: "POST",
  });
}

export async function completeRide(rideId: string) {
  return requestJsonWithCsrf<RideTrackingRecord>(`/rides/${rideId}/complete/`, {
    method: "POST",
  });
}

export async function fetchPublicProfile(userId: string) {
  return requestJson<PublicEngagedProfile>(`/users/${encodeURIComponent(userId)}/profile/`, {
    method: "GET",
    headers: {},
  });
}

function notificationSocketUrl() {
  const configured = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_WS_BASE_URL;
  if (configured) {
    return new URL('/ws/notifications/', configured).toString().replace(/^http/, 'ws');
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/notifications/`;
}

export async function fetchPlatformStats() {
  return requestJson<PlatformStats>("/public/stats/", {
    method: "GET",
    headers: {},
  });
}

export async function cancelRide(rideId: string) {
  return requestJsonWithCsrf<RideTrackingRecord>(`/rides/${rideId}/cancel/`, {
    method: "POST",
  });
}

export async function createRideRequest(payload: { ride: string; seat_number?: number }) {
  return requestJsonWithCsrf<RideRequestRecord>("/ride-requests/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchRideRequests(filters?: {
  role?: "driver" | "passenger";
  ride?: string;
  status?: RideRequestStatus;
}) {
  return requestJson<RideRequestRecord[]>(`/ride-requests/${buildQueryString({
    role: filters?.role,
    ride: filters?.ride,
    status: filters?.status,
  })}`, {
    method: "GET",
    headers: {},
  });
}

export async function approveRideRequest(rideRequestId: string) {
  return requestJsonWithCsrf<RideRequestRecord>(`/ride-requests/${rideRequestId}/approve/`, {
    method: "POST",
  });
}

export async function rejectRideRequest(rideRequestId: string) {
  return requestJsonWithCsrf<RideRequestRecord>(`/ride-requests/${rideRequestId}/reject/`, {
    method: "POST",
  });
}

export async function confirmRideRequest(rideRequestId: string) {
  return requestJsonWithCsrf<RideRequestRecord>(`/ride-requests/${rideRequestId}/confirm/`, {
    method: "POST",
  });
}

export async function declineRideRequest(rideRequestId: string) {
  return requestJsonWithCsrf<RideRequestRecord>(`/ride-requests/${rideRequestId}/decline/`, {
    method: "POST",
  });
}

export async function cancelRideRequest(rideRequestId: string) {
  return requestJsonWithCsrf<RideRequestRecord>(`/ride-requests/${rideRequestId}/cancel/`, {
    method: "POST",
  });
}

export async function submitRideFeedback(payload: { ride: string; receiver_user: string; badge: string }) {
  return requestJsonWithCsrf<RideFeedbackRecord>("/ride-feedback/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchRideFeedback(rideId?: string) {
  return requestJson<RideFeedbackRecord[]>(`/ride-feedback/${buildQueryString({ ride: rideId })}`, {
    method: "GET",
    headers: {},
  });
}

export async function refreshAuthSession() {
  try {
    const [user, notificationPage] = await Promise.all([
      requestJson<AuthApiUser>("/me/", { method: "GET", headers: {} }),
      requestJson<NotificationApiPage | NotificationApiItem[]>("/notifications/?page_size=50", { method: "GET", headers: {} }),
    ]);

    const notifications = Array.isArray(notificationPage) ? notificationPage : notificationPage.results;
    const session = mapSession(user, notifications);
    saveSession(session);
    return session;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      clearSession();
    }
    throw error;
  }
}

export async function signUp(payload: SignupPayload) {
  return requestJson<AuthMessageResponse>("/auth/signup/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyEmail(email: string, code: string) {
  const response = await requestJson<AuthMessageResponse>("/auth/verify-email/", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });

  await ensureCsrfToken();
  await refreshAuthSession();
  return response;
}

export async function resendVerification(email: string) {
  return requestJson<AuthMessageResponse>("/auth/resend-verification/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function markNotificationRead(notificationId: string) {
  await requestJsonWithCsrf(`/notifications/${notificationId}/mark_read/`, { method: "POST" });
  return refreshAuthSession();
}

export async function markAllNotificationsRead() {
  await requestJsonWithCsrf<{ updated: number }>("/notifications/mark_all_read/", { method: "POST" });
  return refreshAuthSession();
}

export async function recordRideSearch(payload: {
  origin_text?: string;
  destination_text?: string;
  requested_date?: string | null;
  requested_time?: string | null;
  gender_restriction?: RideGenderRestriction;
  origin_lat?: number | null;
  origin_lng?: number | null;
  destination_lat?: number | null;
  destination_lng?: number | null;
  vehicle_type?: RideVehicleType | "";
  prefer_deviation?: boolean | null;
  max_distance_km?: number;
  time_flexibility_minutes?: number;
}) {
  return requestJsonWithCsrf("/ride-searches/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(email: string) {
  return requestJson<AuthMessageResponse & { debug_reset_uid?: string; debug_reset_token?: string }>("/auth/password-reset/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(payload: { uid: string; token: string; password: string; confirm_password: string }) {
  return requestJson<AuthMessageResponse>("/auth/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginWithPassword(payload: LoginPayload) {
  const response = await requestJson<AuthMessageResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  await ensureCsrfToken();
  await refreshAuthSession();
  return response;
}

export async function logoutSession() {
  const csrfToken = await ensureCsrfToken();

  await requestJson<{ message: string }>("/auth/logout/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrfToken ?? "",
    },
  });

  clearSession();
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function useAuthSession() {
  const [session, setSession] = useState<UserSession | null>(() => getSession());

  useEffect(() => {
    if (!isBrowser()) {
      return undefined;
    }

    const syncSession = () => setSession(getSession());

    window.addEventListener("storage", syncSession);
    window.addEventListener(AUTH_EVENT, syncSession);

    void refreshAuthSession().catch(() => {
      syncSession();
    });
    const refreshNow = () => {
      void refreshAuthSession().catch(() => undefined);
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refreshNow();
    };
    window.addEventListener("focus", refreshNow);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    const refreshInterval = window.setInterval(refreshNow, 30_000);

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(AUTH_EVENT, syncSession);
      window.removeEventListener("focus", refreshNow);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    if (!isBrowser() || !session) return undefined;

    let socket: WebSocket | null = null;
    let reconnectTimer: number | undefined;
    let stopped = false;
    let reconnectDelay = 1_000;

    const connect = () => {
      if (stopped) return;
      socket = new WebSocket(notificationSocketUrl());
      socket.onopen = () => {
        reconnectDelay = 1_000;
      };
      socket.onmessage = () => {
        void refreshAuthSession().catch(() => undefined);
      };
      socket.onclose = () => {
        if (stopped) return;
        reconnectTimer = window.setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 30_000);
      };
    };

    connect();
    return () => {
      stopped = true;
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [session?.id]);

  return session;
}
