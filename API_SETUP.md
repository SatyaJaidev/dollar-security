# 🔧 API Configuration Setup

## 📋 **Current Status**
Your application has hardcoded API URLs throughout the codebase. This guide will help you centralize and configure them properly.

## 🚀 **Quick Fix Steps**

### **Step 1: Create Environment File**
Create a `.env.local` file in your project root:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# For production, change to your actual domain:
# NEXT_PUBLIC_API_URL=https://your-domain.com/api
# NEXT_PUBLIC_SOCKET_URL=https://your-domain.com
```

### **Step 2: Restart Your Development Server**
After creating the `.env.local` file, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 📁 **Files That Need Updating**

### **✅ Already Fixed:**
- `lib/config.ts` - Centralized configuration
- `lib/api.ts` - Centralized API service
- `lib/socket.ts` - Updated to use config

### **🔄 Still Need Updates:**
The following files still have hardcoded URLs that need to be updated:

1. **Chat Components:**
   - `components/chatbot/Chatbot.tsx`
   - `components/chatbot/AdminChat.tsx`
   - `components/chatbot/ChatQueriesTable.tsx`

2. **Dashboard Components:**
   - `components/dashboard/VisitorStatsWidget.tsx`
   - `components/dashboard/guards/AddGuardForm.tsx`
   - `components/dashboard/clients/ClientGraph.tsx`
   - `components/dashboard/clients/AddClientModal.tsx`

3. **Admin Pages:**
   - `app/dashboard/admin/clients/page.tsx`
   - `app/dashboard/admin/guards/page.tsx`
   - `app/dashboard/admin/quotation-queries/page.tsx`

4. **Other Components:**
   - `components/pricing.tsx`
   - `components/review-popup.tsx`
   - `components/quotation/QuotationTable.tsx`
   - `components/quotation/ClearedQueriesTable.tsx`

## 🔄 **How to Update Each File**

### **For API Calls:**
Replace hardcoded fetch/axios calls with the centralized API service:

```typescript
// ❌ Old way (hardcoded)
const res = await fetch("http://localhost:5000/api/guards");

// ✅ New way (using centralized API)
import { guardsAPI } from "@/lib/api";
const guards = await guardsAPI.getAll();
```

### **For Socket.io:**
Replace hardcoded socket URLs with the centralized config:

```typescript
// ❌ Old way (hardcoded)
socketRef.current = io("http://localhost:5000", {...});

// ✅ New way (using centralized config)
import { getSocketUrl } from "@/lib/config";
socketRef.current = io(getSocketUrl(), {...});
```

## 🌍 **Environment-Specific Configuration**

### **Development:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### **Production:**
```bash
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-domain.com
```

### **Staging:**
```bash
NEXT_PUBLIC_API_URL=https://staging.your-domain.com/api
NEXT_PUBLIC_SOCKET_URL=https://staging.your-domain.com
```

## 🔒 **Security Notes**

1. **Never commit `.env.local`** to version control
2. **Use `NEXT_PUBLIC_` prefix** for client-side environment variables
3. **Keep sensitive data** in server-side environment variables only
4. **Validate environment variables** on app startup

## 📝 **Next Steps**

1. Create the `.env.local` file
2. Update the remaining files to use the centralized API service
3. Test all functionality in development
4. Deploy with proper production environment variables

## 🆘 **Troubleshooting**

### **Environment variables not loading?**
- Make sure the file is named `.env.local` (not `.env`)
- Restart your development server
- Check that variables start with `NEXT_PUBLIC_`

### **API calls failing?**
- Verify your backend server is running on the correct port
- Check the network tab in browser dev tools
- Ensure CORS is properly configured on your backend

### **Socket connections failing?**
- Verify the socket URL is correct
- Check that your backend supports WebSocket connections
- Ensure the socket server is running 