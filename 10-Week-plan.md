# SecureBank
## 10-Week Production Engineering & Trello Plan

**Owner:** Petaverse Ltd  
**Target:** Conference-Ready SecureBank V1  
**Duration:** 10 Weeks

---

# DELIVERY STRATEGY

The ten weeks are divided into five two-week engineering sprints.

### Sprint 1 — SecureBank Foundation
Weeks 1–2

### Sprint 2 — Application & API Security
Weeks 3–4

### Sprint 3 — AI & DevSecOps Security
Weeks 5–6

### Sprint 4 — Supply Chain & Gamification
Weeks 7–8

### Sprint 5 — Infrastructure Hardening & Conference Readiness
Weeks 9–10

---

# WEEK 1 — ARCHITECTURE & CORE PLATFORM

## Objective

Establish the SecureBank architecture, repositories, development environment and core banking foundation.

### SB-001 — Finalise System Architecture

**Deliverables**

- Application architecture
- Service boundaries
- Trust boundaries
- Data flows
- User roles
- Lab boundaries
- Threat model

**Acceptance Criteria**

Architecture is documented and reviewed before vulnerability implementation.

---

### SB-002 — Establish Repository Structure

Create repositories/modules for:

- Web
- API
- AI
- DevSecOps
- Supply Chain
- Sandbox Platform
- Infrastructure
- Documentation

Implement:

- Branching strategy
- Pull-request workflow
- Issue templates
- CODEOWNERS
- Development standards

---

### SB-003 — Dockerised Development Environment

Develop:

`docker compose up`

to launch the local core environment.

Include:

- Web
- API
- Database
- Supporting services

---

### SB-004 — Synthetic Banking Data Model

Implement:

- Users
- Roles
- Accounts
- Beneficiaries
- Transactions
- Transfers
- Support tickets
- Audit events

No real data.

---

### SB-005 — Authentication Foundation

Implement:

- Registration
- Login
- Logout
- Sessions/tokens
- Password reset
- Role model

Start from a secure baseline.

Intentional weaknesses must be introduced explicitly as challenges rather than accidental engineering defects.

---

### SB-006 — Core Threat Model

Threat model:

- Web
- APIs
- Identity
- AI
- CI/CD
- Supply chain
- Sandbox infrastructure

Document:

- Assets
- Actors
- Trust boundaries
- Threats
- Controls
- Intentional vulnerabilities

---

### WEEK 1 EXIT

A developer can launch SecureBank locally, authenticate, and access the initial banking application.

---

# WEEK 2 — BANKING WORKFLOWS & LAB FRAMEWORK

### SB-007 — Customer Dashboard

Implement:

- Balance
- Accounts
- Recent transactions
- Profile
- Navigation

---

### SB-008 — Beneficiary Management

Implement:

- Create
- List
- View
- Delete

---

### SB-009 — Transfers

Implement simulated:

- Internal transfers
- Beneficiary transfers
- Confirmation
- Transaction reference
- Transaction records

---

### SB-010 — Transaction History

Implement:

- Listing
- Details
- Filtering
- Search

---

### SB-011 — Support System

Implement:

- Support tickets
- Messaging
- Support-agent interface

---

### SB-012 — Challenge Framework

Define challenge schema:

- ID
- Lab
- Scenario
- Difficulty
- Objective
- Validation
- Points
- Hints
- Remediation
- Reset

---

### SB-013 — Vulnerability Feature Flags

Build a mechanism allowing controlled challenge states.

Examples:

- Vulnerable
- Patched
- Reset

This prevents intentional weaknesses from becoming uncontrolled application behaviour.

---

### WEEK 2 EXIT

SecureBank operates as a believable fictional banking application and is ready to become the foundation for security challenges.

---

# WEEK 3 — WEB APPLICATION SECURITY LAB

### SB-014 — Web Lab Architecture

Define the complete Web Security challenge catalogue.

---

### SB-015 — Access Control Challenges

Implement controlled scenarios involving:

- Object ownership
- Role boundaries
- Privileged functions

---

### SB-016 — Authentication & Session Challenges

Implement selected:

- Authentication weaknesses
- Session weaknesses
- Password reset weaknesses

---

### SB-017 — Input Handling Challenges

Implement selected controlled:

- Injection
- XSS
- Unsafe input processing
- File-handling weaknesses

---

### SB-018 — Business Logic Challenges

Implement realistic banking-flow weaknesses.

Focus on:

- Workflow assumptions
- Transaction state
- Authorization sequencing
- Business rules

---

### SB-019 — Remediation Mode

Allow selected challenges to move from:

**Exploit → Fix → Test**

---

### SB-020 — Web Lab Validation

Implement automated validation for challenge completion.

---

### WEEK 3 EXIT

Web App Lab is playable from beginning to end.

---

# WEEK 4 — API SECURITY LAB

### SB-021 — API Inventory

Implement/document:

- Authentication API
- User API
- Account API
- Beneficiary API
- Transfer API
- Transaction API
- Support API
- Admin API

---

### SB-022 — BOLA Scenarios

Develop controlled object-authorization challenges.

---

### SB-023 — BFLA Scenarios

Develop controlled function-authorization challenges.

---

### SB-024 — Authentication Scenarios

Develop API authentication challenges.

---

### SB-025 — Property-Level Authorization

Create controlled object-property and mass-assignment scenarios.

---

### SB-026 — Resource Consumption

Implement safe rate/resource-limit exercises.

---

### SB-027 — Business Flow Abuse

Implement a realistic banking workflow abuse scenario.

---

### SB-028 — API Documentation

Provide participants with appropriate:

- API specification
- Documentation
- Authentication workflow
- Lab guidance

---

### SB-029 — API Challenge Validation

Automate scoring and validation.

---

### WEEK 4 EXIT

API Lab supports realistic API-security testing across multiple difficulty levels.

---

# WEEK 5 — AI SECURITY LAB

### SB-030 — SecureBank AI Assistant

Build the fictional banking assistant.

---

### SB-031 — RAG Environment

Create synthetic knowledge sources covering:

- Products
- FAQs
- Support material
- Internal synthetic documents

---

### SB-032 — Tool Gateway

Build controlled tools for:

- Account lookup
- Transaction lookup
- Support actions
- Restricted simulated actions

---

### SB-033 — Prompt Injection Challenges

Implement direct prompt-injection exercises.

---

### SB-034 — Indirect Injection Challenges

Implement contained indirect prompt-injection scenarios.

---

### SB-035 — Data Exposure Challenge

Create synthetic information-disclosure exercises.

---

### SB-036 — Excessive Agency Challenge

Build controlled tool/permission scenarios.

---

### SB-037 — AI Authorization Challenge

Test whether the model/tool architecture properly respects user authorization boundaries.

---

### SB-038 — AI Lab Guardrails

Ensure challenges cannot reach real external systems or sensitive resources.

---

### WEEK 5 EXIT

Participants can attack and assess a realistic AI-enabled banking workflow without leaving the controlled environment.

---

# WEEK 6 — DEVSECOPS LAB

### SB-039 — Training Repository

Create intentionally flawed training branches/configurations.

---

### SB-040 — CI/CD Environment

Build a contained pipeline supporting:

**Commit → Build → Test → Security → Package → Deploy**

---

### SB-041 — SAST Integration

Introduce and detect selected code-security issues.

---

### SB-042 — SCA Integration

Introduce controlled vulnerable dependency scenarios.

---

### SB-043 — Secret Scanning

Introduce synthetic credentials and detection/remediation exercises.

Never use real credentials.

---

### SB-044 — Container Security

Introduce controlled Docker/container configuration issues.

---

### SB-045 — IaC Security

Create infrastructure configuration exercises.

---

### SB-046 — Security Gates

Participants must correct failures before successful deployment.

---

### SB-047 — Pipeline Remediation Challenge

Required journey:

**Find → Understand → Fix → Commit → Pipeline → Verify → Deploy**

---

### WEEK 6 EXIT

A participant can repair SecureBank's delivery pipeline and produce a successful secure build.

---

# WEEK 7 — SOFTWARE SUPPLY CHAIN LAB

### SB-048 — Supply Chain Architecture

Model:

**Developer → Repository → Dependencies → Build → Artifact → Registry → Deployment**

---

### SB-049 — Private Training Package Registry

Build a contained package ecosystem for exercises.

---

### SB-050 — Dependency Challenge

Introduce controlled dependency-resolution/tampering scenarios.

---

### SB-051 — Transitive Dependency Challenge

Create a dependency tree containing a security issue requiring investigation.

---

### SB-052 — SBOM

Generate SBOMs for SecureBank releases.

---

### SB-053 — Artifact Integrity

Implement:

- Hashes
- Signing simulation
- Verification

---

### SB-054 — Provenance Challenge

Create missing/invalid provenance exercises.

---

### SB-055 — Incident Investigation Scenario

Present participants with:

> A trusted SecureBank release is behaving suspiciously. Determine what happened.

---

### SB-056 — Supply Chain Remediation

Require participants to identify the compromised stage and restore the trusted release path.

---

### WEEK 7 EXIT

The complete SecureBank lifecycle can now be investigated from source to deployed artifact.

---

# WEEK 8 — SANDBOX PORTAL, SCORING & GAMIFICATION

### SB-057 — Participant Dashboard

Implement:

- Labs
- Challenges
- Progress
- Score
- Achievements

---

### SB-058 — Lab Launcher

Participant selects:

**Launch Environment**

System provisions their assigned environment.

---

### SB-059 — Team Support

Implement:

- Individual mode
- Team mode
- Team membership
- Team scoring

---

### SB-060 — Scoring Engine

Score:

- Discovery
- Impact
- Root cause
- Remediation
- Verification
- Hidden objectives

---

### SB-061 — Leaderboard

Provide:

- Individual ranking
- Team ranking
- Lab ranking

---

### SB-062 — Hint System

Hints should reduce available points.

---

### SB-063 — Achievements

Implement badges including:

- First Blood
- API Hunter
- AI Red Teamer
- Pipeline Defender
- Supply Chain Investigator
- Remediation Master
- SecureBank Defender

---

### SB-064 — Facilitator Dashboard

Implement:

- Participant status
- Environment status
- Challenge progress
- Hints
- Resets
- Score adjustment
- Audit trail

---

### SB-065 — Admin Console

Implement:

- User management
- Challenge management
- Lab state
- Infrastructure state
- Kill switch
- Exports

---

### WEEK 8 EXIT

SecureBank operates as a unified gamified conference Sandbox rather than a collection of independent applications.

---

# WEEK 9 — INFRASTRUCTURE, ISOLATION & SCALE

### SB-066 — Infrastructure as Code

Automate infrastructure deployment.

---

### SB-067 — Environment Orchestrator

Automate:

**Create → Seed → Assign → Monitor → Reset → Destroy**

---

### SB-068 — Participant Isolation

Ensure participant/team environments cannot communicate outside permitted boundaries.

---

### SB-069 — Egress Controls

Restrict outbound access.

Test controls explicitly.

---

### SB-070 — Resource Quotas

Prevent:

- CPU exhaustion
- Memory exhaustion
- Storage abuse
- runaway workloads

---

### SB-071 — Central Observability

Implement:

- Logs
- Metrics
- Alerts
- Environment health
- Capacity
- Provisioning health

---

### SB-072 — Kill Switch

Administrators must be able to:

- Disable a lab
- Terminate an environment
- Terminate a participant session
- Stop provisioning
- Shut down the complete range if necessary

---

### SB-073 — Load Test: 50 Users

Measure baseline.

---

### SB-074 — Load Test: 100 Users

Identify bottlenecks.

---

### SB-075 — Load Test: 250 Users

Optimise infrastructure.

---

### SB-076 — Load Test: 500 Users

Determine maximum supported conference concurrency.

Do not claim 500-user support unless the test passes against agreed thresholds.

---

### WEEK 9 EXIT

Infrastructure has demonstrated isolation, observability, recovery and measured capacity.

---

# WEEK 10 — SECURITY VALIDATION & CONFERENCE READINESS

### SB-077 — Platform Penetration Test

Test the Sandbox platform itself.

Focus on preventing participants from escaping intended challenge boundaries.

---

### SB-078 — Isolation Test

Attempt:

- Cross-team access
- Cross-environment access
- Infrastructure access
- Administrative-plane access
- Unauthorized external communication

All critical isolation tests must pass.

---

### SB-079 — Challenge QA

Every challenge must be independently tested for:

- Intended solution
- Validation
- Reset
- Hints
- Scoring
- Remediation
- Difficulty
- Documentation

---

### SB-080 — Full Environment Reset Test

Reset all environments and verify clean restoration.

---

### SB-081 — Failure Simulation

Test:

- Application failure
- Container failure
- Node failure
- Database failure
- Provisioning failure
- Network interruption

---

### SB-082 — Venue Network Simulation

Model conference network constraints and concurrency.

---

### SB-083 — Facilitator Training

Facilitators must practise:

- Starting labs
- Supporting participants
- Resetting labs
- Handling hints
- Escalating incidents
- Using dashboards
- Emergency shutdown

---

### SB-084 — Participant Documentation

Complete:

- Getting Started
- Rules
- Acceptable Use
- Lab Guide
- Troubleshooting
- FAQ

---

### SB-085 — Operations Runbook

Document:

- Startup
- Health checks
- Monitoring
- Capacity
- Incident response
- Reset
- Escalation
- Shutdown
- Recovery

---

### SB-086 — Dress Rehearsal

Run a simulated conference session with representative participants.

Test the complete journey:

**Registration → Login → Lab Selection → Provision → Challenge → Score → Reset → Leaderboard**

---

### SB-087 — Go/No-Go Review

Review:

- Critical defects
- Isolation
- Capacity
- Availability
- Security
- Facilitator readiness
- Documentation
- Recovery
- Monitoring

No unresolved critical safety or isolation defect is acceptable.

---

# FINAL DEFINITION OF DONE

At the end of Week 10:

### Product

✓ SecureBank banking application works  
✓ Web Lab works  
✓ API Lab works  
✓ AI Lab works  
✓ DevSecOps Lab works  
✓ Supply Chain Lab works  

### Sandbox

✓ Participant portal  
✓ Lab launcher  
✓ Team system  
✓ Scoring  
✓ Leaderboards  
✓ Achievements  
✓ Hints  
✓ Facilitator dashboard  
✓ Admin console  

### Infrastructure

✓ Automated provisioning  
✓ Automated resets  
✓ Automated teardown  
✓ Participant isolation  
✓ Egress controls  
✓ Resource limits  
✓ Monitoring  
✓ Kill switch  

### Operations

✓ Challenges QA-tested  
✓ Security tested  
✓ Capacity tested  
✓ Facilitators trained  
✓ Documentation completed  
✓ Runbook completed  
✓ Dress rehearsal passed  

---

# TEN-WEEK DELIVERY OUTCOME

**Weeks 1–2:** Build SecureBank.

**Weeks 3–4:** Break SecureBank's Web and APIs.

**Week 5:** Attack SecureBank AI.

**Week 6:** Secure SecureBank's pipeline.

**Week 7:** Investigate SecureBank's software supply chain.

**Week 8:** Turn everything into a gamified Sandbox.

**Week 9:** Build and validate the conference infrastructure.

**Week 10:** Attack the Sandbox itself, rehearse it, and certify it ready for conference day.

The final result is not five demo applications.

It is **one realistic digital-bank ecosystem with five interconnected security laboratories** that participants can attack, investigate, remediate and defend.