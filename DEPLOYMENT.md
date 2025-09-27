# Production Deployment Guide

This guide covers deploying your AI chat application to production with multiple hosting options and best practices.

## Prerequisites

Before deploying, ensure you have:
- [x] Completed all development features
- [x] Environment variables configured
- [x] Database setup (Supabase/PostgreSQL)
- [x] Payment integration (Paystack) configured
- [x] Authentication (Supabase Auth) working
- [x] All features tested locally

## Environment Variables

Create a `.env.production` file with these variables:

```bash
# Database
DATABASE_URL="your_production_database_url"
POSTGRES_URL="your_postgres_connection_string"

# Supabase (Authentication)
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Paystack (Payments)
VITE_PAYSTACK_PUBLIC_KEY="pk_live_your_live_public_key"
PAYSTACK_SECRET_KEY="sk_live_your_live_secret_key"

# AI Services
OPENAI_API_KEY="your_openai_api_key"

# App Configuration
NODE_ENV="production"
VITE_APP_URL="https://yourdomain.com"

# Security
SESSION_SECRET="your_secure_session_secret"
JWT_SECRET="your_jwt_secret"
```

## Hosting Options

### 1. Vercel (Recommended for Frontend + API)

**Pros:**
- Easy deployment from GitHub
- Automatic HTTPS and CDN
- Serverless functions for API
- Built-in analytics
- Great for React/Next.js apps

**Setup:**
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

**Configuration (`vercel.json`):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2. Render (Full-Stack Option)

**Pros:**
- Easy PostgreSQL database hosting
- Docker support
- Automatic deploys from Git
- Free tier available
- Good for full-stack apps

**Setup:**
1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables in dashboard

**Configuration (`render.yaml`):**
```yaml
services:
  - type: web
    name: ai-chat-app
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: ai-chat-db
          property: connectionString

databases:
  - name: ai-chat-db
    databaseName: ai_chat
    user: ai_chat_user
    plan: free
```

### 3. Railway

**Pros:**
- Simple deployment process
- Built-in PostgreSQL
- Automatic scaling
- Good pricing model

**Setup:**
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

### 4. Heroku

**Pros:**
- Mature platform
- Many add-ons available
- Easy scaling
- Good documentation

**Setup:**
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
4. Deploy: `git push heroku main`

**Configuration (`Procfile`):**
```
web: npm start
```

### 5. DigitalOcean App Platform

**Pros:**
- Predictable pricing
- Good performance
- Managed databases
- Easy scaling

**Setup:**
1. Connect GitHub repository
2. Configure build settings
3. Add database component
4. Set environment variables

## Database Deployment

### Option 1: Supabase (Recommended)
- Already integrated with authentication
- Built-in real-time features
- Global CDN
- Automatic backups

### Option 2: Neon (PostgreSQL)
- Serverless PostgreSQL
- Branching for different environments
- Automatic scaling
- Cost-effective

### Option 3: PlanetScale (MySQL)
- Serverless MySQL
- Branching workflow
- Global distribution
- Schema migrations

## Pre-Deployment Checklist

### Code Preparation
- [ ] Remove console.logs and debug code
- [ ] Update API endpoints to production URLs
- [ ] Minify and optimize assets
- [ ] Enable production error handling
- [ ] Set up proper logging

### Security
- [ ] Use HTTPS everywhere
- [ ] Validate all environment variables
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Secure API endpoints

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Optimize images
- [ ] Enable caching headers
- [ ] Monitor bundle size

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Enable performance monitoring

## Production Build Commands

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Run production server
npm start
```

## Domain and SSL

### Custom Domain Setup
1. **Vercel**: Add domain in dashboard, configure DNS
2. **Render**: Add custom domain in service settings
3. **Railway**: Configure custom domain in project settings

### SSL Certificates
Most platforms provide automatic SSL certificates via Let's Encrypt.

## Monitoring and Maintenance

### Recommended Tools
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Uptime Robot
- **Analytics**: PostHog or Google Analytics
- **Performance**: Web Vitals

### Maintenance Tasks
- Regular dependency updates
- Database backups verification
- Security patches
- Performance monitoring
- Cost optimization

## Scaling Considerations

### Horizontal Scaling
- Load balancers
- Multiple server instances
- Database read replicas
- CDN for static content

### Vertical Scaling
- Increase server resources
- Database performance tuning
- Cache optimization
- Code optimization

## Cost Optimization

### Free Tier Options
- **Vercel**: 100GB bandwidth, serverless functions
- **Render**: 750 hours free web service
- **Railway**: $5 credit monthly
- **Supabase**: 500MB database, 50MB file storage

### Production Costs (Estimated Monthly)
- **Small App**: $10-50/month
- **Medium App**: $50-200/month
- **Large App**: $200+/month

## Troubleshooting

### Common Issues
1. **Environment variables not loading**
   - Check variable names and values
   - Verify platform-specific syntax

2. **Database connection errors**
   - Verify connection string
   - Check firewall settings
   - Confirm SSL settings

3. **Build failures**
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Review build logs

4. **API routes not working**
   - Check routing configuration
   - Verify CORS settings
   - Test endpoint accessibility

## Legal and Compliance

### Ghana-Specific Considerations
- **Data Protection**: Comply with Ghana Data Protection Act
- **Business Registration**: Register with Ghana Revenue Authority
- **Payment Processing**: Ensure Paystack compliance
- **Tax Obligations**: VAT registration if applicable

### Founder Information
**Legal Entity**: Akpalu Elliot Elikplim
- Ensure proper business registration
- Tax compliance documentation
- Terms of service and privacy policy

## Support and Documentation

### Resources
- Platform documentation
- Community forums
- Support tickets
- Monitoring alerts

### Backup Plans
- Database backups
- Code repository mirrors
- Environment variable backups
- Documentation updates

---

**Next Steps**: Choose your preferred hosting platform and follow the specific setup guide above. Start with the free tier to test your deployment before scaling to production.