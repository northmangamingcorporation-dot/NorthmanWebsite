# Northman Gaming Corporation - API Documentation

## Overview
This document provides comprehensive documentation for the Northman Gaming Corporation website's API functions, database operations, and system architecture.

## Table of Contents
1. [Database Functions](#database-functions)
2. [Authentication System](#authentication-system)
3. [Form Management](#form-management)
4. [Error Handling](#error-handling)
5. [Backup & Recovery](#backup--recovery)
6. [Performance Monitoring](#performance-monitoring)
7. [Accessibility Features](#accessibility-features)

---

## Database Functions

### Core Database Operations

#### `setDoc(collectionName, docId, data)`
Creates or updates a document in Firestore with enhanced error handling and backup.

**Parameters:**
- `collectionName` (string): Name of the Firestore collection
- `docId` (string): Unique document identifier
- `data` (object): Document data to store

**Returns:**
```javascript
{
  success: boolean,
  docId?: string,
  error?: string,
  code?: string
}
```

**Features:**
- Input validation
- Automatic retry on connection issues
- Local backup for offline capability
- Comprehensive error logging

**Example:**
```javascript
const result = await setDoc('employees', 'emp001', {
  firstName: 'John',
  lastName: 'Doe',
  department: 'IT',
  role: 'Developer'
});

if (result.success) {
  console.log('Employee created successfully');
} else {
  console.error('Failed to create employee:', result.error);
}
```

#### `getDoc(collectionName, docId)`
Retrieves a single document from Firestore.

**Parameters:**
- `collectionName` (string): Name of the Firestore collection
- `docId` (string): Document identifier

**Returns:**
- Document data object or `null` if not found

**Example:**
```javascript
const employee = await getDoc('employees', 'emp001');
if (employee) {
  console.log('Employee found:', employee.firstName, employee.lastName);
}
```

#### `getCollection(collectionName, orderByField?, desc?)`
Retrieves all documents from a collection with caching support.

**Parameters:**
- `collectionName` (string): Name of the Firestore collection
- `orderByField` (string, optional): Field to sort by
- `desc` (boolean, optional): Sort in descending order

**Returns:**
- Array of document objects with `id` field

**Features:**
- Automatic caching (5-minute TTL)
- Fallback to cached data on connection failure
- Retry logic with exponential backoff

**Example:**
```javascript
const employees = await getCollection('employees', 'lastName', false);
employees.forEach(emp => {
  console.log(`${emp.firstName} ${emp.lastName} - ${emp.department}`);
});
```

#### `updateDoc(collectionName, docId, data)`
Updates an existing document in Firestore.

**Parameters:**
- `collectionName` (string): Name of the Firestore collection
- `docId` (string): Document identifier
- `data` (object): Fields to update

**Returns:**
```javascript
{
  success: boolean,
  error?: string
}
```

#### `deleteDoc(collectionName, docId)`
Deletes a document from Firestore.

**Parameters:**
- `collectionName` (string): Name of the Firestore collection
- `docId` (string): Document identifier

**Returns:**
```javascript
{
  success: boolean,
  error?: string
}
```

---

## Backup & Recovery System

### `backupData(collectionNames)`
Creates a comprehensive backup of specified collections.

**Parameters:**
- `collectionNames` (array): Array of collection names to backup

**Returns:**
```javascript
{
  success: boolean,
  backupKey?: string,
  collectionsCount?: number,
  error?: string
}
```

**Example:**
```javascript
const backup = await backupData(['employees', 'orders', 'requests']);
if (backup.success) {
  console.log(`Backup created: ${backup.backupKey}`);
}
```

### `restoreData(backupKey)`
Restores data from a backup.

**Parameters:**
- `backupKey` (string): Key of the backup to restore

**Returns:**
```javascript
{
  success: boolean,
  restoredCount?: number,
  errors?: array,
  error?: string
}
```

### `retryFailedOperations()`
Automatically retries operations that failed due to connection issues.

**Features:**
- Automatically called when connection is restored
- Processes queued failed operations
- Updates failed operations list

### `cleanupStorage()`
Removes old cache and backup data from localStorage.

**Features:**
- Removes cache older than 24 hours
- Removes backups older than 7 days
- Automatically runs on page load

---

## Authentication System

### User Management Functions

#### Login Process
```javascript
// Login is handled through the login modal
// Successful login stores user data in sessionStorage
const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
```

#### User Roles
- **Employee**: Basic access to dashboard and request submission
- **IT Manager**: Access to IT service management
- **Admin Head**: Full administrative access

#### Session Management
- User sessions are stored in `sessionStorage`
- Automatic logout on browser close
- Session validation on page load

---

## Form Management

### Available Forms

#### IT Service Order Form
- Hardware requests
- Software installation
- Technical support tickets
- Equipment maintenance

#### Travel Order Form
- Business travel requests
- Transportation arrangements
- Accommodation bookings
- Expense management

#### Driver Trip Ticket Forms
- Departure approval
- Arrival confirmation
- Route documentation
- Vehicle status updates

### Form Validation
All forms include:
- Real-time field validation
- Required field checking
- Data format validation
- Error message display

---

## Error Handling

### Global Error Tracking
```javascript
window.addEventListener('error', function(e) {
  // Comprehensive error logging
  console.error('Global Error:', {
    message: e.message,
    source: e.filename,
    line: e.lineno,
    column: e.colno,
    stack: e.error?.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
});
```

### Database Error Codes
- `unavailable`: Service temporarily unavailable
- `deadline-exceeded`: Operation timeout
- `permission-denied`: Insufficient permissions
- `not-found`: Document or collection not found

### Retry Logic
- Maximum 3 retry attempts
- Exponential backoff (1s, 2s, 3s)
- Automatic retry on connection restoration

---

## Performance Monitoring

### Metrics Tracked
