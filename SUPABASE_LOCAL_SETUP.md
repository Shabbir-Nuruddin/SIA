# Local Supabase Setup (Windows)

This repo is already initialized for Supabase (`supabase/config.toml` exists).

## 1) Prerequisites

- Docker Desktop running
- Supabase CLI installed globally
  - `npm i -g supabase`

If PowerShell blocks `supabase.ps1`, use the npm scripts below (they call `cmd`).

## 2) Function env file

Create your local function env file:

```bash
copy supabase\functions\.env.local.example supabase\functions\.env.local
```

Fill in keys you need for local function testing.

## 3) Common commands

```bash
npm run supabase:version
npm run supabase:start
npm run supabase:status
npm run supabase:functions:serve
```

Stop local stack:

```bash
npm run supabase:stop
```

Reset local DB from migrations:

```bash
npm run supabase:db:reset
```

## 4) Link to cloud project (optional)

```bash
npm run supabase:link
```

Project ref used by this repo:

`womqjniplkfthbxkzlkb`
