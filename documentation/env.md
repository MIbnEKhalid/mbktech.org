# Configuration Guide

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