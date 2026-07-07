import { z } from 'zod';

export const MalaysianStandardSchema = z.object({
  code: z.string(),
  title: z.string(),
  description: z.string(),
  isoEquivalent: z.string().optional(),
  status: z.enum(['active', 'confirmed', 'revised', 'withdrawn']),
  publishedYear: z.number(),
  revision: z.string().optional(),
  requirements: z.array(z.string()),
  clauses: z.array(z.object({
    number: z.string(),
    title: z.string(),
    content: z.string(),
  })),
});

export type MalaysianStandard = z.infer<typeof MalaysianStandardSchema>;

export const MS_ISO_STANDARDS: MalaysianStandard[] = [
  {
    code: 'MS ISO 9000:2015',
    title: 'Quality management systems - Fundamentals and vocabulary',
    description: 'Second revision - Provides fundamental concepts, principles and vocabulary for quality management systems',
    isoEquivalent: 'ISO 9000:2015',
    status: 'active',
    publishedYear: 2015,
    revision: 'Second revision',
    requirements: [
      'Quality management system fundamentals',
      'Quality management principles',
      'Terms and definitions',
      'Customer focus',
      'Leadership',
      'Engagement of people',
      'Process approach',
      'Improvement',
      'Evidence-based decision making',
      'Relationship management',
    ],
    clauses: [
      { number: '1', title: 'Scope', content: 'Describes fundamental concepts and principles of quality management' },
      { number: '2', title: 'Quality management systems - Fundamentals', content: 'Core concepts and principles' },
      { number: '3', title: 'Terms and definitions', content: 'Vocabulary for quality management systems' },
    ],
  },
  {
    code: 'MS ISO 9001:2015',
    title: 'Quality management systems - Requirements',
    description: 'Second revision (ISO 9001:2015, IDT) - Specifies requirements for a quality management system',
    isoEquivalent: 'ISO 9001:2015',
    status: 'active',
    publishedYear: 2015,
    revision: 'Second revision',
    requirements: [
      'Context of the organization',
      'Leadership and commitment',
      'Quality policy',
      'Organizational roles, responsibilities and authorities',
      'Actions to address risks and opportunities',
      'Quality objectives and planning',
      'Resources',
      'Competence',
      'Awareness',
      'Communication',
      'Documented information',
      'Operational planning and control',
      'Requirements for products and services',
      'Design and development',
      'Control of externally provided processes, products and services',
      'Production and service provision',
      'Release of products and services',
      'Control of nonconforming outputs',
      'Monitoring, measurement, analysis and evaluation',
      'Internal audit',
      'Management review',
      'Nonconformity and corrective action',
      'Continual improvement',
    ],
    clauses: [
      { number: '4', title: 'Context of the organization', content: 'Understanding organization and its context, interested parties, QMS scope' },
      { number: '5', title: 'Leadership', content: 'Leadership and commitment, policy, organizational roles' },
      { number: '6', title: 'Planning', content: 'Actions to address risks and opportunities, quality objectives' },
      { number: '7', title: 'Support', content: 'Resources, competence, awareness, communication, documented information' },
      { number: '8', title: 'Operation', content: 'Operational planning, requirements, design, production, release' },
      { number: '9', title: 'Performance evaluation', content: 'Monitoring, measurement, analysis, internal audit, management review' },
      { number: '10', title: 'Improvement', content: 'Nonconformity, corrective action, continual improvement' },
    ],
  },
  {
    code: 'MS ISO/TS 9002:2016',
    title: 'Quality management systems - Guidelines for the application of ISO 9001:2015',
    description: 'CONFIRMED:2024 (ISO/TS 9002:2016, IDT) - Published by Standards Malaysia in 2017',
    isoEquivalent: 'ISO/TS 9002:2016',
    status: 'confirmed',
    publishedYear: 2017,
    requirements: [
      'Guidance on ISO 9001:2015 implementation',
      'Context of the organization guidance',
      'Leadership guidance',
      'Planning guidance',
      'Support guidance',
      'Operation guidance',
      'Performance evaluation guidance',
      'Improvement guidance',
      'Examples and best practices',
    ],
    clauses: [
      { number: '4', title: 'Context guidance', content: 'Practical guidance for understanding organizational context' },
      { number: '5', title: 'Leadership guidance', content: 'Implementation guidance for leadership requirements' },
      { number: '6', title: 'Planning guidance', content: 'Risk-based thinking and planning guidance' },
      { number: '7', title: 'Support guidance', content: 'Resource management and documentation guidance' },
      { number: '8', title: 'Operation guidance', content: 'Operational process control guidance' },
      { number: '9', title: 'Performance evaluation guidance', content: 'Monitoring and measurement guidance' },
      { number: '10', title: 'Improvement guidance', content: 'Continual improvement implementation guidance' },
    ],
  },
  {
    code: 'MS ISO 9004:2009',
    title: 'Managing for the sustained success of an organization - A quality management approach',
    description: 'FIRST REVISION (ISO 9004:2009, IDT) - Published by Standards Malaysia in 2010',
    isoEquivalent: 'ISO 9004:2009',
    status: 'active',
    publishedYear: 2010,
    revision: 'First revision',
    requirements: [
      'Sustained success through quality management',
      'Strategy and policy',
      'Resource management',
      'Process management',
      'Monitoring, measurement and analysis',
      'Improvement, innovation and learning',
      'Self-assessment',
      'Organizational maturity',
    ],
    clauses: [
      { number: '4', title: 'Managing for sustained success', content: 'Framework for sustained organizational success' },
      { number: '5', title: 'Strategy and policy', content: 'Strategic planning and policy deployment' },
      { number: '6', title: 'Resource management', content: 'People, infrastructure, work environment, knowledge' },
      { number: '7', title: 'Process management', content: 'Process planning, control and improvement' },
      { number: '8', title: 'Monitoring and measurement', content: 'Performance monitoring and analysis' },
      { number: '9', title: 'Improvement, innovation and learning', content: 'Continual improvement and innovation' },
    ],
  },
];

export class MalaysianStandardsService {
  getStandard(code: string): MalaysianStandard | undefined {
    return MS_ISO_STANDARDS.find(s => s.code === code);
  }

  getAllStandards(): MalaysianStandard[] {
    return MS_ISO_STANDARDS;
  }

  getActiveStandards(): MalaysianStandard[] {
    return MS_ISO_STANDARDS.filter(s => s.status === 'active');
  }

  searchStandards(query: string): MalaysianStandard[] {
    const lowerQuery = query.toLowerCase();
    return MS_ISO_STANDARDS.filter(s => 
      s.code.toLowerCase().includes(lowerQuery) ||
      s.title.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
    );
  }

  getRequirements(code: string): string[] {
    const standard = this.getStandard(code);
    return standard?.requirements || [];
  }

  getClauses(code: string) {
    const standard = this.getStandard(code);
    return standard?.clauses || [];
  }

  checkCompliance(code: string, implementedRequirements: string[]): {
    total: number;
    implemented: number;
    missing: string[];
    percentage: number;
  } {
    const standard = this.getStandard(code);
    if (!standard) {
      return { total: 0, implemented: 0, missing: [], percentage: 0 };
    }

    const missing = standard.requirements.filter(
      req => !implementedRequirements.some(impl => 
        impl.toLowerCase().includes(req.toLowerCase())
      )
    );

    const implemented = standard.requirements.length - missing.length;
    const percentage = (implemented / standard.requirements.length) * 100;

    return {
      total: standard.requirements.length,
      implemented,
      missing,
      percentage,
    };
  }
}

export const msService = new MalaysianStandardsService();