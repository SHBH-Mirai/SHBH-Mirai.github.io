// profile.js: skills and certifications shown in the About section.
// Edit the lists below; the page builds itself from them (see site.js).

// Skills grouped by how deep the experience is. No numbers on purpose.
window.SKILLS = [
  {
    group: 'Core',
    note: 'Daily work, delivered in production',
    items: ['Power Apps (Canvas & model-driven)', 'Power Fx', 'Power Automate', 'SharePoint Online', 'Delegation-safe app design', 'Requirements & stakeholder mapping']
  },
  {
    group: 'Working',
    note: 'Regular use on projects',
    items: ['Dataverse', 'Dynamics 365 CE (Sales, Customer Service, PSA)', 'Custom connectors & REST APIs', 'Business process flows', 'Power BI', 'AI Builder', 'Solution ALM']
  },
  {
    group: 'Exploring',
    note: 'Currently learning and building with',
    items: ['Copilot & LLM-assisted delivery', 'Azure Logic Apps', 'JavaScript / TypeScript', 'React', 'SQL']
  }
];

// Microsoft certifications. "color" is the badge colour, "icon" picks one of the icons in site.js.
window.CERTS = [
  { title: 'Power Platform Developer', level: 'Associate', color: '#ff3fd8', icon: 'code', exam: 'PL-400', covers: 'Building Power Apps and Dataverse solutions with code: plug-ins, custom connectors, PCF components and integrations.' },
  { title: 'Power Platform Functional Consultant', level: 'Associate', color: '#ff3fd8', icon: 'gear', exam: 'PL-200', covers: 'Configuring Dataverse, apps, flows and chatbots to meet business requirements.' },
  { title: 'Power Platform App Maker', level: 'Associate', color: '#ffc94a', icon: 'app', exam: 'PL-100', covers: 'Designing and building Canvas apps, flows and simple data models as a maker.' },
  { title: 'Power Platform Fundamentals', level: 'Fundamentals', color: '#7f8bff', icon: 'star', exam: 'PL-900', covers: 'The business value and core parts of Power Apps, Power Automate, Power BI and Dataverse.' }
];
