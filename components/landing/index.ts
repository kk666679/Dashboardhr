ex// Main layout
export { default as LandingPage } from '../landing/LandingLayout';

// Layout components
export { EnterpriseHeader } from '../landing/EnterpriseHeader';
export { NavigationBar } from '../landing/NavigationBar';

// Section components
export { PlatformOverviewModule } from '../landing/PlatformOverviewModule';
export { EnterpriseCapabilitiesModule } from '../landing/EnterpriseCapabilitiesModule';
export { WorkforceModule } from '../landing/WorkforceModule';
export { AutomationModule } from '../landing/AiFWMSWorkflow';   // ← changed
export { AiFWMSWorkflow } from '../landing/AiFWMSWorkflow';     // ← added (optional, for direct use)
export { IntegrationsModule } from '../landing/IntegrationsModule';
export { SecurityModule } from '../landing/SecurityModule';
export { PricingPreviewModule } from '../landing/PricingPreviewModule';
export { FAQModule } from '../landing/FAQModule';

export { PersonaRoutingSection } from '../landing/PersonaRoutingSection';
export { OutcomesBar } from '../landing/OutcomesBar';
export { ConnectedWorkflowSection } from '../landing/ConnectedWorkflowSection';
export { default as Marquee } from '../landing/marquee';
export { default as CosmicLanding } from '../landing/cosmic-landing';
export { default as TechStackMarquee } from '../landing/TechStackMarquee';
export * from '../landing/tech-stack';