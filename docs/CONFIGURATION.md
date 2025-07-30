# Configuration Guide

This document contains the configuration settings for the Digital Marketplace application.

## Environment Variables

Create a `.env.local` file in the root directory with the following configuration:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Keep your existing API URL for any other services
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Supabase Configuration

- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous public key for your Supabase project

### API Configuration

- `NEXT_PUBLIC_API_URL`: The base URL for your API services (currently set to localhost for development)

## Security Notes

- The Supabase anonymous key is safe to use in client-side code
- Never commit your `.env.local` file to version control
- For production deployments, set these environment variables in your hosting platform
