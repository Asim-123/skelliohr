# Payoneer Payment Integration Setup Guide

This guide will help you set up real Payoneer payment integration for your Skellio HR system.

## 📋 Prerequisites

1. **Payoneer Account**: You need a Payoneer business account
2. **Payoneer Checkout Access**: Enable Payoneer Checkout in your account
3. **API Credentials**: Get your API credentials from Payoneer dashboard

## 🔑 Step 1: Get Payoneer API Credentials

1. Log in to your [Payoneer Account](https://myaccount.payoneer.com/)
2. Navigate to **Settings** → **API Credentials** or **Developer Settings**
3. Create new API credentials or use existing ones
4. You will need:
   - **API Key** (or Client ID)
   - **API Secret** (or Client Secret)
   - **Merchant Code** (or Store Code)

## ⚙️ Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Payoneer Configuration
PAYONEER_API_KEY=your_api_key_here
PAYONEER_API_SECRET=your_api_secret_here
PAYONEER_MERCHANT_CODE=your_merchant_code_here

# Use 'test' for sandbox/testing, 'live' for production
NEXT_PUBLIC_PAYONEER_ENV=test

# Your application URL (for callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### For Production:

```bash
NEXT_PUBLIC_PAYONEER_ENV=live
NEXT_PUBLIC_APP_URL=https://hr.skellio.com
```

## 🧪 Step 3: Testing Without Real Credentials

The system will work in **MOCK MODE** if Payoneer credentials are not configured. This is useful for:
- Local development
- Testing the UI/UX
- Demo purposes

In mock mode:
- Payment modal will show
- Payoneer widget will simulate loading
- Payment will "succeed" after 2 seconds
- No real charges are made

## 🚀 Step 4: Enable Real Payoneer Integration

Once you add your credentials to `.env.local`:

1. Restart your development server:
```bash
npm run dev
```

2. The system will automatically:
   - Create real Payoneer checkout sessions
   - Load the Payoneer payment widget
   - Process real payments
   - Handle webhooks for payment confirmation

## 🔄 Step 5: Configure Webhooks

Payoneer will send payment notifications to your webhook URL.

### Webhook URL:
```
https://your-domain.com/api/payment/webhook
```

### Configure in Payoneer Dashboard:

1. Go to **Settings** → **Webhooks** or **Notifications**
2. Add webhook URL: `https://hr.skellio.com/api/payment/webhook`
3. Enable these events:
   - `payment.success`
   - `payment.failed`
   - `payment.cancelled`

## 📊 How It Works

### Payment Flow:

1. **User tries to add 2nd employee** → Payment modal opens
2. **User clicks "Pay with Payoneer"** → API creates checkout session
3. **Payoneer widget loads** → User enters payment details
4. **Payment processed** → Payoneer sends webhook notification
5. **Subscription activated** → User can add unlimited employees

### Pricing Calculation:

- **1st employee**: FREE
- **Each additional employee**: $5/month
- **Examples**:
  - 2 employees = $5/month (1 × $5)
  - 5 employees = $20/month (4 × $5)
  - 10 employees = $45/month (9 × $5)

## 🔐 Security Notes

1. **Never commit** `.env.local` to version control
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** in production
4. **Verify webhook signatures** (implement in webhook handler)
5. **Use test mode** for development

## 🐛 Troubleshooting

### Issue: "Failed to load payment widget"

**Solution**: Check that:
- Payoneer credentials are correct
- `NEXT_PUBLIC_PAYONEER_ENV` is set to 'test' or 'live'
- Your Payoneer account has Checkout enabled

### Issue: "Payment not required for 1 employee"

**Solution**: This is expected behavior. The system only charges for employees after the first one.

### Issue: Webhook not receiving notifications

**Solution**: 
- Verify webhook URL is publicly accessible
- Check Payoneer dashboard for webhook delivery logs
- Ensure your server is not blocking POST requests

## 📚 Additional Resources

- [Payoneer Checkout Documentation](https://www.payoneer.com/checkout/)
- [Payoneer API Reference](https://developers.payoneer.com/)
- [Payoneer Web SDK](https://www.npmjs.com/package/@payoneer/checkout-web)

## 💡 Testing Checklist

- [ ] Add Payoneer credentials to `.env.local`
- [ ] Restart development server
- [ ] Try adding 2nd employee
- [ ] Verify payment modal opens
- [ ] Check Payoneer widget loads
- [ ] Test payment with test card (in test mode)
- [ ] Verify webhook receives notification
- [ ] Confirm subscription is activated
- [ ] Test adding more employees after payment

## 🎉 Production Deployment

Before going live:

1. ✅ Switch to production credentials
2. ✅ Set `NEXT_PUBLIC_PAYONEER_ENV=live`
3. ✅ Update `NEXT_PUBLIC_APP_URL` to production URL
4. ✅ Configure production webhook URL in Payoneer
5. ✅ Test with real payment in test mode first
6. ✅ Monitor payment logs and webhooks

---

**Need Help?** Contact Payoneer support or check their developer documentation.
