# SecureBank
## Product Requirements Document

**Product:** SecureBank Security Lab Platform  
**Purpose:** National Application Security Conference — Sandbox  
**Owner:** Petaverse Ltd  
**Version:** 1.0  
**Status:** Product Definition  
**Classification:** Internal / Controlled Training Platform

---

# 1. Product Overview

SecureBank is an intentionally vulnerable, fully isolated digital banking application designed specifically for hands-on Application Security training at the National Application Security Conference.

SecureBank simulates a modern Nigerian digital bank and its software ecosystem.

Unlike conventional vulnerable applications containing unrelated security flaws, SecureBank presents participants with a realistic interconnected environment containing:

1. Web Application Lab
2. API Security Lab
3. AI Security Lab
4. DevSecOps Lab
5. Software Supply Chain Lab

All five environments represent different components of the same fictional organisation.

Participants interact with SecureBank as developers, security engineers, DevSecOps engineers, penetration testers, incident responders, and security architects.

The objective is not simply to "find flags."

Participants should understand:

**What is vulnerable → Why it is vulnerable → How it can be abused → What the impact is → How to fix it → How to prevent recurrence.**

---

# 2. Product Vision

To create Africa's most realistic conference-based secure software engineering laboratory where participants can safely build, break, investigate, defend, and remediate a modern software ecosystem.

---

# 3. Product Mission

SecureBank will provide realistic, isolated, scenario-driven security exercises covering the complete modern software lifecycle:

**Design → Code → API → AI → Build → Dependency → Deploy → Attack → Detect → Fix → Verify**

---

# 4. Product Principles

SecureBank must be:

### Realistic

The application should behave like a believable digital banking product.

### Intentionally Vulnerable

Security weaknesses are deliberate, documented, controlled, and confined to the lab.

### Isolated

Participants must not be able to use the environment to attack external systems or other participants.

### Disposable

Lab environments should be capable of being reset or destroyed.

### Reproducible

Infrastructure and scenarios should be reproducible through automation.

### Educational

Every vulnerability must have a defined learning objective.

### Observable

Participant activity and application behaviour should generate useful telemetry.

### Fixable

Where the exercise requires remediation, participants should be able to modify code/configuration and verify their fix.

### Gamified

Challenges should provide progression, scoring, achievements, and feedback.

### Safe by Design

No real banking data, real credentials, real financial systems, or uncontrolled offensive infrastructure shall be used.

---

# 5. Target Users

SecureBank is designed for:

- Application Security Engineers
- Software Engineers
- Developers
- DevSecOps Engineers
- DevOps Engineers
- Cloud Engineers
- Penetration Testers
- Red Teamers
- Security Researchers
- Security Architects
- AI Security Engineers
- API Security Professionals
- Students
- Early-career security professionals

---

# 6. SecureBank Business Scenario

SecureBank is a fictional Nigerian digital-first financial institution.

It provides:

- Customer onboarding
- Account management
- Wallets
- Transfers
- Beneficiary management
- Transaction history
- Bill payments
- Customer support
- Administrative operations
- AI-powered customer assistance

Its engineering organisation uses:

- Web applications
- REST APIs
- Optional GraphQL APIs
- Containers
- CI/CD
- Infrastructure as Code
- Open-source dependencies
- Artifact registries
- SBOM generation
- AI/LLM services
- RAG
- Internal service APIs

This provides the attack surface required for the five labs.

---

# 7. Core Application Architecture

```text
                        SECUREBANK
                            │
                ┌───────────┴───────────┐
                │                       │
         Customer Web App          Admin Portal
                │                       │
                └───────────┬───────────┘
                            │
                       API Gateway
                            │
       ┌────────────┬───────┼────────┬────────────┐
       │            │       │        │            │
     Auth        Accounts Transfers Payments    Support
       │            │       │        │            │
       └────────────┴───────┼────────┴────────────┘
                            │
                       Data Layer
                            │
                  ┌─────────┴─────────┐
                  │                   │
             AI Assistant        Audit/Logging
                  │
            RAG + Tool Layer
                  
                            ▲
                            │
                     Application Build
                            │
                       CI/CD Pipeline
                            │
                 Security / Quality Gates
                            │
                     Artifact Registry
                            │
                   Deployment Environment
                            ▲
                            │
                 Dependencies / Packages
                            │
                       Supply Chain
```

---

# 8. Core User Roles

SecureBank shall contain fictional roles including:

### Customer

Standard banking user.

Can:

- View own accounts.
- View balance.
- Manage beneficiaries.
- Transfer funds.
- View transaction history.
- Use customer support.
- Interact with SecureBank AI.

### Support Agent

Can:

- Search customers.
- View limited customer information.
- Manage support cases.
- Use internal support tools.

### Operations User

Can perform approved operational functions.

### Developer

Has access to development repositories and CI/CD environments relevant to exercises.

### DevOps Engineer

Manages pipelines, deployments, infrastructure, and artifacts.

### Security Engineer

Reviews security findings and telemetry.

### Administrator

Has privileged application functions.

### Lab Facilitator

Controls participant exercises.

### Sandbox Administrator

Controls lab infrastructure, resets, monitoring, scoring, and emergency shutdown.

---

# 9. Core Banking Features

The application shall implement enough functionality to make the environment believable.

## Authentication

- Registration
- Login
- Logout
- Password reset
- Session handling
- Role handling
- Optional MFA simulation

## Customer Profile

- Personal details
- Contact details
- Security settings
- Account preferences

All information must be synthetic.

## Accounts

- Account numbers
- Account type
- Balance
- Account status

## Beneficiaries

- Add beneficiary
- Remove beneficiary
- List beneficiaries
- Transfer to beneficiary

## Transfers

- Internal transfer
- External simulated transfer
- Transfer confirmation
- Transfer history
- Transaction reference

No real payment infrastructure shall be connected.

## Transactions

- Transaction history
- Search
- Filtering
- Transaction details

## Support

- Create ticket
- View tickets
- Support messaging

## Administration

- Customer management
- Account status
- Support operations
- System configuration relevant to challenges

---

# 10. Lab 1 — Web Application Security

## Purpose

Teach participants how vulnerabilities emerge in modern web applications and how to identify, understand, and remediate them.

## Challenge Families

The application may contain controlled examples of:

- Authentication weaknesses
- Authorization weaknesses
- Session-management weaknesses
- Cross-Site Scripting
- Injection
- CSRF where relevant
- File-handling vulnerabilities
- Security misconfiguration
- Information disclosure
- Business-logic vulnerabilities
- Server-side request handling weaknesses
- Unsafe redirects
- Insufficient validation

## Example Scenario

A participant receives access as a normal SecureBank customer.

Their objective may be to determine whether security boundaries prevent them from accessing functions or information outside their assigned privileges.

Advanced exercises can require remediation and verification.

---

# 11. Lab 2 — API Security

## Purpose

Demonstrate how authorization, authentication, data exposure, resource consumption, and business-logic weaknesses affect modern APIs.

## API Domains

Examples:

`/auth`

`/users`

`/accounts`

`/beneficiaries`

`/transfers`

`/transactions`

`/support`

`/admin`

## Challenge Families

Scenarios may cover:

- Broken Object Level Authorization
- Broken Function Level Authorization
- Broken authentication
- Object property authorization weaknesses
- Unrestricted resource consumption
- Sensitive business-flow abuse
- Security misconfiguration
- API inventory problems
- Unsafe third-party API consumption
- Excessive data exposure
- Mass assignment
- Rate-limit weaknesses

## Learning Flow

**Discover → Test → Demonstrate Impact → Explain Root Cause → Remediate → Retest**

---

# 12. Lab 3 — AI Security

## Purpose

Teach participants to evaluate security boundaries around LLM-powered applications.

## SecureBank AI

SecureBank provides an AI-powered assistant capable of:

- Answering product questions.
- Explaining synthetic transactions.
- Searching approved knowledge.
- Assisting support personnel.
- Calling restricted tools under controlled conditions.

## Architecture

```text
User
 │
 ▼
SecureBank AI
 │
 ├── System Instructions
 │
 ├── RAG
 │
 ├── Knowledge Base
 │
 └── Tool Gateway
          │
          ├── Account Lookup
          ├── Transaction Lookup
          ├── Support Case
          └── Restricted Banking Actions
```

## Challenge Families

Controlled scenarios may cover:

- Direct prompt injection
- Indirect prompt injection
- Sensitive information disclosure
- Excessive agency
- Improper output handling
- Insecure tool invocation
- Authorization failures around AI tools
- RAG poisoning scenarios
- Trust-boundary failures
- System instruction leakage
- Cross-user information exposure

The objective is not simply to manipulate a chatbot.

Participants must understand the security architecture surrounding AI systems.

---

# 13. Lab 4 — DevSecOps

## Purpose

Teach participants how software can become vulnerable through its development and deployment pipeline even when individual application features appear secure.

## Environment

Participants interact with a controlled:

- Source repository
- Build pipeline
- CI/CD workflow
- Container build
- Security scanners
- Infrastructure configuration
- Deployment environment

## Challenge Families

- Secrets committed to repositories
- Weak pipeline permissions
- Unsafe CI/CD configuration
- Missing branch protections
- Vulnerable dependencies
- Container misconfiguration
- Excessive container privileges
- Weak security gates
- IaC security weaknesses
- Artifact handling problems
- Insecure environment variables
- Improper secret management

## Remediation Experience

Participants should be able to:

1. Identify the pipeline weakness.
2. Understand its impact.
3. Modify code/configuration.
4. Trigger a new pipeline.
5. Pass security controls.
6. Deploy the corrected application.

---

# 14. Lab 5 — Software Supply Chain

## Purpose

Teach participants how trusted software can become compromised before it reaches production.

## Scenario

SecureBank discovers suspicious behaviour in a trusted application release.

Participants investigate:

**Source → Dependency → Build → Artifact → Registry → Deployment**

## Components

- Source repository
- Dependency manifest
- Package source
- Build system
- SBOM
- Artifact registry
- Signing/provenance information
- Deployment manifest
- Logs

## Challenge Families

- Dependency confusion simulation
- Malicious package simulation
- Vulnerable transitive dependency
- Dependency tampering
- Build-environment compromise
- Artifact tampering
- Missing provenance
- Missing signature verification
- Inadequate SBOM visibility
- Overprivileged build process

Everything must remain contained within the lab environment.

---

# 15. Cross-Lab Story

The five labs should not operate as unrelated challenges.

A common narrative connects them.

Example:

> SecureBank is preparing for a major product release. Security Engineering has been asked to assess the platform before launch. During testing, the team discovers weaknesses across the application, APIs, AI assistant and delivery pipeline. Evidence eventually suggests that the software supply chain itself may also have been compromised.

Participants progressively discover the wider problem.

This creates a conference-wide technical story.

---

# 16. Challenge Difficulty

Every lab should support three primary difficulty levels.

## Level 1 — Explorer

Target:

Students and beginners.

Focus:

- Discovery
- Basic exploitation
- Understanding root cause

## Level 2 — Engineer

Target:

Developers and security practitioners.

Focus:

- Exploitation
- Impact
- Remediation
- Verification

## Level 3 — Specialist

Target:

Experienced AppSec and security professionals.

Focus:

- Chained vulnerabilities
- Business logic
- Architecture
- Detection
- Complex remediation

Optional hidden challenges can target advanced participants.

---

# 17. Challenge Structure

Every challenge must contain:

- Challenge ID
- Title
- Lab
- Difficulty
- Scenario
- Objective
- Learning objective
- Prerequisites
- Starting state
- Expected security boundary
- Intended weakness
- Validation mechanism
- Score
- Hint structure
- Remediation requirement
- Reset procedure
- Facilitator notes
- Safety classification

---

# 18. Gamification

SecureBank should award points based on more than exploitation.

Example:

| Activity | Example Points |
|---|---:|
| Vulnerability discovered | 100 |
| Impact demonstrated | 100 |
| Root cause identified | 150 |
| Correct remediation | 250 |
| Verification passed | 150 |
| Detection/evidence produced | 100 |
| Hidden challenge | 300+ |

This reinforces the conference philosophy:

**Breaking software is only half the exercise. Securing it matters more.**

---

# 19. Achievement System

Potential achievements include:

- First Blood
- Access Controller
- API Hunter
- Secure Coder
- Pipeline Defender
- AI Red Teamer
- Supply Chain Investigator
- Threat Hunter
- Remediation Master
- SecureBank Defender

---

# 20. Participant Interface

The participant should see:

### Dashboard

- Available labs
- Current challenges
- Progress
- Score
- Achievements
- Leaderboard

### Lab View

- Scenario
- Objective
- Environment access
- Challenge status
- Hints
- Submission
- Reset
- Learning resources

### Results

- Findings
- Completed objectives
- Score
- Remediation status
- Learning outcomes

---

# 21. Facilitator Interface

Facilitators require:

- Participant/team view
- Lab status
- Challenge status
- Hint management
- Reset capability
- Validation status
- Scoring override with audit trail
- Incident escalation
- Participant assistance tools

---

# 22. Administration Interface

Administrators require:

- Lab enable/disable
- Environment provisioning
- Environment termination
- User/team management
- Challenge management
- Scoring management
- Infrastructure health
- Capacity monitoring
- Audit logs
- Emergency kill switch
- Exportable results

---

# 23. Safety Architecture

SecureBank is an intentionally vulnerable system.

Therefore, safety is a first-class product requirement.

Mandatory controls include:

- No production systems.
- No real banking integration.
- Synthetic data only.
- No real customer information.
- Isolated participant environments.
- Restricted network egress.
- Strong administrative authentication.
- Network segmentation.
- Resource quotas.
- Rate controls.
- Audit logging.
- Environment expiration.
- Automatic teardown.
- Emergency shutdown.
- Defined acceptable-use rules.

---

# 24. Infrastructure Model

The preferred model is containerised, reproducible infrastructure.

Potential components:

- Docker
- Kubernetes or equivalent orchestration
- Infrastructure as Code
- Isolated namespaces/environments
- Controlled ingress
- Restricted egress
- Central logging
- Metrics
- Scoring service
- Lab orchestrator
- Synthetic databases

Technology selection remains an engineering decision rather than a fixed PRD requirement.

---

# 25. Environment Lifecycle

```text
Participant selects lab
        ↓
Request environment
        ↓
Identity/authorization check
        ↓
Provision isolated environment
        ↓
Seed synthetic data
        ↓
Assign temporary credentials
        ↓
Participant performs exercise
        ↓
Telemetry + scoring
        ↓
Complete / timeout
        ↓
Capture results
        ↓
Destroy environment
```

---

# 26. Observability

The platform must provide:

- Application logs
- Infrastructure logs
- Authentication logs
- API logs
- Lab health
- Provisioning metrics
- Resource utilisation
- Errors
- Reset activity
- Administrative actions

Security telemetry may itself become part of selected exercises.

---

# 27. Conference Capacity

Architecture should support incremental scaling.

Initial load-test targets should model:

- 50 concurrent users
- 100 concurrent users
- 250 concurrent users
- 500 concurrent users

The actual conference capacity shall be determined after infrastructure testing and venue/network validation.

---

# 28. Non-Functional Requirements

### Availability

The Sandbox must remain available throughout scheduled lab periods.

### Performance

Participant actions should receive responsive feedback under expected conference load.

### Isolation

Participants must not be able to interfere with other participant environments.

### Recoverability

Failed environments must be replaceable rapidly.

### Observability

Operations personnel must have real-time visibility.

### Reproducibility

Infrastructure and lab deployment must be automated.

### Maintainability

Challenges must be independently versionable.

### Portability

The platform should avoid unnecessary dependence on a single conference venue or infrastructure provider.

---

# 29. Out of Scope

Version 1 shall not:

- Connect to real banking systems.
- Process real payments.
- Store real customer information.
- Provide unrestricted attack infrastructure.
- Permit attacks against public targets.
- Replicate complete core banking infrastructure.
- Attempt to reproduce every AppSec vulnerability category.

---

# 30. Success Metrics

SecureBank succeeds when:

- Participants can independently launch labs.
- Environments provision reliably.
- Isolation survives adversarial testing.
- Labs can be reset rapidly.
- Challenges accurately validate completion.
- Beginners and advanced practitioners both find appropriate challenges.
- Participants learn both exploitation and remediation.
- Facilitators can operate the platform without engineering intervention for routine tasks.
- Conference operations can monitor the environment centrally.
- No lab traffic causes harm outside the authorised environment.
- SecureBank can be reused and expanded for future AppSec editions.

---

# 31. Long-Term Product Direction

SecureBank should become reusable Petaverse conference intellectual property.

Future versions may add:

- Mobile Security Lab
- Cloud Security Lab
- Kubernetes Security Lab
- Identity Lab
- Detection Engineering Lab
- Digital Forensics Lab
- Threat Modeling Lab
- Secure Architecture Lab
- Purple Team exercises
- Multi-team attack/defence exercises

SecureBank may ultimately support year-round training, university programmes, AppSec community events, competitions and future conference editions.

---

# 32. Definition of Done — V1

SecureBank V1 is conference-ready when:

- Core banking workflow functions.
- Five labs operate.
- Required challenges are implemented.
- Difficulty levels are represented.
- Participant portal operates.
- Facilitator controls operate.
- Admin controls operate.
- Scoring operates.
- Reset operates.
- Provisioning is automated.
- Synthetic data generation works.
- Isolation testing passes.
- Security testing passes.
- Load testing passes the approved conference target.
- Monitoring operates.
- Emergency shutdown works.
- Facilitator documentation is complete.
- Conference-day runbook is complete.
- Full dress rehearsal succeeds.