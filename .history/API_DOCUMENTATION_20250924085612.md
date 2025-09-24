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
