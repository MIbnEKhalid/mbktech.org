# Configuration Guide

## Gmail Settings
```properties
GMAIL_USER=username@gmail.com
GMAIL_PASS=abcdefghijklmnop
```
> **Note:** GMAIL_PASS is an app password, not your Gmail account password.  

> 1: Enable 2-Factor Authentication (2FA) on your Google account.

> 2: Go to your Google Account settings and search for "App Passwords".

> 3: Create a new app password, copy and paste it.

## Database Settings
```properties
NEON_POSTGRES=postgresql://username:password@server.domain/db_name
```

## Environment Settings
```properties
localenv=true
```
> **Important:** Set to `true` for local testing only.  
> Use `false` or other value for production and unit testing.

## Site Settings
```properties
site=main
```
> **Options:** `main`, `docs`, `unilib`, `portfolio`, `privacy`, `api`, `portalapp` `download`

> Active only when `localenv=true`  
> Select based on target domain host