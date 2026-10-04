# Universal Agent-Reach Operating Standard

This project adopts selected engineering patterns from Panniantong/Agent-Reach (MIT) as a reusable operating method for AI-assisted projects.

## Purpose

Use a resilient, diagnosable workflow for external tools, connectors, data sources, automation and long-running project work.

This is an adaptation of the method, not a vendored copy of Agent-Reach and not a replacement for project-specific architecture.

## Core principles

1. **Selector, health checker, router — not a permanent wrapper.**
   - Prefer the native/upstream tool when it is healthy.
   - The routing layer decides what to use and verifies that it actually works.

2. **Ordered backends with fallbacks.**
   - Each capability may have a preferred backend and one or more fallbacks.
   - Fallback order is explicit and deterministic.
   - A stale preferred backend must never hide a healthy fallback.

3. **Probe, do not merely detect.**
   - `which`, file existence, or a configured connector is not proof of health.
   - Run a small, bounded probe before declaring a backend healthy.

4. **One broken channel must not crash the whole health report.**
   - Per-channel failures are isolated and reported independently.
   - A critical project failure may still block the mission/deployment gate.

5. **Safe by default.**
   - Health checks are read-only.
   - No system-level package install, credential change, firewall/security change, destructive write, or elevated permission without explicit user approval.
   - Secrets never belong in the repository.

6. **Dedicated external-tool area.**
   - Tool caches, temporary clones and credentials must not pollute the project workspace.
   - Project repositories contain only project code, configuration, probes and documentation.

## Sahand extension: Stall Guard

For this project, a stalled operation is treated as a failure even when no formal exception is returned.

### Stall response

`STALL / UNKNOWN STATE -> STOP -> CHECKPOINT -> VERIFY -> REPORT`

When meaningful progress is no longer observable within a reasonable operation-specific window:

1. Stop the current mission chain.
2. Do not start the next dependent step.
3. Preserve the last known-good state.
4. Commit/checkpoint only verified completed work; never checkpoint a half-written destructive change as "done".
5. Record the exact unfinished step and any uncertain state.
6. Report: completed, checkpointed, failed/stalled, not started.
7. Wait for a new continue instruction when user intervention is needed.

## Standard mission flow

`PREFLIGHT -> PLAN -> BUILD -> PROBE/DOCTOR -> TEST -> REALITY CHECK -> CHECKPOINT -> DEPLOY -> POST-DEPLOY PROBE`

### Preflight

Before modifying production-affecting files:

- identify the task and protected scope;
- identify required tools/data/connectors;
- define preferred and fallback routes;
- run read-only health probes where possible;
- verify a rollback/checkpoint path exists.

### During execution

- keep changes small and scoped;
- checkpoint at meaningful boundaries;
- do not silently switch to a lower-trust data source;
- record which backend/source actually served a capability;
- time-bound external operations where practical.

### Failure classes

- **Channel failure:** one tool/source is unavailable; try the next approved fallback and record the switch.
- **Critical capability failure:** no approved backend remains; stop the dependent step.
- **Mission stall / unknown state:** stop the whole mission chain, checkpoint known-good work and report immediately.
- **Data/evidence conflict:** do not guess; mark review/hold and continue only independent safe work.

## Backend registry template

For each capability, record:

- capability name;
- preferred backend;
- ordered fallbacks;
- lightweight probe;
- trust level / source authority;
- whether credentials are required;
- whether failure is blocking;
- last known active backend.

Example:

```text
Capability: Git repository operations
Preferred: connected GitHub tool
Fallback 1: gh CLI (only when available and authorized)
Probe: read repository metadata / current branch
Blocking: yes for deploy, no for local build
```

## Doctor contract

A project doctor must:

- be read-only by default;
- isolate individual probe exceptions;
- use bounded timeouts for executable probes;
- distinguish `ok`, `warn`, `off`, `error`, and `timeout`;
- report the active backend when fallbacks exist;
- never print secrets;
- return a non-zero exit code when a blocking capability is unhealthy.

The generic implementation for this repository is `tools/project_doctor.py` with `.project-doctor.json`.

## Checkpoint report format

After a stall/error, report exactly four groups:

1. **Completed and verified**
2. **Checkpointed / committed**
3. **Failed or stalled at**
4. **Not started / remaining**

Do not report planned work as completed.

## Attribution

Method inspired by Agent-Reach by Panniantong / Agent Eyes, licensed under MIT. The project-specific Stall Guard, checkpoint rules and deployment gates are Sahand Laser adaptations.
