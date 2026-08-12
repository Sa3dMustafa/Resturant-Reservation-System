// ============ Enums ============
export type UserRole = "ADMIN" | "STAFF";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export type TableStatus = "AVAILABLE" | "RESERVED" | "OCCUPIED" | "MAINTENANCE";

export type NotificationPreference = "WHATSAPP" | "EMAIL";

// ============ Auth ============
export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// POST /auth/login -> data: { user, accessToken }
export interface LoginResponseData {
  user: User;
  accessToken: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

// ============ Time slots ============
// GET /tables/time-slots takes no query params and returns the full set of
// currently-active slots (data.slots). Field is `isActive`, not
// `isAvailable` — per-table/per-date availability has to be derived by
// cross-referencing a table's `reservations[].slots` for that date (see
// RestaurantTable below), there's no dedicated "available slots" endpoint.
export interface TimeSlot {
  id: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  isActive: boolean;
}

// The condensed slot shape embedded in ReservationListItem (list endpoint) —
// no id/isActive, just the display times.
export interface ReservationListItemSlot {
  date: string;
  startTime: string;
  endTime: string;
}

// ============ Clients ============
export interface ReservationClient {
  name: string;
  email?: string; // NOT required by CreateReservationBody
  phoneNumber: string;
  alternativePhone?: string;
}

// Full client object as returned nested in reservation details
export interface ClientObject {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber: string;
  alternativePhone?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============ Tables ============
// GET /tables and GET /tables/{id} both require a `date` query param and
// return each table with its reservations *for that date only*, each
// reservation including its time slots and client.
export interface RestaurantTable {
  id: string;
  tableNumber: number; // integer per CreateTableBody/TableObject, not string
  capacity: number;
  position: string;
  status: TableStatus;
  reservations?: TableReservation[];
}

// The reservation shape nested under a table (TableObject.reservations[])
export interface TableReservation {
  id: string;
  tableId: string;
  clientId: string;
  reservationCode: string;
  date: string;
  guestCount: number;
  status: ReservationStatus;
  notificationPreference: NotificationPreference;
  expectedArrivalDelay?: string | null;
  specialRequests?: string | null;
  createdAt: string;
  updatedAt: string;
  client: ClientObject;
  slots: TimeSlot[];
}

export interface CreateTableRequest {
  tableNumber: number;
  capacity: number;
  position: string;
}

export interface UpdateTableRequest {
  capacity?: number;
  position?: string;
}

export interface UpdateTableStatusRequest {
  status: TableStatus;
}

// ============ Working Hours ============
// GET /working-hours (optional ?dayOfWeek=) and PUT /working-hours both
// operate on ONE day at a time — PUT is an upsert keyed on dayOfWeek, there
// is no bulk "save whole week" endpoint.
export interface WorkingHour {
  dayOfWeek: number; // 0 = Sunday ... 6 = Saturday, per the query-param docs
  // NOTE: the endpoint description elsewhere says "ordered Saturday (0) to
  // Friday (6)", contradicting the parameter docs' own "0 = Sunday" and
  // flagging it as a "known issue". Frontend follows the more explicit
  // "0 = Sunday" statement; verify against a live response before relying
  // on this for anything business-critical.
  openTime: string; // "HH:mm"
  closeTime: string; // "HH:mm" — may be < openTime for overnight hours
  isClosed: boolean;
}

export type UpdateWorkingHourDayRequest = WorkingHour;

// ============ Time Slot Config ============
export interface UpdateTimeSlotConfigRequest {
  slotDurationMinutes: number;
}

// ============ Reservations ============

// POST /reservations request body
export interface CreateReservationRequest {
  client: ReservationClient;
  tableId: string;
  date: string; // "YYYY-MM-DD"
  guestCount: number;
  timeSlotIds: string[];
  notificationPreference: NotificationPreference;
  expectedArrivalDelay?: string; // free text, e.g. "15 minutes" — NOT a number
  specialRequests?: string;
}

// POST /reservations response (data.reservation) — deliberately minimal,
// does NOT echo back client/table/slots.
export interface CreatedReservation {
  id: string;
  tableId: string;
  clientId: string;
  reservationCode: string;
  date: string;
  guestCount: number;
  status: ReservationStatus; // always PENDING on creation
  notificationPreference: NotificationPreference;
  expectedArrivalDelay?: string | null;
  specialRequests?: string | null;
  createdAt: string;
  updatedAt: string;
}

// GET /reservations/{id} response (data.reservation) — full detail, but
// still no nested `table`, only `tableId`.
export interface ReservationDetail {
  id: string;
  tableId: string;
  clientId: string;
  reservationCode: string;
  date: string;
  guestCount: number;
  status: ReservationStatus;
  notificationPreference: NotificationPreference;
  expectedArrivalDelay?: string | null;
  specialRequests?: string | null;
  createdAt: string;
  updatedAt: string;
  client: ClientObject;
  slots: TimeSlot[];
}

// GET /reservations list item shape — intentionally condensed, different
// from ReservationDetail (no reservationCode, no specialRequests, no full
// client/table).
export interface ReservationListItem {
  id: string;
  guestCount: number;
  status: ReservationStatus;
  client: { id: string; name: string };
  table: { tableNumber: number };
  slots: ReservationListItemSlot[];
}

export interface UpdateReservationStatusRequest {
  status: Extract<ReservationStatus, "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW">;
  cancellationReason?: string;
}

// PATCH /reservations/{id}/status response (data.reservation) — minimal.
export interface ReservationStatusUpdateResult {
  id: string;
  status: ReservationStatus;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReservationsResponseData {
    reservations: ReservationListItem[];
    meta: PaginationMeta;
}

export interface ReservationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReservationStatus;
  tableId?: string;
  date?: string;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}

// ============ Users (admin) ============
export type AdminUser = User;

export interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  role?: UserRole;
  isActive?: boolean;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}

// NOTE: the doc excerpts we have don't show GET /admin/users' exact
// response envelope, only UserListItem/UserUpdateResult schemas. Kept the
// data.users.users + data.users.meta shape (mirroring the documented
// GET /reservations pattern) since nothing contradicts it and it matches
// the server's 200 response in the logs — flagged as unconfirmed.
export interface UsersResponseData {
  users: AdminUser[];
  meta: PaginationMeta;
}

// ============ API envelope ============
export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: ApiValidationError[];
}
