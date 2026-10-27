// scripts/seed.js
// Idempotent seed script for the Backlog platform.
// Safe to run multiple times — only creates/updates seeded records,
// never deletes non-seeded user data.

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Feedback = require('../models/Feedback');
const BugReport = require('../models/BugReport');
const Comment = require('../models/Comment');
const Changelog = require('../models/Changelog');

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Upserts a user by email. Hashes the password only when creating or when the
 * stored hash doesn't already match (avoids unnecessary re-hashing).
 */
async function upsertUser({ name, email, password, role, bio }) {
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`  ↩  User already exists: ${email}`);
    return existing;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword, role, bio: bio || '' });
  console.log(`  ✅ Created user: ${email} (${role})`);
  return user;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // ── 1. Users ──────────────────────────────────────────────────────────────
    console.log('📦 Seeding users...');

    const adminUser = await upsertUser({
      name: 'Alex Morgan',
      email: 'admin@backlog.dev',
      password: 'Admin@1234',
      role: 'admin',
      bio: 'Platform administrator and lead product manager at Backlog.',
    });

    const sarah = await upsertUser({
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: 'User@1234',
      role: 'user',
      bio: 'Frontend developer passionate about great UX and accessibility.',
    });

    const marcus = await upsertUser({
      name: 'Marcus Johnson',
      email: 'marcus@example.com',
      password: 'User@1234',
      role: 'user',
      bio: 'Full-stack engineer who loves building tools that make teams more productive.',
    });

    // ── 2. Feedback ───────────────────────────────────────────────────────────
    console.log('\n📦 Seeding feedback...');

    const feedbackData = [
      {
        title: 'Dark Mode Support',
        description:
          'Add a dark mode theme option to reduce eye strain during late-night work sessions. Many users work in low-light environments, and a dark theme would significantly improve comfort and accessibility. The toggle should persist across sessions and be accessible from the user preferences menu.',
        category: 'Feature Request',
        status: 'Planned',
        voteCount: 45,
        tags: ['dark-mode', 'theme', 'accessibility', 'ui'],
        author: sarah._id,
      },
      {
        title: 'Export Reports to PDF',
        description:
          'Allow users to export feedback summaries, bug report lists, and roadmap views as PDF documents. This is critical for sharing progress with stakeholders who do not have accounts on the platform. The export should include charts, filters applied, and a timestamp.',
        category: 'Feature Request',
        status: 'In Progress',
        voteCount: 38,
        tags: ['export', 'pdf', 'reporting'],
        author: marcus._id,
      },
      {
        title: 'Keyboard Shortcut Navigation',
        description:
          'Implement comprehensive keyboard shortcuts throughout the application to allow power users to navigate without a mouse. This is especially important for accessibility compliance and for users who rely on assistive technology. A shortcut reference modal (activated by pressing ?) would be very helpful.',
        category: 'Accessibility',
        status: 'Planned',
        voteCount: 29,
        tags: ['keyboard', 'shortcuts', 'navigation', 'a11y'],
        author: sarah._id,
      },
      {
        title: 'Real-time Notifications',
        description:
          'Introduce a real-time notification system so users are instantly alerted when their feedback receives votes, comments, or status changes. WebSocket or Server-Sent Events could be used. Notifications should also be available as a feed with read/unread state and the ability to mark all as read.',
        category: 'Feature Request',
        status: 'Under Review',
        voteCount: 52,
        tags: ['notifications', 'real-time', 'websocket'],
        author: marcus._id,
      },
      {
        title: 'Advanced Search Filters',
        description:
          'Enhance the search functionality with advanced filters including date ranges, author, vote count thresholds, multiple categories, and combined status filters. Saved searches would also be a valuable addition so users can quickly re-run common queries.',
        category: 'Feature Request',
        status: 'In Progress',
        voteCount: 41,
        tags: ['search', 'filters', 'ux'],
        author: adminUser._id,
      },
      {
        title: 'Two-Factor Authentication',
        description:
          'Add two-factor authentication (2FA) support using authenticator apps (TOTP) and/or SMS codes. Account security is a top priority for enterprise customers. The setup flow should be straightforward, and recovery codes should be provided in case of device loss.',
        category: 'Feature Request',
        status: 'Planned',
        voteCount: 33,
        tags: ['security', '2fa', 'auth', 'mfa'],
        author: sarah._id,
      },
      {
        title: 'Mobile App Version',
        description:
          'Develop a native or cross-platform mobile app (iOS and Android) so users can submit feedback, track bug reports, and stay up-to-date on the roadmap while on the go. Push notifications for status changes would make this an especially powerful productivity tool.',
        category: 'Feature Request',
        status: 'Under Review',
        voteCount: 67,
        tags: ['mobile', 'ios', 'android', 'app'],
        author: marcus._id,
      },
      {
        title: 'Custom Dashboard Widgets',
        description:
          'Allow users to customise their dashboard by adding, removing, and rearranging widgets. Widget options should include: recent feedback, trending items, bug statistics, changelog highlights, and a personal activity feed. Layout should be persisted per user account.',
        category: 'UI/UX Improvement',
        status: 'Under Review',
        voteCount: 24,
        tags: ['dashboard', 'widgets', 'customisation', 'ux'],
        author: adminUser._id,
      },
      {
        title: 'Bulk Export Data',
        description:
          'Implement bulk data export in CSV and JSON formats for feedback items, bug reports, and user activity logs. This feature is essential for data analysts and for teams migrating to or from other platforms. Exports should respect current filter settings.',
        category: 'Feature Request',
        status: 'Completed',
        voteCount: 31,
        tags: ['export', 'csv', 'json', 'data'],
        author: sarah._id,
      },
      {
        title: 'Performance Optimization for Large Datasets',
        description:
          'Improve page load times and API response times when dealing with large volumes of feedback and bug reports. Current performance degrades noticeably beyond 500 items. Solutions should include pagination improvements, database indexing, and client-side virtual scrolling.',
        category: 'Performance',
        status: 'In Progress',
        voteCount: 19,
        tags: ['performance', 'optimization', 'database', 'indexing'],
        author: marcus._id,
      },
      {
        title: 'Improved Onboarding Flow',
        description:
          'Redesign the new user onboarding experience with an interactive guided tour, sample data to explore, and a checklist of first steps. New users currently find it hard to discover all the features. A welcome modal with short video clips would help significantly.',
        category: 'UI/UX Improvement',
        status: 'Planned',
        voteCount: 22,
        tags: ['onboarding', 'ux', 'new-users'],
        author: sarah._id,
      },
      {
        title: 'API Rate Limit Dashboard',
        description:
          'Build a developer-facing dashboard that shows current API usage, rate limit thresholds, remaining requests per window, and historical consumption graphs. This is particularly important for teams integrating Backlog with external tools and CI/CD pipelines.',
        category: 'Feature Request',
        status: 'Under Review',
        voteCount: 15,
        tags: ['api', 'rate-limiting', 'developer', 'dashboard'],
        author: adminUser._id,
      },
      {
        title: 'Integration with Slack',
        description:
          'Build a native Slack integration that posts notifications to configurable channels when feedback is submitted, status changes occur, or new bugs are reported. The integration should support per-channel filtering by category or severity, and allow quick voting directly from Slack.',
        category: 'Integration',
        status: 'Planned',
        voteCount: 58,
        tags: ['slack', 'integration', 'notifications', 'workflow'],
        author: marcus._id,
      },
      {
        title: 'Accessibility Audit & Improvements',
        description:
          'Conduct a full WCAG 2.1 AA accessibility audit of the entire application and address all identified issues. This includes proper ARIA labels, focus management, colour contrast ratios, screen reader compatibility, and keyboard-only navigation. A quarterly audit schedule should be established going forward.',
        category: 'Accessibility',
        status: 'Completed',
        voteCount: 44,
        tags: ['accessibility', 'wcag', 'a11y', 'audit'],
        author: adminUser._id,
      },
    ];

    let feedbackCreated = 0;
    const feedbackDocs = [];

    for (const data of feedbackData) {
      const existing = await Feedback.findOne({ title: data.title, isSeeded: true });
      if (existing) {
        console.log(`  ↩  Feedback already exists: "${data.title}"`);
        feedbackDocs.push(existing);
      } else {
        // Build a fake array of ObjectIds representing voters (count = voteCount)
        // We'll use a mix of the three seed users, cycling through them
        const seedUsers = [adminUser._id, sarah._id, marcus._id];
        const voterIds = [];
        for (let i = 0; i < Math.min(data.voteCount, 3); i++) {
          voterIds.push(seedUsers[i % seedUsers.length]);
        }

        const doc = await Feedback.create({
          ...data,
          votes: voterIds,
          voteCount: data.voteCount,
          isSeeded: true,
        });
        console.log(`  ✅ Created feedback: "${data.title}"`);
        feedbackDocs.push(doc);
        feedbackCreated++;
      }
    }

    // ── 3. Bug Reports ────────────────────────────────────────────────────────
    console.log('\n📦 Seeding bug reports...');

    const bugData = [
      {
        title: 'Login page freezes on slow networks',
        description:
          'When accessing the login page on a slow network connection (< 1Mbps), the page becomes unresponsive after entering credentials and clicking "Sign In". The spinner continues indefinitely without timeout or error feedback to the user.',
        severity: 'High',
        status: 'Open',
        reporter: sarah._id,
        stepsToReproduce:
          '1. Throttle network to "Slow 3G" in browser dev tools.\n2. Navigate to /login.\n3. Enter valid credentials.\n4. Click Sign In.\n5. Page freezes — no feedback provided.',
        environment: 'Chrome 119, Windows 11, Slow 3G network simulation',
      },
      {
        title: 'CSV export missing special characters',
        description:
          'When exporting feedback or bug data to CSV, any text containing special characters (accented letters, em-dashes, smart quotes, emoji) appears as garbled or missing characters in the downloaded file. The encoding appears to be ASCII rather than UTF-8.',
        severity: 'Medium',
        status: 'In Progress',
        reporter: marcus._id,
        stepsToReproduce:
          '1. Create a feedback item with "café" or "naïve" in the title.\n2. Go to Export > Download CSV.\n3. Open the CSV in Excel or a text editor.\n4. Observe corrupted characters.',
        environment: 'All browsers, Excel 2019 & 2021, macOS and Windows',
      },
      {
        title: 'Dashboard statistics not refreshing',
        description:
          'The statistics displayed on the main dashboard (total feedback, open bugs, vote counts) do not update after new data is submitted without performing a full page reload. The stale data can mislead users about the current state of the platform.',
        severity: 'High',
        status: 'Open',
        reporter: sarah._id,
        stepsToReproduce:
          '1. Open the dashboard in one browser tab.\n2. In another tab, submit a new feedback item.\n3. Switch back to the dashboard tab.\n4. Statistics remain unchanged until manual page reload.',
        environment: 'Firefox 120, Chrome 119 — both reproduce the issue',
      },
      {
        title: 'Search results not highlighting matched text',
        description:
          'When using the search bar, results are returned correctly but matched search terms are not highlighted within the result text. This makes it harder to quickly scan results and understand why an item matched the query.',
        severity: 'Low',
        status: 'Resolved',
        reporter: marcus._id,
        stepsToReproduce:
          '1. Type any keyword in the search bar.\n2. Review the returned results.\n3. Notice matched terms are not bolded or highlighted.',
        environment: 'All modern browsers',
      },
      {
        title: 'File upload fails for files over 10MB',
        description:
          "Attempting to attach a file larger than 10MB to a bug report results in a generic 500 error from the server. The UI shows no size limit warning before upload and provides no actionable error message after failure. The 10MB limit isn't documented anywhere in the UI.",
        severity: 'High',
        status: 'In Progress',
        reporter: adminUser._id,
        stepsToReproduce:
          '1. Navigate to Submit Bug Report.\n2. Fill in required fields.\n3. Attach a file larger than 10MB (e.g., a screen recording).\n4. Click Submit.\n5. Receive unhelpful 500 error.',
        environment: 'Chrome 119, Safari 17 — confirmed on both',
      },
      {
        title: 'Email notifications sent twice',
        description:
          'Users are receiving duplicate email notifications for certain events — specifically when a feedback item receives a comment and when a bug status changes to "Resolved". This appears to be a race condition in the notification dispatch logic.',
        severity: 'Medium',
        status: 'Open',
        reporter: sarah._id,
        stepsToReproduce:
          '1. Ensure email notifications are enabled in account settings.\n2. Have another user post a comment on your feedback.\n3. Check your inbox — two identical emails arrive within seconds.',
        environment: 'Gmail, Outlook — both receive duplicates',
      },
      {
        title: 'Sort order resets after page refresh',
        description:
          'The selected sort order (e.g., "Most Voted" or "Oldest First") on the feedback list and bug report list is not persisted. After refreshing the page, the sort order always resets to the default "Newest First", requiring the user to reapply their preferred sort.',
        severity: 'Low',
        status: 'Open',
        reporter: marcus._id,
        stepsToReproduce:
          '1. Go to the Feedback list.\n2. Change sort to "Most Voted".\n3. Refresh the page.\n4. Sort resets to "Newest".',
        environment: 'All browsers — state not persisted in URL or localStorage',
      },
      {
        title: 'Admin panel accessible without full page reload',
        description:
          'Under specific navigation conditions, a non-admin user can reach the /admin route by using the browser\'s forward/back history buttons after a role change without re-authenticating. This is a critical security vulnerability that must be patched immediately.',
        severity: 'Critical',
        status: 'Resolved',
        reporter: adminUser._id,
        stepsToReproduce:
          '1. Log in as admin and visit /admin.\n2. Log out.\n3. Log in as a regular user.\n4. Press the browser Back button twice.\n5. /admin route renders without re-validation.',
        environment: 'Chrome 118, Firefox 119 — SPA routing issue',
      },
      {
        title: 'Feedback vote count shows incorrect number',
        description:
          "The vote count displayed on feedback cards in the list view occasionally shows a number that doesn't match the actual count shown on the detail page. The discrepancy appears after voting and navigating back to the list without a full refresh.",
        severity: 'Medium',
        status: 'In Progress',
        reporter: sarah._id,
        stepsToReproduce:
          '1. Go to feedback list — note vote count on a card (e.g., 42).\n2. Click into the feedback detail — count shows 43.\n3. Vote on the item — count becomes 44.\n4. Go back to list — count still shows 42 (stale).',
        environment: 'React frontend — likely a stale state/cache issue',
      },
    ];

    let bugsCreated = 0;
    const bugDocs = [];

    for (const data of bugData) {
      const existing = await BugReport.findOne({ title: data.title, isSeeded: true });
      if (existing) {
        console.log(`  ↩  Bug already exists: "${data.title}"`);
        bugDocs.push(existing);
      } else {
        const doc = await BugReport.create({ ...data, isSeeded: true });
        console.log(`  ✅ Created bug: "${data.title}"`);
        bugDocs.push(doc);
        bugsCreated++;
      }
    }

    // ── 4. Comments ───────────────────────────────────────────────────────────
    console.log('\n📦 Seeding comments...');

    const commentData = [
      // Comments on "Dark Mode Support" (index 0)
      {
        feedbackIndex: 0,
        text: 'This would be a game changer for late-night work sessions. Please prioritise this — my eyes are begging for it!',
        author: marcus._id,
      },
      {
        feedbackIndex: 0,
        text: "Agreed. A system-level preference sync (respecting the OS's dark mode setting) would be the ideal implementation.",
        author: adminUser._id,
      },
      // Comments on "Real-time Notifications" (index 3)
      {
        feedbackIndex: 3,
        text: 'Server-sent events (SSE) might be a lighter-weight alternative to WebSockets for one-directional notifications. Worth considering the infrastructure cost.',
        author: sarah._id,
      },
      {
        feedbackIndex: 3,
        text: "We've started scoping this. The main challenge is scaling SSE connections across multiple server instances. Will update once we have an architecture proposal.",
        author: adminUser._id,
      },
      // Comments on "Mobile App Version" (index 6)
      {
        feedbackIndex: 6,
        text: 'A progressive web app (PWA) might be a faster path to mobile support without needing to maintain separate native codebases. Any chance that\'s on the table?',
        author: marcus._id,
      },
      {
        feedbackIndex: 6,
        text: 'PWA is absolutely on the table. We\'re evaluating React Native vs PWA currently and will share our decision here.',
        author: adminUser._id,
      },
      // Comments on "Integration with Slack" (index 12)
      {
        feedbackIndex: 12,
        text: 'A Microsoft Teams integration would be equally valuable for enterprise users. Any chance both could be in scope?',
        author: sarah._id,
      },
      {
        feedbackIndex: 12,
        text: "Teams integration is logged as a follow-up item. We're starting with Slack as it has the broadest user base in our current customer set.",
        author: adminUser._id,
      },
      // Comments on "Export Reports to PDF" (index 1)
      {
        feedbackIndex: 1,
        text: 'Would it also be possible to schedule automatic PDF reports to be emailed weekly? That would be incredibly useful for management updates.',
        author: sarah._id,
      },
      // Comments on "Advanced Search Filters" (index 4)
      {
        feedbackIndex: 4,
        text: "Saved searches are the most important part of this for me. I run the same query every Monday morning — it would save me so much time.",
        author: marcus._id,
      },
      // Comments on "Two-Factor Authentication" (index 5)
      {
        feedbackIndex: 5,
        text: 'Please also support hardware security keys (FIDO2/WebAuthn). TOTP is good but physical keys are the gold standard for high-security environments.',
        author: sarah._id,
      },
      // Comments on "Performance Optimization" (index 9)
      {
        feedbackIndex: 9,
        text: 'Cursor-based pagination would be a significant improvement over the current offset-based approach for large datasets. Much more efficient at scale.',
        author: marcus._id,
      },
    ];

    let commentsCreated = 0;

    for (const data of commentData) {
      const targetFeedback = feedbackDocs[data.feedbackIndex];
      if (!targetFeedback) continue;

      const existing = await Comment.findOne({
        feedback: targetFeedback._id,
        author: data.author,
        text: data.text,
      });

      if (existing) {
        console.log(`  ↩  Comment already exists on "${targetFeedback.title}"`);
      } else {
        await Comment.create({
          feedback: targetFeedback._id,
          text: data.text,
          author: data.author,
        });
        console.log(`  ✅ Created comment on "${targetFeedback.title}"`);
        commentsCreated++;
      }
    }

    // ── 5. Changelog ──────────────────────────────────────────────────────────
    console.log('\n📦 Seeding changelog...');

    const changelogData = [
      {
        version: 'v2.3.0',
        title: 'Enhanced Analytics Dashboard',
        summary: 'A completely redesigned analytics dashboard with interactive charts, custom date ranges, and exportable reports.',
        details: `## What's New in v2.3.0

### Enhanced Analytics Dashboard
We've completely rebuilt the analytics dashboard from the ground up with a focus on clarity, interactivity, and actionability.

**New Features:**
- Interactive bar and line charts for feedback trends over time
- Custom date range picker (day, week, month, quarter, year, custom)
- Drill-down capability on chart segments
- Side-by-side comparison of feedback vs bug report volumes
- Exportable charts as PNG and data as CSV

**Improvements:**
- Dashboard now loads 3× faster due to server-side aggregation optimisations
- Charts are fully accessible with keyboard navigation and screen reader labels
- Responsive layout that works beautifully on tablets

**Bug Fixes:**
- Fixed an edge case where vote counts could appear negative after bulk data imports
- Resolved a layout issue on dashboards with more than 8 active widgets`,
        releaseDate: new Date('2026-10-01'),
        category: 'Feature',
        author: adminUser._id,
      },
      {
        version: 'v2.2.5',
        title: 'Performance & Security Patches',
        summary: 'Critical security patches and performance improvements addressing vulnerabilities discovered during our Q3 audit.',
        details: `## What's New in v2.2.5

### Security Patches
This release addresses several security vulnerabilities identified during our quarterly security audit.

**Critical Fixes:**
- Patched a route-guard bypass that could allow non-admin users to access the admin panel under specific navigation conditions
- Strengthened JWT validation to reject tokens with unexpected claims
- Implemented stricter Content Security Policy headers

**Performance Improvements:**
- Database query optimisation reduced average API response time by 28%
- Added compound indexes on frequently queried field combinations
- Implemented response caching for the public roadmap endpoint (60s TTL)

**Dependency Updates:**
- Updated all dependencies to their latest secure versions
- Removed two unused dependencies that were flagged in the audit`,
        releaseDate: new Date('2026-09-10'),
        category: 'Security',
        author: adminUser._id,
      },
      {
        version: 'v2.2.0',
        title: 'Bulk Actions & Export Features',
        summary: 'Long-requested bulk actions for feedback management and comprehensive data export in CSV and JSON formats.',
        details: `## What's New in v2.2.0

### Bulk Actions
Admins can now perform actions on multiple feedback items and bug reports simultaneously.

**New Capabilities:**
- Select multiple items using checkboxes or "Select All"
- Bulk status update (move multiple items to the same status at once)
- Bulk delete with confirmation dialog
- Bulk tag assignment

### Data Export
- Export feedback list to CSV (respects current filters and search)
- Export bug reports to CSV or JSON
- Export includes all fields: title, description, category, status, vote count, author, timestamps
- UTF-8 encoding ensured for international character support

**UI Improvements:**
- New floating action bar appears when items are selected
- Keyboard shortcut (Ctrl+A) to select all visible items`,
        releaseDate: new Date('2026-08-15'),
        category: 'Feature',
        author: adminUser._id,
      },
      {
        version: 'v2.1.0',
        title: 'Accessibility Improvements',
        summary: 'Comprehensive WCAG 2.1 AA compliance improvements including full keyboard navigation, improved colour contrast, and screen reader support.',
        details: `## What's New in v2.1.0

### Accessibility Overhaul
Following a comprehensive WCAG 2.1 AA audit, this release delivers significant improvements across the entire application.

**Keyboard Navigation:**
- Full keyboard navigation implemented throughout the app
- Logical tab order established on all pages
- Focus trapping in modals and dropdowns
- Keyboard shortcut reference modal (press ? anywhere)

**Screen Reader Support:**
- Proper ARIA labels added to all interactive elements
- Live regions implemented for dynamic content updates
- Meaningful alt text added to all images and icons

**Visual Improvements:**
- Colour contrast ratios now meet or exceed 4.5:1 on all text
- Focus indicators are clearly visible with high-contrast outlines
- Error messages are associated with their form fields via aria-describedby

**Forms:**
- All form inputs have associated labels
- Validation errors are announced to screen readers immediately`,
        releaseDate: new Date('2026-07-22'),
        category: 'Improvement',
        author: adminUser._id,
      },
      {
        version: 'v2.0.0',
        title: 'Major UI Redesign',
        summary: 'A complete visual overhaul with a modern design system, improved information architecture, and a redesigned navigation experience.',
        details: `## What's New in v2.0.0

### Major UI Redesign
Version 2.0 marks the most significant visual update in Backlog's history. Every screen has been thoughtfully redesigned.

**New Design System:**
- Consistent colour palette with semantic colour tokens
- New typography scale for improved readability
- Redesigned component library (buttons, cards, forms, tables, modals)
- Support for both light and dark mode (system preference respected)

**Navigation:**
- Collapsible sidebar navigation replacing the previous top-bar
- Breadcrumb navigation for deep pages
- Quick-access command palette (Ctrl+K) to jump anywhere

**Information Architecture:**
- Feedback, Bugs, Changelog, and Roadmap now have dedicated top-level sections
- Dashboard consolidates the most important metrics on a single screen
- Improved search with category and status filters inline

**Breaking Changes:**
- Browser local storage keys have changed — users will be logged out once on upgrade
- Custom integrations using the v1 UI embed codes will need to be updated`,
        releaseDate: new Date('2026-06-05'),
        category: 'Breaking Change',
        author: adminUser._id,
      },
      {
        version: 'v1.9.0',
        title: 'API Rate Limiting & Developer Tools',
        summary: 'Introduction of API rate limiting to ensure platform stability, alongside a new developer tools section for integration management.',
        details: `## What's New in v1.9.0

### API Rate Limiting
To ensure a fair and stable experience for all users, we have implemented rate limiting on all API endpoints.

**Limits:**
- Authentication endpoints: 15 requests per 15-minute window
- General API endpoints: 100 requests per minute per IP
- Admin endpoints: 60 requests per minute per authenticated user

**Rate Limit Headers:**
All API responses now include standard rate limit headers:
- X-RateLimit-Limit
- X-RateLimit-Remaining
- X-RateLimit-Reset

### Developer Tools
- New "Developer" section in account settings
- API key management (generate, view, revoke keys)
- Request log showing recent API calls with response codes and latencies
- Link to the API documentation

**Improvements:**
- API error messages are now more descriptive and include error codes
- CORS configuration updated to support additional trusted origins`,
        releaseDate: new Date('2026-05-14'),
        category: 'Feature',
        author: adminUser._id,
      },
    ];

    let changelogsCreated = 0;

    for (const data of changelogData) {
      const existing = await Changelog.findOne({ version: data.version, isSeeded: true });
      if (existing) {
        console.log(`  ↩  Changelog already exists: ${data.version}`);
      } else {
        await Changelog.create({ ...data, isSeeded: true });
        console.log(`  ✅ Created changelog: ${data.version} — ${data.title}`);
        changelogsCreated++;
      }
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌱 Seed complete! Summary:');
    console.log(`   Users:       3 configured (existing preserved)`);
    console.log(`   Feedback:    ${feedbackCreated} created / ${feedbackData.length - feedbackCreated} already existed`);
    console.log(`   Bugs:        ${bugsCreated} created / ${bugData.length - bugsCreated} already existed`);
    console.log(`   Comments:    ${commentsCreated} created`);
    console.log(`   Changelog:   ${changelogsCreated} created / ${changelogData.length - changelogsCreated} already existed`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔑 Demo credentials:');
    console.log('   Admin:  admin@backlog.dev   / Admin@1234');
    console.log('   User 1: sarah@example.com   / User@1234');
    console.log('   User 2: marcus@example.com  / User@1234\n');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB. Seed finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    if (error.message.includes('ECONNREFUSED') || error.message.includes('127.0.0.1:27017')) {
      console.log('\n💡 Tip: MongoDB Community Server is not running on 127.0.0.1:27017.');
      console.log('   Please start MongoDB first (e.g., net start MongoDB) before running the seed script.\n');
    }
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

seed();
