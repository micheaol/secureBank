# Illustrative Infrastructure-as-Code skeleton (SB-066) - NOT applied.
#
# This is the reviewed shape of the conference infrastructure, not a
# runnable stack: it has no configured provider credentials, no backend for
# state, and no cloud account behind it in this environment. Standing up
# real infrastructure from this file is Week 9 execution work that requires
# an actual cloud account and DNS the conference controls - out of scope
# for what can be verified inside this repository.
#
# Provider is left unpinned deliberately (PRD §28 "Portability": the
# platform should avoid unnecessary dependence on a single conference venue
# or infrastructure provider). Swap the `google`/`aws`/`azurerm` blocks below
# for whichever provider hosts a given conference edition.

terraform {
  required_version = ">= 1.5.0"
}

variable "conference_edition" {
  description = "e.g. \"04\" - namespaces and resource names are suffixed with this"
  type        = string
}

variable "expected_max_concurrent_participants" {
  description = "Drives node pool sizing; see docs/load-testing.md for how this number was derived"
  type        = number
  default     = 250
}

# --- Kubernetes cluster -----------------------------------------------
# A managed Kubernetes cluster (GKE/EKS/AKS - provider-specific resource
# omitted here, see infrastructure/kubernetes/README.md for what runs on
# top of it). Sized from the load-test results in docs/load-testing.md,
# never from an unvalidated guess (10-Week-plan.md SB-076: "Do not claim
# 500-user support unless the test passes against agreed thresholds").

# --- Managed Postgres ----------------------------------------------------
# One instance for the shared control plane (auth, scoring, audit log —
# the pieces this repo's services/api already implements) plus the
# per-participant Postgres instances described in
# infrastructure/kubernetes/namespace-template.yaml.

# --- DNS / ingress ---------------------------------------------------
# Conference venue network constraints (SB-082) determine whether this is a
# public ingress with TLS or a venue-local network only - a venue decision,
# not an application decision, so it is deliberately not hardcoded here.

output "note" {
  value = "This file documents intended shape only. See infrastructure/kubernetes/README.md."
}
