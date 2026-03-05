# Create Organization Edge Function

This Supabase Edge Function handles the creation of organizations with automatic user account creation.

## What it does:
1. Creates an organization in the `organizations` table
2. Creates a Supabase Auth user with the provided email and default password `123456`
3. Links the user to the organization in `organization_members` table as `owner`
4. Includes rollback logic if any step fails

## Deployment:

```bash
supabase functions deploy create-organization
```

## Usage:

```javascript
const { data, error } = await supabase.functions.invoke('create-organization', {
  body: { name: 'Acme Corp', email: 'admin@acme.com' }
})
```

## Response:

```json
{
  "success": true,
  "organization": { "id": 1, "name": "Acme Corp", ... },
  "user": { "id": "uuid", "email": "admin@acme.com" },
  "credentials": { "email": "admin@acme.com", "password": "123456" }
}
```
