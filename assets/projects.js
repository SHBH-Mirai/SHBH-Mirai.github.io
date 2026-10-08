// Portfolio data. Add screenshots to assets/img and list them under `imgs`.
// Names are intentionally generic.
window.PROJECTS = [
  {
    title: "Inventory & Job Costing Platform",
    org: "Coatings industry",
    tags: ["Canvas App", "Dataverse", "Power Automate"],
    summary: "End-to-end inventory app for an epoxy/flooring contractor: barcode check-in/check-out, chemicals, colours and supplies catalogues, stock ledger, and a Job Builder that calculates the product weight to pull per job from square footage, flake size and season.",
    points: ["Barcode scan check-out/check-in with weight tracking per job and user", "Pick-sheet calculator (floor sq ft → lbs of base/top/flake to pull)", "Inventory records ledger with job/status/user filters", "Dark, tablet-first UI with collapsible nav"],
    imgs: ["inv-home","inv-checkout","inv-mgmt","inv-colors","inv-chemicals","inv-supplies","inv-records","inv-jobs","inv-picksheet","inv-picksheets"]
  },
  {
    title: "Issue Tracker & Jira Approval Workflow",
    org: "Enterprise IT",
    tags: ["Canvas App", "SharePoint", "Power Automate"],
    summary: "Document-driven issue tracker on SharePoint. A new file raises a Jira ticket, routes it to channel-specific approvers, and captures approver/requestor responses in a Canvas approval app.",
    points: ["3 chained flows: new file → Jira ticket, send for approval, approval outcome", "Approvers/Members lists keyed by team channel", "Approve / Reject / Ask-for-more-info loop with comments history"],
    imgs: ["tracker-library","tracker-approvals","tracker-approvers","tracker-members"]
  },
  {
    title: "Issue Analysis & Validation Dashboards",
    org: "Banking",
    tags: ["Canvas App", "Power BI"],
    summary: "Analyst workspace to track issues through phases (Phase 1–3, Test Script, Interim/Final Validation) with SLA due dates and escalation counts, backed by a suite of Power BI reports.",
    points: ["Analyst dashboard with phase, SLA and escalation tiles", "Power BI: Issue Analysis Portfolio, Analysis Validation, Escalations, Engagement Completed, PSA SLA, T&M, Gantt", "Embedded reporting for leads and PMs"],
    imgs: []
  },
  {
    title: "Healthcare Member Services on D365",
    org: "Healthcare",
    tags: ["Dynamics 365", "Custom Connector", "Power Automate"],
    summary: "Member search and case automation for a healthcare payer on Dynamics 365 Customer Service. Custom APIs and connectors look up members in the source system; inbound faxes become cases with document metadata.",
    points: ["Member Search Canvas app calling a custom connector (getMember)", "Fax intake flow: General vs Auth faxes → Case + document metadata", "HTTP-triggered flow to download attachments to OneDrive"],
    imgs: ["health-member-search"]
  },
  {
    title: "Product Attribute Search & Reports",
    org: "Manufacturing",
    tags: ["Canvas App", "Dataverse"],
    summary: "Engineering parts lookup: pick a category (e.g. connectors), filter by attributes with conditions, and generate ID-card, summary, commercial and technical reports. Includes bulk upload of BOM/item-group lists.",
    points: ["Dynamic attribute grid with conditions per category", "Bulk list upload against BOM / item group", "Four report types from one search"],
    imgs: ["attr-dashboard","attr-search","attr-upload"]
  },
  {
    title: "Invoice Extraction with AI Builder",
    org: "Proof of concept",
    tags: ["AI Builder", "Power Automate"],
    summary: "Custom document-processing model that reads invoices (including non-English layouts) and extracts subject, date, service, amount and currency into Dataverse for automated processing.",
    points: ["Trained on multi-language invoices", "Feeds a Power Automate flow for posting"],
    imgs: ["ai-invoice"]
  },
  {
    title: "Employee Onboarding (AI Builder form processing)",
    org: "Personal build",
    tags: ["Canvas App", "AI Builder", "SharePoint"],
    summary: "Onboarding app where new hires upload a passport, AI Builder reads the fields, they sign on-screen, and HR approves or rejects from a card dashboard.",
    points: ["Form processor auto-fills passport details", "Pen-input signature capture", "Submitted / Approved / Rejected HR view"],
    imgs: ["eoa-0","eoa-1","eoa-2","eoa-3"]
  },
  {
    title: "My Expense (mobile)",
    org: "Personal build",
    tags: ["Canvas App", "Dataverse", "Power BI"],
    summary: "Phone-layout expense app: submit claims with receipts, approver queue, and an embedded Power BI category report.",
    points: ["Draft → Submitted → Approved/Rejected states with totals", "Approver view with one-tap approve/reject", "Embedded Power BI tile"],
    imgs: ["expense-1","expense-2","expense-3","expense-4","expense-5"]
  },
  {
    title: "Royal India Trucks – Sales CPQ App",
    org: "Personal build",
    tags: ["Canvas App", "Power Automate", "Dataverse"],
    summary: "Configure-Price-Quote sales app: browse trucks with specs and ratings, configure engine/tyres/warranty, and build a priced booking with dealer cost and gross profit.",
    points: ["Animated catalogue with SVG gauges", "Engine selection grid", "Pricing summary with dealer cost and gross profit", "Power Automate + Dataverse back end"],
    imgs: []
  },
  {
    title: "Desk & Parking Reservation",
    org: "Workplace services",
    tags: ["Canvas App", "SharePoint"],
    summary: "Hot-desk and car-slot booking with desk maps, priority/VIP desks, admins and check-in status, on SharePoint lists.",
    points: ["Desks, Reservations, DeskAdmins and VIPs lists", "Desk vs car slot booking with check-in"],
    imgs: []
  },
  {
    title: "HR Training & Onboarding Hub",
    org: "Personal build",
    tags: ["Canvas App", "SharePoint", "Power Automate"],
    summary: "Kanban-style onboarding board (In progress / Hired / Training), training requests with manager and HR approval, and a personal activity dashboard with light and dark themes.",
    points: ["Two-stage approval flows (manager → HR) with Switch on action", "My Activity progress rings"],
    imgs: []
  },
  {
    title: "Timesheet, Calendar & Utility Apps",
    org: "Personal builds",
    tags: ["Canvas App", "Power Automate"],
    summary: "A collection of smaller apps: fortnightly timesheet with approvals, SharePoint event calendar (monthly/weekly), daily PERSTAT reporting, parking slots, and a to-do app with weather on the login screen.",
    points: ["Reusable calendar component", "Scheduled reminder flows (14/7/3-day notices)"],
    imgs: []
  },
  {
    title: "Project Service Automation: Activity Generation",
    org: "Professional services",
    tags: ["Dynamics 365", "Power Automate", "Copilot"],
    summary: "Scheduled activity generation in D365 PSA with holiday checks via child flows. Also built CSV-to-JSON parsing and Excel → SharePoint import flows for the service hub.",
    points: ["Child-flow pattern to stay under the 8-level nesting limit", "Generic CSV parser flow", "Copilot / LLM-assisted documentation"],
    imgs: []
  },
  {
    title: "SharePoint Document Viewer",
    org: "Personal build",
    tags: ["Canvas App", "SharePoint"],
    summary: "Read and upload any document from a Canvas app: files live in a SharePoint library, open in an in-app PDF viewer, with user-specific folders.",
    points: ["SharePoint library wired into Canvas with PDF viewing", "User-dependent folders", "Upload any file type from the app"],
    imgs: []
  },
  {
    title: "Exemption Request Application",
    org: "Enterprise IT",
    tags: ["Canvas App", "SharePoint", "Power Automate"],
    summary: "Delivery project in a developer role: an exemption-request app with SharePoint sites and lists, supporting flows, and access controlled through Azure AD groups.",
    points: ["Configured SharePoint sites and lists", "Built the flows behind the request lifecycle", "Developed the Canvas app", "Azure AD group-based access"],
    imgs: []
  },
  {
    title: "Vaccine Slot Alert App",
    org: "Personal build",
    tags: ["Canvas App", "Power Automate"],
    summary: "Register once and get notified as soon as vaccine slots open near you.",
    points: ["Registration in a Canvas app", "Power Automate polling and notifications"],
    imgs: []
  }
];
