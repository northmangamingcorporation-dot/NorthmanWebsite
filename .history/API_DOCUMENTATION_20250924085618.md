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
