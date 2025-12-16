# AI-HRMS Database Setup Guide

This guide will help you set up the Neon PostgreSQL database for your AI-HRMS application.

## Prerequisites

- Node.js installed (v16 or higher)
- A Neon account (sign up at https://neon.tech)

## Step 1: Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Click "Create Project"
3. Name your project: `ai-hrms`
4. Select your preferred region (choose closest to Malaysia for best performance)
5. Copy the connection string provided

## Step 2: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `DATABASE_URL` in your `.env` file with your Neon connection string:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/ai-hrms?sslmode=require"
   ```

## Step 3: Install Prisma

```bash
npm install prisma @prisma/client
npm install -D prisma
```

## Step 4: Generate Prisma Client

```bash
npx prisma generate
```

## Step 5: Run Database Migrations

```bash
npx prisma db push
```

Or for production:
```bash
npx prisma migrate dev --name init
```

## Step 6: Seed Initial Data (Optional)

Create a seed file to populate initial data:

```bash
npx prisma db seed
```

## Database Schema Overview

### Core Modules

1. **User & Authentication**
   - `User` - System users with role-based access

2. **Employee Management**
   - `Employee` - Complete employee profiles with Malaysian IC, EPF, SOCSO details
   - `Department` - Organizational structure

3. **Leave Management**
   - `LeaveRequest` - Leave applications
   - `LeaveType` - Annual, Medical, Maternity, Paternity, etc.
   - `LeaveBalance` - Track available/used leave days

4. **Attendance**
   - `AttendanceRecord` - Daily check-in/check-out records
   - Tracks work hours, overtime, late arrivals

5. **Payroll**
   - `PayrollRecord` - Monthly salary with Malaysian statutory deductions
   - EPF (11%/12%), SOCSO, EIS, PCB calculations

6. **Performance**
   - `PerformanceReview` - Employee performance evaluations
   - Rating system and goal tracking

7. **Training**
   - `Training` - Training programs
   - `EmployeeTraining` - Track employee training progress

8. **Compliance**
   - `ComplianceItem` - Malaysian labor law compliance tracking
   - `ComplianceDeadline` - Statutory deadline management
   - `PublicHoliday` - Malaysian public holidays

9. **System**
   - `Announcement` - Company-wide announcements
   - `AuditLog` - Track all system changes

## Malaysian Compliance Features

The schema includes fields specifically for Malaysian compliance:

- **IC Number** (MyKad) - Malaysian Identity Card
- **EPF Number** - Employee Provident Fund
- **SOCSO Number** - Social Security Organization
- **EIS Number** - Employment Insurance System
- **Tax Number** - Income Tax registration

### Statutory Contributions Calculated:
- EPF: Employee 11%, Employer 12%
- SOCSO: Based on salary brackets
- EIS: Employee 0.2%, Employer 0.2%
- PCB: Monthly tax deduction

## Useful Prisma Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

## Database Backup

Neon provides automatic backups, but you can also:

```bash
# Export data
npx prisma db pull

# Create manual backup
pg_dump DATABASE_URL > backup.sql
```

## Production Considerations

1. **Connection Pooling**: Neon supports connection pooling out of the box
2. **SSL**: Always use `sslmode=require` in production
3. **Indexes**: Consider adding indexes for frequently queried fields
4. **Data Retention**: Implement archiving strategy for old records
5. **Audit Logs**: Enable comprehensive audit logging for compliance

## Troubleshooting

### Connection Issues
- Verify your Neon database is running
- Check firewall/network settings
- Ensure connection string is correct

### Migration Errors
- Run `npx prisma migrate reset` to start fresh (development only)
- Check for schema conflicts

### Performance
- Use `npx prisma studio` to inspect data
- Add indexes for slow queries
- Consider Neon's caching features

## Support

- Prisma Docs: https://www.prisma.io/docs
- Neon Docs: https://neon.tech/docs
- Malaysia Labor Law: https://malaysia.acclime.com/guides/employment-law/

## Security Notes

⚠️ **Important**:
- Never commit `.env` file to version control
- Rotate database credentials regularly
- Use environment-specific databases (dev/staging/prod)
- Implement proper access controls and user permissions
- Encrypt sensitive employee data at rest
- Follow PDPA (Personal Data Protection Act) guidelines
