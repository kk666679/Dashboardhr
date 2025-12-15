import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Departments
  console.log('Creating departments...');
  const engineering = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: {
      name: 'Engineering',
      description: 'Software development and technical operations',
      location: 'Kuala Lumpur',
      costCenter: 'ENG-001',
    },
  });

  const sales = await prisma.department.upsert({
    where: { name: 'Sales' },
    update: {},
    create: {
      name: 'Sales',
      description: 'Sales and business development',
      location: 'Penang',
      costCenter: 'SAL-001',
    },
  });

  const marketing = await prisma.department.upsert({
    where: { name: 'Marketing' },
    update: {},
    create: {
      name: 'Marketing',
      description: 'Marketing and communications',
      location: 'Kuala Lumpur',
      costCenter: 'MKT-001',
    },
  });

  const hr = await prisma.department.upsert({
    where: { name: 'Human Resources' },
    update: {},
    create: {
      name: 'Human Resources',
      description: 'HR and people operations',
      location: 'Kuala Lumpur',
      costCenter: 'HR-001',
    },
  });

  const operations = await prisma.department.upsert({
    where: { name: 'Operations' },
    update: {},
    create: {
      name: 'Operations',
      description: 'Business operations and logistics',
      location: 'Selangor',
      costCenter: 'OPS-001',
    },
  });

  // Create Leave Types (Malaysian Standard)
  console.log('Creating leave types...');
  const annualLeave = await prisma.leaveType.upsert({
    where: { name: 'Annual Leave' },
    update: {},
    create: {
      name: 'Annual Leave',
      description: 'Annual vacation leave',
      daysPerYear: 14,
      isPaid: true,
      requiresDocument: false,
      color: '#3B82F6',
    },
  });

  const medicalLeave = await prisma.leaveType.upsert({
    where: { name: 'Medical Leave' },
    update: {},
    create: {
      name: 'Medical Leave',
      description: 'Sick leave with medical certificate',
      daysPerYear: 14,
      isPaid: true,
      requiresDocument: true,
      color: '#10B981',
    },
  });

  const hospitalizationLeave = await prisma.leaveType.upsert({
    where: { name: 'Hospitalization Leave' },
    update: {},
    create: {
      name: 'Hospitalization Leave',
      description: 'Hospital admission leave',
      daysPerYear: 60,
      isPaid: true,
      requiresDocument: true,
      color: '#EF4444',
    },
  });

  const maternityLeave = await prisma.leaveType.upsert({
    where: { name: 'Maternity Leave' },
    update: {},
    create: {
      name: 'Maternity Leave',
      description: 'Maternity leave (98 consecutive days)',
      daysPerYear: 98,
      isPaid: true,
      requiresDocument: true,
      color: '#EC4899',
    },
  });

  const paternityLeave = await prisma.leaveType.upsert({
    where: { name: 'Paternity Leave' },
    update: {},
    create: {
      name: 'Paternity Leave',
      description: 'Paternity leave (7 consecutive days)',
      daysPerYear: 7,
      isPaid: true,
      requiresDocument: true,
      color: '#8B5CF6',
    },
  });

  const compassionateLeave = await prisma.leaveType.upsert({
    where: { name: 'Compassionate Leave' },
    update: {},
    create: {
      name: 'Compassionate Leave',
      description: 'Leave for family emergencies',
      daysPerYear: 5,
      isPaid: true,
      requiresDocument: false,
      color: '#F59E0B',
    },
  });

  // Create Malaysian Public Holidays 2024
  console.log('Creating public holidays...');
  const holidays2024 = [
    { name: "New Year's Day", date: new Date('2024-01-01'), isNational: true },
    { name: "Thaipusam", date: new Date('2024-01-25'), isNational: true },
    { name: "Federal Territory Day", date: new Date('2024-02-01'), state: 'Federal Territory', isNational: false },
    { name: "Chinese New Year", date: new Date('2024-02-10'), isNational: true },
    { name: "Chinese New Year (2nd Day)", date: new Date('2024-02-11'), isNational: true },
    { name: "Hari Raya Aidilfitri", date: new Date('2024-04-10'), isNational: true },
    { name: "Hari Raya Aidilfitri (2nd Day)", date: new Date('2024-04-11'), isNational: true },
    { name: "Labour Day", date: new Date('2024-05-01'), isNational: true },
    { name: "Wesak Day", date: new Date('2024-05-22'), isNational: true },
    { name: "Agong's Birthday", date: new Date('2024-06-03'), isNational: true },
    { name: "Hari Raya Aidiladha", date: new Date('2024-06-17'), isNational: true },
    { name: "Awal Muharram", date: new Date('2024-07-07'), isNational: true },
    { name: "Merdeka Day", date: new Date('2024-08-31'), isNational: true },
    { name: "Malaysia Day", date: new Date('2024-09-16'), isNational: true },
    { name: "Prophet Muhammad's Birthday", date: new Date('2024-09-16'), isNational: true },
    { name: "Deepavali", date: new Date('2024-11-01'), isNational: true },
    { name: "Christmas Day", date: new Date('2024-12-25'), isNational: true },
  ];

  for (const holiday of holidays2024) {
    await prisma.publicHoliday.upsert({
      where: {
        id: `${holiday.name}-${holiday.date.getFullYear()}`,
      },
      update: {},
      create: {
        id: `${holiday.name}-${holiday.date.getFullYear()}`,
        name: holiday.name,
        date: holiday.date,
        state: holiday.state,
        isNational: holiday.isNational,
      },
    });
  }

  // Create Compliance Items
  console.log('Creating compliance items...');
  const complianceItems = [
    {
      category: 'Employment Act 1955',
      title: 'Maximum Working Hours',
      description: 'Ensure working hours do not exceed legal limits',
      requirement: 'Maximum 48 hours per week, 8 hours per day',
      status: 'COMPLIANT' as const,
    },
    {
      category: 'Employment Act 1955',
      title: 'Overtime Calculation',
      description: 'Overtime must be calculated at 1.5x normal rate',
      requirement: '1.5x rate for first 8 hours, 2x for subsequent hours',
      status: 'COMPLIANT' as const,
    },
    {
      category: 'Statutory Contributions',
      title: 'EPF Contributions',
      description: 'Monthly EPF contributions for all employees',
      requirement: 'Employee: 11%, Employer: 12% of monthly salary',
      status: 'COMPLIANT' as const,
    },
    {
      category: 'Statutory Contributions',
      title: 'SOCSO Registration',
      description: 'All employees must be registered with SOCSO',
      requirement: 'Register within 30 days of employment',
      status: 'COMPLIANT' as const,
    },
    {
      category: 'Leave Entitlements',
      title: 'Annual Leave',
      description: 'Provide minimum annual leave based on tenure',
      requirement: '8-16 days based on years of service',
      status: 'COMPLIANT' as const,
    },
    {
      category: 'Workplace Safety',
      title: 'OSHA Compliance',
      description: 'Occupational Safety and Health Act compliance',
      requirement: 'Maintain safe working environment',
      status: 'COMPLIANT' as const,
    },
  ];

  for (const item of complianceItems) {
    await prisma.complianceItem.create({
      data: item,
    });
  }

  // Create Compliance Deadlines
  console.log('Creating compliance deadlines...');
  const deadlines = [
    {
      title: 'EPF Monthly Remittance',
      description: 'Submit EPF contributions for current month',
      category: 'Statutory Contributions',
      dueDate: new Date('2024-07-15'),
      priority: 'HIGH' as const,
      status: 'PENDING' as const,
    },
    {
      title: 'SOCSO Contribution Filing',
      description: 'File SOCSO contributions',
      category: 'Statutory Contributions',
      dueDate: new Date('2024-07-15'),
      priority: 'HIGH' as const,
      status: 'PENDING' as const,
    },
    {
      title: 'PCB Monthly Submission',
      description: 'Submit monthly tax deductions',
      category: 'Tax Compliance',
      dueDate: new Date('2024-07-10'),
      priority: 'MEDIUM' as const,
      status: 'PENDING' as const,
    },
  ];

  for (const deadline of deadlines) {
    await prisma.complianceDeadline.create({
      data: deadline,
    });
  }

  // Create Training Programs
  console.log('Creating training programs...');
  await prisma.training.create({
    data: {
      title: 'Workplace Safety Training',
      description: 'Annual mandatory safety training',
      provider: 'DOSH Malaysia',
      category: 'Safety & Compliance',
      duration: 8,
      cost: 500,
      location: 'Kuala Lumpur',
      capacity: 30,
      status: 'SCHEDULED',
    },
  });

  await prisma.training.create({
    data: {
      title: 'Leadership Development Program',
      description: 'Management and leadership skills',
      provider: 'Internal HR',
      category: 'Leadership',
      duration: 24,
      cost: 2000,
      location: 'Online',
      capacity: 20,
      status: 'SCHEDULED',
    },
  });

  // Create Announcement
  console.log('Creating announcements...');
  await prisma.announcement.create({
    data: {
      title: 'Welcome to AI-HRMS',
      content: 'Welcome to our new AI-powered HR Management System. This platform will help streamline all HR operations and ensure compliance with Malaysian labor laws.',
      category: 'System',
      priority: 'MEDIUM',
      targetRoles: ['ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'],
      isActive: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('\nCreated:');
  console.log('- 5 Departments');
  console.log('- 6 Leave Types');
  console.log('- 17 Public Holidays (2024)');
  console.log('- 6 Compliance Items');
  console.log('- 3 Compliance Deadlines');
  console.log('- 2 Training Programs');
  console.log('- 1 Announcement');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
