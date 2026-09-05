# 🏦 SecureBank

<p align="center">
  <strong>A realistic, intentionally vulnerable digital banking ecosystem for hands-on Application Security training.</strong>
</p>

<p align="center">
  Build it. Break it. Fix it. Defend it.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-TBD-lightgrey.svg" alt="License"></a>
  <a href="SECURITY.md"><img src="https://img.shields.io/badge/Security-Policy-blue.svg" alt="Security Policy"></a>
  <a href="CONTRIBUTING.md"><img src="https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg" alt="Contributions Welcome"></a>
  <img src="https://img.shields.io/badge/Status-Active%20Development-orange.svg" alt="Development Status">
  <img src="https://img.shields.io/badge/Training-Application%20Security-blueviolet.svg" alt="Application Security Training">
  <img src="https://img.shields.io/badge/Environment-Intentionally%20Vulnerable-red.svg" alt="Intentionally Vulnerable">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Web-Security-informational" alt="Web Security">
  <img src="https://img.shields.io/badge/API-Security-informational" alt="API Security">
  <img src="https://img.shields.io/badge/AI-Security-informational" alt="AI Security">
  <img src="https://img.shields.io/badge/DevSecOps-Lab-informational" alt="DevSecOps">
  <img src="https://img.shields.io/badge/Supply%20Chain-Security-informational" alt="Supply Chain Security">
</p>

---

## ⚠️ Security Warning

> **SecureBank is intentionally vulnerable.**

It is designed exclusively for authorized cybersecurity education, Application Security training, security research, competitions, workshops, and controlled conference environments.

**Do not expose SecureBank directly to the public Internet.**

Do not deploy it:

- on production infrastructure;
- alongside sensitive workloads;
- with real customer information;
- with real credentials or secrets;
- against real financial services;
- as an unrestricted public attack target.

SecureBank must only be operated inside an appropriately isolated and authorized environment.

---

## What is SecureBank?

**SecureBank** is a fictional Nigerian digital bank built as an interconnected Application Security training environment.

Rather than presenting participants with unrelated vulnerable applications, SecureBank models the security challenges of a modern software organization across the complete software lifecycle.

```text
Design
  ↓
Code
  ↓
Web / API / AI
  ↓
Build
  ↓
Dependencies
  ↓
CI/CD
  ↓
Artifacts
  ↓
Deploy
  ↓
Attack
  ↓
Detect
  ↓
Fix
  ↓
Verify
```

SecureBank was created for the **National Application Security (AppSec) Conference Sandbox** and is owned by **Petaverse Ltd**.

The platform is designed around a simple principle:

> **Finding the vulnerability is only half the exercise. Understanding and fixing it matters more.**

---

# 🎯 Mission

SecureBank exists to provide realistic, isolated and scenario-driven security exercises where participants can:

**Build → Break → Investigate → Remediate → Verify → Defend**

The platform bridges the gap between offensive security exercises and secure software engineering.

---

# 🧪 The Five Labs

SecureBank V1 consists of five interconnected security laboratories.

## 🌐 Web Application Security Lab

Assess the customer-facing and administrative applications.

Challenge families may include:

- Authentication
- Authorization
- Session management
- Access control
- Injection
- Cross-Site Scripting
- Input validation
- File handling
- Security misconfiguration
- Information disclosure
- Business logic
- Server-side request handling

Participants progress beyond exploitation into root-cause analysis and remediation.

---

## 🔌 API Security Lab

Assess the APIs powering SecureBank.

Example API domains include:

```text
/auth
/users
/accounts
/beneficiaries
/transfers
/transactions
/support
/admin
```

Challenge families may include:

- Broken Object Level Authorization
- Broken Function Level Authorization
- Broken Authentication
- Object Property Authorization
- Resource Consumption
- Sensitive Business Flow Abuse
- Security Misconfiguration
- API Inventory Management
- Unsafe API Consumption
- Excessive Data Exposure
- Mass Assignment
- Rate-Limit Weaknesses

Typical learning flow:

```text
Discover
   ↓
Test
   ↓
Demonstrate Impact
   ↓
Identify Root Cause
   ↓
Remediate
   ↓
Retest
```

---

## 🤖 AI Security Lab

Assess SecureBank's fictional AI-powered banking assistant.

The environment models:

```text
User
 │
 ▼
SecureBank AI
 │
 ├── System Instructions
 ├── RAG
 ├── Knowledge Base
 │
 └── Tool Gateway
       │
       ├── Account Lookup
       ├── Transaction Lookup
       ├── Support Actions
       └── Restricted Simulated Actions
```

Challenge families may include:

- Direct Prompt Injection
- Indirect Prompt Injection
- Sensitive Information Disclosure
- Excessive Agency
- Improper Output Handling
- Insecure Tool Invocation
- AI Authorization Failures
- RAG Poisoning
- Trust Boundary Failures
- Cross-User Information Exposure

The objective is not simply to "jailbreak a chatbot."

Participants learn to assess the security architecture surrounding AI-enabled applications.

---

## ♾️ DevSecOps Lab

SecureBank's security extends beyond application code.

Participants investigate the delivery pipeline:

```text
Commit
   ↓
Build
   ↓
Test
   ↓
Security
   ↓
Package
   ↓
Deploy
```

Exercises may involve:

- SAST
- SCA
- Secret scanning
- CI/CD permissions
- Pipeline configuration
- Container security
- Infrastructure as Code
- Environment variables
- Security gates
- Artifact handling
- Dependency management

Participants are expected to move through:

```text
Find → Understand → Fix → Commit → Pipeline → Verify → Deploy
```

---

## 📦 Software Supply Chain Lab

Investigate the journey from source code to deployed software.

```text
Developer
    ↓
Source Repository
    ↓
Dependencies
    ↓
Build System
    ↓
Artifact
    ↓
Registry
    ↓
Deployment
```

Challenge families may include:

- Dependency confusion simulations
- Malicious package simulations
- Vulnerable transitive dependencies
- Dependency tampering
- Build environment compromise
- Artifact tampering
- Missing provenance
- Signature verification failures
- SBOM analysis
- Overprivileged build environments

A typical investigation begins with:

> **A trusted SecureBank release is behaving suspiciously. Determine what happened.**

---

# 🏗️ Architecture

SecureBank models an interconnected modern banking application.

```text
                             SECUREBANK
                                 │
                    ┌────────────┴────────────┐
                    │                         │
             Customer Web App            Admin Portal
                    │                         │
                    └────────────┬────────────┘
                                 │
                            API Gateway
                                 │
        ┌────────────┬───────────┼───────────┬────────────┐
        │            │           │           │            │
      Auth       Accounts    Transfers    Payments     Support
        │            │           │           │            │
        └────────────┴───────────┼───────────┴────────────┘
                                 │
                            Data Layer
                                 │
                    ┌────────────┴────────────┐
                    │                         │
               AI Assistant              Audit / Logs
                    │
               RAG + Tools

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
                         Software Supply Chain
```

---

# 👥 SecureBank Roles

The simulated environment may contain:

| Role | Purpose |
|---|---|
| Customer | Standard banking user |
| Support Agent | Customer-support operations |
| Operations User | Controlled operational functions |
| Developer | Source and development workflows |
| DevOps Engineer | Pipeline and deployment workflows |
| Security Engineer | Findings and security telemetry |
| Administrator | Privileged application functions |
| Lab Facilitator | Participant support and lab control |
| Sandbox Administrator | Infrastructure and range administration |

All identities and information are fictional.

---

# 🏦 Simulated Banking Features

SecureBank includes enough functionality to create believable security scenarios:

- Registration
- Authentication
- Account dashboard
- Customer profile
- Beneficiaries
- Simulated transfers
- Transaction history
- Support tickets
- Administrative operations
- AI-assisted support
- Audit events

**SecureBank never processes real money.**

---

# 🎮 Challenge Model

Each challenge is defined using a consistent structure:

```yaml
id:
title:
lab:
difficulty:
scenario:
objective:
learning_objective:
prerequisites:
starting_state:
expected_security_boundary:
intended_weakness:
validation:
score:
hints:
remediation:
reset:
safety_classification:
```

This makes challenges independently testable, maintainable and versionable.

---

# 🧠 Difficulty Levels

### 🟢 Explorer

Designed for students and newcomers.

Focus:

- Discovery
- Fundamental exploitation
- Security concepts
- Root-cause understanding

### 🟡 Engineer

Designed for developers and security practitioners.

Focus:

- Exploitation
- Impact analysis
- Remediation
- Verification

### 🔴 Specialist

Designed for experienced practitioners.

Focus:

- Chained vulnerabilities
- Business logic
- Architecture
- Detection
- Complex remediation

Selected labs may also contain hidden challenges.

---

# 🏆 Scoring

SecureBank rewards security engineering rather than exploitation alone.

| Activity | Example Score |
|---|---:|
| Vulnerability discovered | 100 |
| Impact demonstrated | 100 |
| Root cause identified | 150 |
| Correct remediation | 250 |
| Verification passed | 150 |
| Detection/evidence produced | 100 |
| Hidden challenge | 300+ |

Actual scoring may vary between challenges.

Using hints may reduce the maximum available score.

---

# 🥇 Achievements

Participants may unlock achievements such as:

- 🩸 First Blood
- 🔐 Access Controller
- 🔌 API Hunter
- 🧑‍💻 Secure Coder
- ♾️ Pipeline Defender
- 🤖 AI Red Teamer
- 📦 Supply Chain Investigator
- 🔎 Threat Hunter
- 🛠️ Remediation Master
- 🛡️ SecureBank Defender

---

# 🖥️ Sandbox Platform

SecureBank is designed to sit behind a dedicated Sandbox management platform.

Participants can:

- Authenticate
- Join teams
- Browse labs
- Launch environments
- Read scenarios
- Request hints
- Submit solutions
- Track progress
- Earn points
- Unlock achievements
- View leaderboards
- Reset eligible environments

---

# 👨‍🏫 Facilitator Console

Authorized facilitators can:

- Monitor participants
- Monitor teams
- View challenge progress
- Provide hints
- Reset environments
- Review validation
- Adjust scores where authorized
- Escalate incidents

Administrative actions should be auditable.

---

# ⚙️ Administration

Sandbox administrators can manage:

- Users
- Teams
- Labs
- Challenges
- Environment lifecycle
- Infrastructure health
- Scoring
- Capacity
- Audit logs
- Emergency controls

The platform must support an administrative **kill switch** for unsafe or unstable lab environments.

---

# 🔄 Environment Lifecycle

```text
Select Lab
    ↓
Authorization
    ↓
Provision Environment
    ↓
Seed Synthetic Data
    ↓
Issue Temporary Access
    ↓
Perform Exercise
    ↓
Telemetry + Validation
    ↓
Complete / Timeout
    ↓
Capture Results
    ↓
Destroy Environment
```

Participant environments should be ephemeral wherever practical.

---

# 🔒 Isolation & Safety

SecureBank's deliberate vulnerabilities make isolation mandatory.

Production deployments must implement appropriate controls including:

- Isolated participant environments
- Network segmentation
- Restricted egress
- Administrative MFA
- Resource quotas
- Rate controls
- Central logging
- Audit trails
- Environment expiration
- Automated teardown
- Emergency shutdown

Participants must not be able to use SecureBank as a bridge to attack external infrastructure.

---

# 🚫 What SecureBank Is Not

SecureBank is **not**:

- A real bank
- A payment processor
- A production banking platform
- A core banking system
- A real financial service
- An unrestricted hacking platform
- A public attack target

It must never contain:

- Real banking credentials
- Real customer records
- Real payment credentials
- Production secrets
- Production financial integrations

---

# 🚀 Local Development

> **Note:** Installation instructions will evolve as SecureBank reaches implementation milestones.

The target developer experience is:

```bash
git clone https://github.com/YOUR_ORG/securebank.git
cd securebank
docker compose up
```

The complete local development environment should be containerized so contributors do not need to manually install each application dependency.

---

# 📁 Proposed Repository Structure

```text
securebank/
│
├── apps/
│   ├── web/
│   ├── admin/
│   └── sandbox/
│
├── services/
│   ├── auth/
│   ├── accounts/
│   ├── transfers/
│   ├── support/
│   └── ai/
│
├── labs/
│   ├── web/
│   ├── api/
│   ├── ai/
│   ├── devsecops/
│   └── supply-chain/
│
├── challenges/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── terraform/
│
├── observability/
│
├── scripts/
│
├── docs/
│
├── tests/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── SECURITY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

The final structure may change as implementation progresses.

---

# 🛠️ Development Philosophy

Intentional vulnerabilities must be treated as **product features**, not uncontrolled bugs.

Every intentional vulnerability should have:

- Defined learning objective
- Known affected component
- Known attack boundary
- Expected solution
- Validation
- Reset procedure
- Remediation path
- Facilitator documentation
- Safety classification

Unintentional vulnerabilities in the Sandbox infrastructure itself are defects and should be reported immediately.

---

# 🧪 Testing

SecureBank requires two distinct categories of security testing.

### Challenge Testing

Verifies that:

- The intended vulnerability exists.
- The intended learning path works.
- Challenge validation works.
- Remediation works.
- Reset works.

### Platform Security Testing

Verifies that participants **cannot escape the intended lab boundaries**.

Testing should include:

- Cross-team isolation
- Cross-environment isolation
- Administrative access controls
- Infrastructure access controls
- Egress restrictions
- Resource isolation
- Authentication
- Authorization
- Environment teardown

---

# 📈 Capacity Testing

Conference infrastructure should be load-tested progressively.

Target test stages:

```text
50 concurrent participants
        ↓
100 concurrent participants
        ↓
250 concurrent participants
        ↓
500 concurrent participants
```

A concurrency level must not be advertised as supported until it has passed the agreed performance and stability criteria.

---

# 🗺️ Roadmap

## V1

- Web Security Lab
- API Security Lab
- AI Security Lab
- DevSecOps Lab
- Software Supply Chain Lab
- Participant Portal
- Team Support
- Scoring
- Leaderboards
- Achievements
- Facilitator Console
- Administration
- Automated Lab Lifecycle
- Observability

## Future

Potential future labs include:

- Mobile Security
- Cloud Security
- Kubernetes Security
- Identity Security
- Detection Engineering
- Digital Forensics
- Threat Modeling
- Secure Architecture
- Purple Team Exercises
- Attack/Defence Competitions

---

# 🤝 Contributing

SecureBank is being designed as a serious security education platform.

Contributions may eventually include:

- New challenges
- Challenge improvements
- Secure remediation examples
- Lab infrastructure
- Documentation
- Testing
- Accessibility
- Observability
- Platform security
- Developer experience

Before contributing, read:

**`CONTRIBUTING.md`**

Security vulnerabilities affecting the platform itself must **not** be submitted through public issues.

---

# 🛡️ Reporting Security Vulnerabilities

There is an important distinction between:

**intentional challenge vulnerabilities**

and

**unintended vulnerabilities affecting SecureBank itself.**

If you discover an unintended vulnerability that could:

- Escape a lab environment
- Access another participant's environment
- Compromise the host infrastructure
- Bypass administrative controls
- Expose secrets
- Affect conference infrastructure

**do not disclose it through a public GitHub issue.**

Follow the responsible disclosure process defined in:

**`SECURITY.md`**

---

# 📜 Responsible Use

SecureBank exists for authorized security education.

By operating or participating in SecureBank environments, users are expected to:

- Attack only assigned targets.
- Remain within defined scope.
- Follow facilitator instructions.
- Respect participant isolation.
- Avoid attacking underlying infrastructure.
- Avoid attacking conference networks.
- Avoid attacking external systems.
- Report unintended platform vulnerabilities responsibly.

Authorization to use SecureBank does not authorize testing of any system outside the defined lab scope.

---

# 📚 Documentation

Project documentation should eventually include:

```text
docs/
├── architecture.md
├── getting-started.md
├── lab-guide.md
├── challenge-authoring.md
├── facilitator-guide.md
├── operations-runbook.md
├── threat-model.md
├── isolation-model.md
└── troubleshooting.md
```

---

# 🌍 National AppSec Conference

SecureBank powers hands-on experiences within the **Sandbox** of the National Application Security Conference.

The Sandbox philosophy is simple:

> **Touch it. Build it. Break it. Fix it.**

Participants do not attend SecureBank labs merely to hear how Application Security works.

They experience it.

---

# 🏢 Ownership

SecureBank is a product of **Petaverse Ltd** and forms part of the National Application Security Conference technical ecosystem.

Conference partnerships, endorsements, sponsorships or operational relationships do not automatically confer ownership of SecureBank or its intellectual property.

---

# 📄 License

The SecureBank licensing model is currently **to be determined**.

Do not assume that the project is open source until a formal `LICENSE` file has been published.

Once selected, the applicable license and permitted uses will be documented here.

---

# ⚖️ Disclaimer

SecureBank is a fictional security training environment.

It is not affiliated with, endorsed by, or representative of any real bank or financial institution.

All names, accounts, transactions, customers, credentials, documents and financial information used within the platform must be fictional or synthetically generated.

SecureBank must not be used for unauthorized access, testing, exploitation or attacks against third-party systems.

---

<p align="center">
  <strong>SecureBank</strong>
  <br>
  Build it. Break it. Fix it. Defend it.
  <br><br>
  <strong>National Application Security Conference</strong>
  <br>
  Building Nigeria's Secure Software Future.
</p>