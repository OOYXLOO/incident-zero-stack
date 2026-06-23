window.INCIDENT_ZERO_STATIC_DEMO = {
  "generatedAt": "2026-06-23T23:55:42.171Z",
  "source": "local deterministic Incident Zero model",
  "mode": "static-review-fallback",
  "scenarios": [
    {
      "id": "identity",
      "name": "Privileged Identity",
      "title": "Privileged token anomaly",
      "severity": "critical"
    },
    {
      "id": "payments",
      "name": "Payment Webhook",
      "title": "Duplicate payment webhook replay",
      "severity": "high"
    },
    {
      "id": "data",
      "name": "Data Export",
      "title": "Unusual data export from analyst workspace",
      "severity": "medium"
    }
  ],
  "cases": {
    "identity": {
      "caseId": "CASE-2026-0612-01",
      "alert": {
        "id": "identity",
        "name": "Privileged Identity",
        "caseId": "CASE-2026-0612-01",
        "title": "Privileged token anomaly",
        "severity": "critical",
        "source": "cloud-idp",
        "detectedAt": "2026-06-12T08:21:09Z",
        "owner": "Identity response",
        "impactedSystem": "build-prod-runner",
        "impactedUsers": 14,
        "customerImpact": true,
        "contained": false,
        "evidenceConfidence": 88,
        "revenueAtRiskUsd": 8400,
        "signals": [
          "Token used from previously unseen ASN",
          "Admin API call followed by audit-log export",
          "CI runner assumed production deploy role outside release window"
        ],
        "scenarioId": "identity"
      },
      "risk": 100,
      "windows": [
        {
          "label": "Triage",
          "dueMinutes": 10,
          "dueAt": "2026-06-12T08:31:09.000Z"
        },
        {
          "label": "Contain",
          "dueMinutes": 30,
          "dueAt": "2026-06-12T08:51:09.000Z"
        },
        {
          "label": "Stakeholder update",
          "dueMinutes": 30,
          "dueAt": "2026-06-12T08:51:09.000Z"
        },
        {
          "label": "Executive handoff",
          "dueMinutes": 120,
          "dueAt": "2026-06-12T10:21:09.000Z"
        }
      ],
      "metrics": [
        {
          "label": "Risk",
          "value": "100/100",
          "detail": "containment still open"
        },
        {
          "label": "SLA windows",
          "value": "4",
          "detail": "triage, containment, update, handoff"
        },
        {
          "label": "Evidence",
          "value": "3",
          "detail": "81% avg confidence"
        },
        {
          "label": "Records",
          "value": "20",
          "detail": "single-table DynamoDB-shaped entities"
        },
        {
          "label": "Ready tasks",
          "value": "3",
          "detail": "immediately actionable response work"
        }
      ],
      "tasks": [
        {
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Identity response",
          "status": "ready",
          "dueAt": "2026-06-12T08:31:09.000Z",
          "action": "Confirm blast radius for build-prod-runner and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded"
        },
        {
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Freeze risky path on build-prod-runner until evidence is preserved",
          "acceptance": "Containment action is reversible, logged, and linked to evidence"
        },
        {
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp"
        },
        {
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns"
        },
        {
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-12T10:21:09.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history"
        }
      ],
      "evidence": [
        {
          "id": "evidence-001",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 88,
          "detail": "Token used from previously unseen ASN",
          "integrityHash": "2ec74ee1"
        },
        {
          "id": "evidence-002",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 81,
          "detail": "Admin API call followed by audit-log export",
          "integrityHash": "7118b12d"
        },
        {
          "id": "evidence-003",
          "source": "cloud-idp",
          "status": "pending-review",
          "confidence": 74,
          "detail": "CI runner assumed production deploy role outside release window",
          "integrityHash": "99047542"
        }
      ],
      "audit": [
        {
          "at": "2026-06-12T08:21:09Z",
          "event": "alert_ingested",
          "actor": "cloud-idp",
          "detail": "cloud-idp generated CASE-2026-0612-01"
        },
        {
          "at": "2026-06-12T08:23:09.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "at": "2026-06-12T08:29:09.000Z",
          "event": "risk_scored",
          "actor": "Identity response",
          "detail": "Risk score computed as 100/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "at": "2026-06-12T08:39:09.000Z",
          "event": "containment_planned",
          "actor": "Platform owner",
          "detail": "Containment task is ready with reversible action and evidence requirement"
        },
        {
          "at": "2026-06-12T08:51:09.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        }
      ],
      "updates": [
        {
          "audience": "Responder channel",
          "tone": "operational",
          "message": "CRITICAL Privileged token anomaly. Identity response owns triage. Current risk 100/100. Next checkpoint 2026-06-12T08:51:09.000Z."
        },
        {
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting build-prod-runner. Mitigation is in progress; next update is scheduled."
        },
        {
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "14 users or internal actors in scope, 3 evidence signals, $8,400 estimated exposure."
        }
      ],
      "records": [
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "CASE#META",
          "entity": "CASE",
          "title": "Privileged token anomaly",
          "severity": "critical",
          "owner": "Identity response",
          "risk": 100,
          "status": "active",
          "GSI1PK": "OPEN#CRITICAL",
          "GSI1SK": "2026-06-12T08:21:09Z",
          "GSI2PK": "OWNER#Identity response",
          "GSI2SK": "RISK#000"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "ALERT#2026-06-12T08:21:09Z",
          "entity": "ALERT",
          "source": "cloud-idp",
          "impactedSystem": "build-prod-runner",
          "impactedUsers": 14,
          "customerImpact": true
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-001",
          "entity": "EVIDENCE",
          "id": "evidence-001",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 88,
          "detail": "Token used from previously unseen ASN",
          "integrityHash": "2ec74ee1"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-002",
          "entity": "EVIDENCE",
          "id": "evidence-002",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 81,
          "detail": "Admin API call followed by audit-log export",
          "integrityHash": "7118b12d"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-003",
          "entity": "EVIDENCE",
          "id": "evidence-003",
          "source": "cloud-idp",
          "status": "pending-review",
          "confidence": 74,
          "detail": "CI runner assumed production deploy role outside release window",
          "integrityHash": "99047542"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-triage",
          "entity": "TASK",
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Identity response",
          "status": "ready",
          "dueAt": "2026-06-12T08:31:09.000Z",
          "action": "Confirm blast radius for build-prod-runner and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded",
          "GSI2PK": "OWNER#Identity response",
          "GSI2SK": "DUE#2026-06-12T08:31:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-contain-primary",
          "entity": "TASK",
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Freeze risky path on build-prod-runner until evidence is preserved",
          "acceptance": "Containment action is reversible, logged, and linked to evidence",
          "GSI2PK": "OWNER#Platform owner",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-preserve-evidence",
          "entity": "TASK",
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp",
          "GSI2PK": "OWNER#Detection engineer",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-stakeholder-update",
          "entity": "TASK",
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns",
          "GSI2PK": "OWNER#Customer lead",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-handoff",
          "entity": "TASK",
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-12T10:21:09.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history",
          "GSI2PK": "OWNER#Incident commander",
          "GSI2SK": "DUE#2026-06-12T10:21:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:21:09Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:21:09Z",
          "event": "alert_ingested",
          "actor": "cloud-idp",
          "detail": "cloud-idp generated CASE-2026-0612-01"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:23:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:23:09.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:29:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:29:09.000Z",
          "event": "risk_scored",
          "actor": "Identity response",
          "detail": "Risk score computed as 100/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:39:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:39:09.000Z",
          "event": "containment_planned",
          "actor": "Platform owner",
          "detail": "Containment task is ready with reversible action and evidence requirement"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:51:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:51:09.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#01",
          "entity": "UPDATE",
          "audience": "Responder channel",
          "tone": "operational",
          "message": "CRITICAL Privileged token anomaly. Identity response owns triage. Current risk 100/100. Next checkpoint 2026-06-12T08:51:09.000Z."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#02",
          "entity": "UPDATE",
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting build-prod-runner. Mitigation is in progress; next update is scheduled."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#03",
          "entity": "UPDATE",
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "14 users or internal actors in scope, 3 evidence signals, $8,400 estimated exposure."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "METRIC#CURRENT",
          "entity": "METRIC",
          "risk": 100,
          "evidenceConfidence": 88,
          "revenueAtRiskUsd": 8400,
          "affectedScope": 14
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "HANDOFF#EXECUTIVE",
          "entity": "HANDOFF",
          "summary": "CRITICAL Privileged token anomaly: 100/100 risk, 3 evidence records, 5 response tasks, containment pending."
        }
      ],
      "schema": {
        "tableName": "IncidentZeroCases",
        "partitionKey": "PK",
        "sortKey": "SK",
        "indexes": [
          {
            "name": "GSI1",
            "partitionKey": "GSI1PK",
            "sortKey": "GSI1SK",
            "purpose": "Query active incidents by severity and updated time"
          },
          {
            "name": "GSI2",
            "partitionKey": "GSI2PK",
            "sortKey": "GSI2SK",
            "purpose": "Query owner workload, due tasks, and handoff readiness"
          }
        ],
        "entities": [
          "CASE",
          "ALERT",
          "EVIDENCE",
          "TASK",
          "AUDIT",
          "UPDATE",
          "METRIC",
          "HANDOFF"
        ],
        "accessPatterns": [
          "Load one incident with all response records",
          "List open incidents by severity",
          "Find response tasks due within the next SLA window",
          "Export an executive handoff packet without scanning the table"
        ]
      },
      "architectureQueries": [
        {
          "name": "Incident packet",
          "query": "PK = CASE#CASE-2026-0612-01",
          "reason": "Loads case, evidence, tasks, audit, updates, metrics, and handoff in one partition"
        },
        {
          "name": "Open severity queue",
          "query": "GSI1PK = OPEN#CRITICAL",
          "reason": "Ranks active incidents for command-center triage"
        },
        {
          "name": "Owner due work",
          "query": "GSI2PK = OWNER#Identity response",
          "reason": "Finds response tasks and accountable handoffs without table scans"
        }
      ],
      "storagePlan": {
        "adapter": "local-memory",
        "liveAdapterTarget": "aws-dynamodb",
        "tableName": "IncidentZeroCases",
        "recordCount": 20,
        "entityCounts": {
          "CASE": 1,
          "ALERT": 1,
          "EVIDENCE": 3,
          "TASK": 5,
          "AUDIT": 5,
          "UPDATE": 3,
          "METRIC": 1,
          "HANDOFF": 1
        },
        "writeStrategy": "Batch write incident packet by PK/SK, then append audit and evidence events as immutable records",
        "readStrategy": "Load one incident by PK; use GSI1 for active severity queue and GSI2 for owner due work",
        "safety": {
          "noCredentialsInCode": true,
          "noSecretsStored": true,
          "accountOwnerProvisioningRequired": true
        }
      },
      "handoff": {
        "filename": "case-2026-0612-01-handoff.md",
        "summary": "CRITICAL Privileged token anomaly: risk 100/100, containment pending, 3 evidence records, 5 open response tasks.",
        "nextUpdateAt": "2026-06-12T08:51:09.000Z",
        "markdown": "# CASE-2026-0612-01 Executive Handoff\n\n## Executive Summary\n\nCRITICAL Privileged token anomaly: risk 100/100, containment pending, 3 evidence records, 5 open response tasks.\n\n## Current Scope\n\n- System: build-prod-runner\n- Owner: Identity response\n- Affected scope: 14\n- Customer impact: yes\n- Estimated exposure: $8,400\n\n## Evidence\n\n- corroborated (88%): Token used from previously unseen ASN\n- corroborated (81%): Admin API call followed by audit-log export\n- pending-review (74%): CI runner assumed production deploy role outside release window\n\n## Open Actions\n\n- [ready] Identity response: Confirm blast radius for build-prod-runner and assign one incident commander\n- [ready] Platform owner: Freeze risky path on build-prod-runner until evidence is preserved\n- [ready] Detection engineer: Write source logs, analyst notes, and decision markers into immutable evidence records\n- [drafted] Customer lead: Draft customer-safe update without exposing investigation details\n- [drafted] Incident commander: Generate executive handoff with decisions, open risks, and database-backed timeline\n\n## Next Update\n\nStakeholder update: 2026-06-12T08:51:09.000Z"
      },
      "gates": {
        "noSecretsStored": true,
        "localPrototypeReady": true,
        "liveAwsDatabaseClaimed": false,
        "vercelDeploymentClaimed": false,
        "awsScreenshotRequired": true,
        "devpostFinalSubmitRequired": true
      }
    },
    "payments": {
      "caseId": "CASE-2026-0619-02",
      "alert": {
        "id": "payments",
        "name": "Payment Webhook",
        "caseId": "CASE-2026-0619-02",
        "title": "Duplicate payment webhook replay",
        "severity": "high",
        "source": "payments-edge",
        "detectedAt": "2026-06-19T03:18:44Z",
        "owner": "Revenue platform",
        "impactedSystem": "checkout-ledger",
        "impactedUsers": 126,
        "customerImpact": true,
        "contained": true,
        "evidenceConfidence": 74,
        "revenueAtRiskUsd": 21400,
        "signals": [
          "Webhook signature valid but nonce reused six times",
          "Ledger rows show repeated idempotency key drift",
          "Refund queue has mismatch between provider event and order state"
        ],
        "scenarioId": "payments"
      },
      "risk": 96,
      "windows": [
        {
          "label": "Triage",
          "dueMinutes": 20,
          "dueAt": "2026-06-19T03:38:44.000Z"
        },
        {
          "label": "Contain",
          "dueMinutes": 60,
          "dueAt": "2026-06-19T04:18:44.000Z"
        },
        {
          "label": "Stakeholder update",
          "dueMinutes": 30,
          "dueAt": "2026-06-19T03:48:44.000Z"
        },
        {
          "label": "Executive handoff",
          "dueMinutes": 180,
          "dueAt": "2026-06-19T06:18:44.000Z"
        }
      ],
      "metrics": [
        {
          "label": "Risk",
          "value": "96/100",
          "detail": "contained path discount applied"
        },
        {
          "label": "SLA windows",
          "value": "4",
          "detail": "triage, containment, update, handoff"
        },
        {
          "label": "Evidence",
          "value": "3",
          "detail": "67% avg confidence"
        },
        {
          "label": "Records",
          "value": "20",
          "detail": "single-table DynamoDB-shaped entities"
        },
        {
          "label": "Ready tasks",
          "value": "2",
          "detail": "immediately actionable response work"
        }
      ],
      "tasks": [
        {
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Revenue platform",
          "status": "ready",
          "dueAt": "2026-06-19T03:38:44.000Z",
          "action": "Confirm blast radius for checkout-ledger and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded"
        },
        {
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Revenue platform",
          "status": "complete",
          "dueAt": "2026-06-19T04:18:44.000Z",
          "action": "Validate containment and watch for recurrence",
          "acceptance": "Containment action is reversible, logged, and linked to evidence"
        },
        {
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-19T04:18:44.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp"
        },
        {
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-19T03:48:44.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns"
        },
        {
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-19T06:18:44.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history"
        }
      ],
      "evidence": [
        {
          "id": "evidence-001",
          "source": "payments-edge",
          "status": "pending-review",
          "confidence": 74,
          "detail": "Webhook signature valid but nonce reused six times",
          "integrityHash": "03239e37"
        },
        {
          "id": "evidence-002",
          "source": "payments-edge",
          "status": "pending-review",
          "confidence": 67,
          "detail": "Ledger rows show repeated idempotency key drift",
          "integrityHash": "208e0047"
        },
        {
          "id": "evidence-003",
          "source": "payments-edge",
          "status": "pending-review",
          "confidence": 60,
          "detail": "Refund queue has mismatch between provider event and order state",
          "integrityHash": "63ac961b"
        }
      ],
      "audit": [
        {
          "at": "2026-06-19T03:18:44Z",
          "event": "alert_ingested",
          "actor": "payments-edge",
          "detail": "payments-edge generated CASE-2026-0619-02"
        },
        {
          "at": "2026-06-19T03:20:44.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "at": "2026-06-19T03:26:44.000Z",
          "event": "risk_scored",
          "actor": "Revenue platform",
          "detail": "Risk score computed as 96/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "at": "2026-06-19T03:36:44.000Z",
          "event": "containment_verified",
          "actor": "Platform owner",
          "detail": "Primary risky path is already contained and under watch"
        },
        {
          "at": "2026-06-19T03:48:44.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        }
      ],
      "updates": [
        {
          "audience": "Responder channel",
          "tone": "operational",
          "message": "HIGH Duplicate payment webhook replay. Revenue platform owns triage. Current risk 96/100. Next checkpoint 2026-06-19T03:48:44.000Z."
        },
        {
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting checkout-ledger. Mitigation is in place; next update is scheduled."
        },
        {
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "126 users or internal actors in scope, 3 evidence signals, $21,400 estimated exposure."
        }
      ],
      "records": [
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "CASE#META",
          "entity": "CASE",
          "title": "Duplicate payment webhook replay",
          "severity": "high",
          "owner": "Revenue platform",
          "risk": 96,
          "status": "contained",
          "GSI1PK": "CONTAINED#HIGH",
          "GSI1SK": "2026-06-19T03:18:44Z",
          "GSI2PK": "OWNER#Revenue platform",
          "GSI2SK": "RISK#004"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "ALERT#2026-06-19T03:18:44Z",
          "entity": "ALERT",
          "source": "payments-edge",
          "impactedSystem": "checkout-ledger",
          "impactedUsers": 126,
          "customerImpact": true
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "EVIDENCE#evidence-001",
          "entity": "EVIDENCE",
          "id": "evidence-001",
          "source": "payments-edge",
          "status": "pending-review",
          "confidence": 74,
          "detail": "Webhook signature valid but nonce reused six times",
          "integrityHash": "03239e37"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "EVIDENCE#evidence-002",
          "entity": "EVIDENCE",
          "id": "evidence-002",
          "source": "payments-edge",
          "status": "pending-review",
          "confidence": 67,
          "detail": "Ledger rows show repeated idempotency key drift",
          "integrityHash": "208e0047"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "EVIDENCE#evidence-003",
          "entity": "EVIDENCE",
          "id": "evidence-003",
          "source": "payments-edge",
          "status": "pending-review",
          "confidence": 60,
          "detail": "Refund queue has mismatch between provider event and order state",
          "integrityHash": "63ac961b"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "TASK#task-triage",
          "entity": "TASK",
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Revenue platform",
          "status": "ready",
          "dueAt": "2026-06-19T03:38:44.000Z",
          "action": "Confirm blast radius for checkout-ledger and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded",
          "GSI2PK": "OWNER#Revenue platform",
          "GSI2SK": "DUE#2026-06-19T03:38:44.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "TASK#task-contain-primary",
          "entity": "TASK",
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Revenue platform",
          "status": "complete",
          "dueAt": "2026-06-19T04:18:44.000Z",
          "action": "Validate containment and watch for recurrence",
          "acceptance": "Containment action is reversible, logged, and linked to evidence",
          "GSI2PK": "OWNER#Revenue platform",
          "GSI2SK": "DUE#2026-06-19T04:18:44.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "TASK#task-preserve-evidence",
          "entity": "TASK",
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-19T04:18:44.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp",
          "GSI2PK": "OWNER#Detection engineer",
          "GSI2SK": "DUE#2026-06-19T04:18:44.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "TASK#task-stakeholder-update",
          "entity": "TASK",
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-19T03:48:44.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns",
          "GSI2PK": "OWNER#Customer lead",
          "GSI2SK": "DUE#2026-06-19T03:48:44.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "TASK#task-handoff",
          "entity": "TASK",
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-19T06:18:44.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history",
          "GSI2PK": "OWNER#Incident commander",
          "GSI2SK": "DUE#2026-06-19T06:18:44.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "AUDIT#2026-06-19T03:18:44Z",
          "entity": "AUDIT",
          "at": "2026-06-19T03:18:44Z",
          "event": "alert_ingested",
          "actor": "payments-edge",
          "detail": "payments-edge generated CASE-2026-0619-02"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "AUDIT#2026-06-19T03:20:44.000Z",
          "entity": "AUDIT",
          "at": "2026-06-19T03:20:44.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "AUDIT#2026-06-19T03:26:44.000Z",
          "entity": "AUDIT",
          "at": "2026-06-19T03:26:44.000Z",
          "event": "risk_scored",
          "actor": "Revenue platform",
          "detail": "Risk score computed as 96/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "AUDIT#2026-06-19T03:36:44.000Z",
          "entity": "AUDIT",
          "at": "2026-06-19T03:36:44.000Z",
          "event": "containment_verified",
          "actor": "Platform owner",
          "detail": "Primary risky path is already contained and under watch"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "AUDIT#2026-06-19T03:48:44.000Z",
          "entity": "AUDIT",
          "at": "2026-06-19T03:48:44.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "UPDATE#01",
          "entity": "UPDATE",
          "audience": "Responder channel",
          "tone": "operational",
          "message": "HIGH Duplicate payment webhook replay. Revenue platform owns triage. Current risk 96/100. Next checkpoint 2026-06-19T03:48:44.000Z."
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "UPDATE#02",
          "entity": "UPDATE",
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting checkout-ledger. Mitigation is in place; next update is scheduled."
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "UPDATE#03",
          "entity": "UPDATE",
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "126 users or internal actors in scope, 3 evidence signals, $21,400 estimated exposure."
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "METRIC#CURRENT",
          "entity": "METRIC",
          "risk": 96,
          "evidenceConfidence": 74,
          "revenueAtRiskUsd": 21400,
          "affectedScope": 126
        },
        {
          "PK": "CASE#CASE-2026-0619-02",
          "SK": "HANDOFF#EXECUTIVE",
          "entity": "HANDOFF",
          "summary": "HIGH Duplicate payment webhook replay: 96/100 risk, 3 evidence records, 5 response tasks, contained."
        }
      ],
      "schema": {
        "tableName": "IncidentZeroCases",
        "partitionKey": "PK",
        "sortKey": "SK",
        "indexes": [
          {
            "name": "GSI1",
            "partitionKey": "GSI1PK",
            "sortKey": "GSI1SK",
            "purpose": "Query active incidents by severity and updated time"
          },
          {
            "name": "GSI2",
            "partitionKey": "GSI2PK",
            "sortKey": "GSI2SK",
            "purpose": "Query owner workload, due tasks, and handoff readiness"
          }
        ],
        "entities": [
          "CASE",
          "ALERT",
          "EVIDENCE",
          "TASK",
          "AUDIT",
          "UPDATE",
          "METRIC",
          "HANDOFF"
        ],
        "accessPatterns": [
          "Load one incident with all response records",
          "List open incidents by severity",
          "Find response tasks due within the next SLA window",
          "Export an executive handoff packet without scanning the table"
        ]
      },
      "architectureQueries": [
        {
          "name": "Incident packet",
          "query": "PK = CASE#CASE-2026-0619-02",
          "reason": "Loads case, evidence, tasks, audit, updates, metrics, and handoff in one partition"
        },
        {
          "name": "Open severity queue",
          "query": "GSI1PK = OPEN#HIGH",
          "reason": "Ranks active incidents for command-center triage"
        },
        {
          "name": "Owner due work",
          "query": "GSI2PK = OWNER#Revenue platform",
          "reason": "Finds response tasks and accountable handoffs without table scans"
        }
      ],
      "storagePlan": {
        "adapter": "local-memory",
        "liveAdapterTarget": "aws-dynamodb",
        "tableName": "IncidentZeroCases",
        "recordCount": 20,
        "entityCounts": {
          "CASE": 1,
          "ALERT": 1,
          "EVIDENCE": 3,
          "TASK": 5,
          "AUDIT": 5,
          "UPDATE": 3,
          "METRIC": 1,
          "HANDOFF": 1
        },
        "writeStrategy": "Batch write incident packet by PK/SK, then append audit and evidence events as immutable records",
        "readStrategy": "Load one incident by PK; use GSI1 for active severity queue and GSI2 for owner due work",
        "safety": {
          "noCredentialsInCode": true,
          "noSecretsStored": true,
          "accountOwnerProvisioningRequired": true
        }
      },
      "handoff": {
        "filename": "case-2026-0619-02-handoff.md",
        "summary": "HIGH Duplicate payment webhook replay: risk 96/100, contained, 3 evidence records, 4 open response tasks.",
        "nextUpdateAt": "2026-06-19T03:48:44.000Z",
        "markdown": "# CASE-2026-0619-02 Executive Handoff\n\n## Executive Summary\n\nHIGH Duplicate payment webhook replay: risk 96/100, contained, 3 evidence records, 4 open response tasks.\n\n## Current Scope\n\n- System: checkout-ledger\n- Owner: Revenue platform\n- Affected scope: 126\n- Customer impact: yes\n- Estimated exposure: $21,400\n\n## Evidence\n\n- pending-review (74%): Webhook signature valid but nonce reused six times\n- pending-review (67%): Ledger rows show repeated idempotency key drift\n- pending-review (60%): Refund queue has mismatch between provider event and order state\n\n## Open Actions\n\n- [ready] Revenue platform: Confirm blast radius for checkout-ledger and assign one incident commander\n- [ready] Detection engineer: Write source logs, analyst notes, and decision markers into immutable evidence records\n- [drafted] Customer lead: Draft customer-safe update without exposing investigation details\n- [drafted] Incident commander: Generate executive handoff with decisions, open risks, and database-backed timeline\n\n## Next Update\n\nStakeholder update: 2026-06-19T03:48:44.000Z"
      },
      "gates": {
        "noSecretsStored": true,
        "localPrototypeReady": true,
        "liveAwsDatabaseClaimed": false,
        "vercelDeploymentClaimed": false,
        "awsScreenshotRequired": true,
        "devpostFinalSubmitRequired": true
      }
    },
    "data": {
      "caseId": "CASE-2026-0619-03",
      "alert": {
        "id": "data",
        "name": "Data Export",
        "caseId": "CASE-2026-0619-03",
        "title": "Unusual data export from analyst workspace",
        "severity": "medium",
        "source": "warehouse-audit",
        "detectedAt": "2026-06-19T05:06:12Z",
        "owner": "Data governance",
        "impactedSystem": "analytics-workspace",
        "impactedUsers": 5,
        "customerImpact": false,
        "contained": false,
        "evidenceConfidence": 61,
        "revenueAtRiskUsd": 0,
        "signals": [
          "Export volume exceeded analyst baseline by 9x",
          "Query touched regulated-data views",
          "Destination bucket was newly created and has no owner tag"
        ],
        "scenarioId": "data"
      },
      "risk": 64,
      "windows": [
        {
          "label": "Triage",
          "dueMinutes": 45,
          "dueAt": "2026-06-19T05:51:12.000Z"
        },
        {
          "label": "Contain",
          "dueMinutes": 120,
          "dueAt": "2026-06-19T07:06:12.000Z"
        },
        {
          "label": "Stakeholder update",
          "dueMinutes": 120,
          "dueAt": "2026-06-19T07:06:12.000Z"
        },
        {
          "label": "Executive handoff",
          "dueMinutes": 360,
          "dueAt": "2026-06-19T11:06:12.000Z"
        }
      ],
      "metrics": [
        {
          "label": "Risk",
          "value": "64/100",
          "detail": "containment still open"
        },
        {
          "label": "SLA windows",
          "value": "4",
          "detail": "triage, containment, update, handoff"
        },
        {
          "label": "Evidence",
          "value": "3",
          "detail": "54% avg confidence"
        },
        {
          "label": "Records",
          "value": "20",
          "detail": "single-table DynamoDB-shaped entities"
        },
        {
          "label": "Ready tasks",
          "value": "2",
          "detail": "immediately actionable response work"
        }
      ],
      "tasks": [
        {
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Data governance",
          "status": "ready",
          "dueAt": "2026-06-19T05:51:12.000Z",
          "action": "Confirm blast radius for analytics-workspace and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded"
        },
        {
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "queued",
          "dueAt": "2026-06-19T07:06:12.000Z",
          "action": "Freeze risky path on analytics-workspace until evidence is preserved",
          "acceptance": "Containment action is reversible, logged, and linked to evidence"
        },
        {
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-19T07:06:12.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp"
        },
        {
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Internal comms",
          "status": "queued",
          "dueAt": "2026-06-19T07:06:12.000Z",
          "action": "Prepare internal status update for leadership channel",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns"
        },
        {
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-19T11:06:12.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history"
        }
      ],
      "evidence": [
        {
          "id": "evidence-001",
          "source": "warehouse-audit",
          "status": "pending-review",
          "confidence": 61,
          "detail": "Export volume exceeded analyst baseline by 9x",
          "integrityHash": "f3ebd58f"
        },
        {
          "id": "evidence-002",
          "source": "warehouse-audit",
          "status": "weak-signal",
          "confidence": 54,
          "detail": "Query touched regulated-data views",
          "integrityHash": "7c3efffc"
        },
        {
          "id": "evidence-003",
          "source": "warehouse-audit",
          "status": "weak-signal",
          "confidence": 47,
          "detail": "Destination bucket was newly created and has no owner tag",
          "integrityHash": "ad1dbb4e"
        }
      ],
      "audit": [
        {
          "at": "2026-06-19T05:06:12Z",
          "event": "alert_ingested",
          "actor": "warehouse-audit",
          "detail": "warehouse-audit generated CASE-2026-0619-03"
        },
        {
          "at": "2026-06-19T05:08:12.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "at": "2026-06-19T05:14:12.000Z",
          "event": "risk_scored",
          "actor": "Data governance",
          "detail": "Risk score computed as 64/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "at": "2026-06-19T05:24:12.000Z",
          "event": "containment_planned",
          "actor": "Platform owner",
          "detail": "Containment task is ready with reversible action and evidence requirement"
        },
        {
          "at": "2026-06-19T05:36:12.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        }
      ],
      "updates": [
        {
          "audience": "Responder channel",
          "tone": "operational",
          "message": "MEDIUM Unusual data export from analyst workspace. Data governance owns triage. Current risk 64/100. Next checkpoint 2026-06-19T07:06:12.000Z."
        },
        {
          "audience": "Business owner",
          "tone": "internal",
          "message": "No confirmed customer impact. Tracking analytics-workspace with evidence confidence 61%."
        },
        {
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "5 users or internal actors in scope, 3 evidence signals, $0 estimated exposure."
        }
      ],
      "records": [
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "CASE#META",
          "entity": "CASE",
          "title": "Unusual data export from analyst workspace",
          "severity": "medium",
          "owner": "Data governance",
          "risk": 64,
          "status": "active",
          "GSI1PK": "OPEN#MEDIUM",
          "GSI1SK": "2026-06-19T05:06:12Z",
          "GSI2PK": "OWNER#Data governance",
          "GSI2SK": "RISK#036"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "ALERT#2026-06-19T05:06:12Z",
          "entity": "ALERT",
          "source": "warehouse-audit",
          "impactedSystem": "analytics-workspace",
          "impactedUsers": 5,
          "customerImpact": false
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "EVIDENCE#evidence-001",
          "entity": "EVIDENCE",
          "id": "evidence-001",
          "source": "warehouse-audit",
          "status": "pending-review",
          "confidence": 61,
          "detail": "Export volume exceeded analyst baseline by 9x",
          "integrityHash": "f3ebd58f"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "EVIDENCE#evidence-002",
          "entity": "EVIDENCE",
          "id": "evidence-002",
          "source": "warehouse-audit",
          "status": "weak-signal",
          "confidence": 54,
          "detail": "Query touched regulated-data views",
          "integrityHash": "7c3efffc"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "EVIDENCE#evidence-003",
          "entity": "EVIDENCE",
          "id": "evidence-003",
          "source": "warehouse-audit",
          "status": "weak-signal",
          "confidence": 47,
          "detail": "Destination bucket was newly created and has no owner tag",
          "integrityHash": "ad1dbb4e"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "TASK#task-triage",
          "entity": "TASK",
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Data governance",
          "status": "ready",
          "dueAt": "2026-06-19T05:51:12.000Z",
          "action": "Confirm blast radius for analytics-workspace and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded",
          "GSI2PK": "OWNER#Data governance",
          "GSI2SK": "DUE#2026-06-19T05:51:12.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "TASK#task-contain-primary",
          "entity": "TASK",
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "queued",
          "dueAt": "2026-06-19T07:06:12.000Z",
          "action": "Freeze risky path on analytics-workspace until evidence is preserved",
          "acceptance": "Containment action is reversible, logged, and linked to evidence",
          "GSI2PK": "OWNER#Platform owner",
          "GSI2SK": "DUE#2026-06-19T07:06:12.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "TASK#task-preserve-evidence",
          "entity": "TASK",
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-19T07:06:12.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp",
          "GSI2PK": "OWNER#Detection engineer",
          "GSI2SK": "DUE#2026-06-19T07:06:12.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "TASK#task-stakeholder-update",
          "entity": "TASK",
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Internal comms",
          "status": "queued",
          "dueAt": "2026-06-19T07:06:12.000Z",
          "action": "Prepare internal status update for leadership channel",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns",
          "GSI2PK": "OWNER#Internal comms",
          "GSI2SK": "DUE#2026-06-19T07:06:12.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "TASK#task-handoff",
          "entity": "TASK",
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-19T11:06:12.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history",
          "GSI2PK": "OWNER#Incident commander",
          "GSI2SK": "DUE#2026-06-19T11:06:12.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "AUDIT#2026-06-19T05:06:12Z",
          "entity": "AUDIT",
          "at": "2026-06-19T05:06:12Z",
          "event": "alert_ingested",
          "actor": "warehouse-audit",
          "detail": "warehouse-audit generated CASE-2026-0619-03"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "AUDIT#2026-06-19T05:08:12.000Z",
          "entity": "AUDIT",
          "at": "2026-06-19T05:08:12.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "AUDIT#2026-06-19T05:14:12.000Z",
          "entity": "AUDIT",
          "at": "2026-06-19T05:14:12.000Z",
          "event": "risk_scored",
          "actor": "Data governance",
          "detail": "Risk score computed as 64/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "AUDIT#2026-06-19T05:24:12.000Z",
          "entity": "AUDIT",
          "at": "2026-06-19T05:24:12.000Z",
          "event": "containment_planned",
          "actor": "Platform owner",
          "detail": "Containment task is ready with reversible action and evidence requirement"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "AUDIT#2026-06-19T05:36:12.000Z",
          "entity": "AUDIT",
          "at": "2026-06-19T05:36:12.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "UPDATE#01",
          "entity": "UPDATE",
          "audience": "Responder channel",
          "tone": "operational",
          "message": "MEDIUM Unusual data export from analyst workspace. Data governance owns triage. Current risk 64/100. Next checkpoint 2026-06-19T07:06:12.000Z."
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "UPDATE#02",
          "entity": "UPDATE",
          "audience": "Business owner",
          "tone": "internal",
          "message": "No confirmed customer impact. Tracking analytics-workspace with evidence confidence 61%."
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "UPDATE#03",
          "entity": "UPDATE",
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "5 users or internal actors in scope, 3 evidence signals, $0 estimated exposure."
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "METRIC#CURRENT",
          "entity": "METRIC",
          "risk": 64,
          "evidenceConfidence": 61,
          "revenueAtRiskUsd": 0,
          "affectedScope": 5
        },
        {
          "PK": "CASE#CASE-2026-0619-03",
          "SK": "HANDOFF#EXECUTIVE",
          "entity": "HANDOFF",
          "summary": "MEDIUM Unusual data export from analyst workspace: 64/100 risk, 3 evidence records, 5 response tasks, containment pending."
        }
      ],
      "schema": {
        "tableName": "IncidentZeroCases",
        "partitionKey": "PK",
        "sortKey": "SK",
        "indexes": [
          {
            "name": "GSI1",
            "partitionKey": "GSI1PK",
            "sortKey": "GSI1SK",
            "purpose": "Query active incidents by severity and updated time"
          },
          {
            "name": "GSI2",
            "partitionKey": "GSI2PK",
            "sortKey": "GSI2SK",
            "purpose": "Query owner workload, due tasks, and handoff readiness"
          }
        ],
        "entities": [
          "CASE",
          "ALERT",
          "EVIDENCE",
          "TASK",
          "AUDIT",
          "UPDATE",
          "METRIC",
          "HANDOFF"
        ],
        "accessPatterns": [
          "Load one incident with all response records",
          "List open incidents by severity",
          "Find response tasks due within the next SLA window",
          "Export an executive handoff packet without scanning the table"
        ]
      },
      "architectureQueries": [
        {
          "name": "Incident packet",
          "query": "PK = CASE#CASE-2026-0619-03",
          "reason": "Loads case, evidence, tasks, audit, updates, metrics, and handoff in one partition"
        },
        {
          "name": "Open severity queue",
          "query": "GSI1PK = OPEN#MEDIUM",
          "reason": "Ranks active incidents for command-center triage"
        },
        {
          "name": "Owner due work",
          "query": "GSI2PK = OWNER#Data governance",
          "reason": "Finds response tasks and accountable handoffs without table scans"
        }
      ],
      "storagePlan": {
        "adapter": "local-memory",
        "liveAdapterTarget": "aws-dynamodb",
        "tableName": "IncidentZeroCases",
        "recordCount": 20,
        "entityCounts": {
          "CASE": 1,
          "ALERT": 1,
          "EVIDENCE": 3,
          "TASK": 5,
          "AUDIT": 5,
          "UPDATE": 3,
          "METRIC": 1,
          "HANDOFF": 1
        },
        "writeStrategy": "Batch write incident packet by PK/SK, then append audit and evidence events as immutable records",
        "readStrategy": "Load one incident by PK; use GSI1 for active severity queue and GSI2 for owner due work",
        "safety": {
          "noCredentialsInCode": true,
          "noSecretsStored": true,
          "accountOwnerProvisioningRequired": true
        }
      },
      "handoff": {
        "filename": "case-2026-0619-03-handoff.md",
        "summary": "MEDIUM Unusual data export from analyst workspace: risk 64/100, containment pending, 3 evidence records, 5 open response tasks.",
        "nextUpdateAt": "2026-06-19T07:06:12.000Z",
        "markdown": "# CASE-2026-0619-03 Executive Handoff\n\n## Executive Summary\n\nMEDIUM Unusual data export from analyst workspace: risk 64/100, containment pending, 3 evidence records, 5 open response tasks.\n\n## Current Scope\n\n- System: analytics-workspace\n- Owner: Data governance\n- Affected scope: 5\n- Customer impact: no\n- Estimated exposure: $0\n\n## Evidence\n\n- pending-review (61%): Export volume exceeded analyst baseline by 9x\n- weak-signal (54%): Query touched regulated-data views\n- weak-signal (47%): Destination bucket was newly created and has no owner tag\n\n## Open Actions\n\n- [ready] Data governance: Confirm blast radius for analytics-workspace and assign one incident commander\n- [queued] Platform owner: Freeze risky path on analytics-workspace until evidence is preserved\n- [ready] Detection engineer: Write source logs, analyst notes, and decision markers into immutable evidence records\n- [queued] Internal comms: Prepare internal status update for leadership channel\n- [drafted] Incident commander: Generate executive handoff with decisions, open risks, and database-backed timeline\n\n## Next Update\n\nStakeholder update: 2026-06-19T07:06:12.000Z"
      },
      "gates": {
        "noSecretsStored": true,
        "localPrototypeReady": true,
        "liveAwsDatabaseClaimed": false,
        "vercelDeploymentClaimed": false,
        "awsScreenshotRequired": true,
        "devpostFinalSubmitRequired": true
      }
    }
  },
  "demoSteps": [
    {
      "caseId": "CASE-2026-0612-01",
      "alert": {
        "id": "identity",
        "name": "Privileged Identity",
        "caseId": "CASE-2026-0612-01",
        "title": "Privileged token anomaly",
        "severity": "critical",
        "source": "cloud-idp",
        "detectedAt": "2026-06-12T08:21:09Z",
        "owner": "Identity response",
        "impactedSystem": "build-prod-runner",
        "impactedUsers": 12,
        "customerImpact": true,
        "contained": false,
        "evidenceConfidence": 58,
        "revenueAtRiskUsd": 3200,
        "signals": [
          "Token used from previously unseen ASN",
          "Admin API call followed by audit-log export",
          "CI runner assumed production deploy role outside release window"
        ],
        "scenarioId": "identity"
      },
      "risk": 100,
      "windows": [
        {
          "label": "Triage",
          "dueMinutes": 10,
          "dueAt": "2026-06-12T08:31:09.000Z"
        },
        {
          "label": "Contain",
          "dueMinutes": 30,
          "dueAt": "2026-06-12T08:51:09.000Z"
        },
        {
          "label": "Stakeholder update",
          "dueMinutes": 30,
          "dueAt": "2026-06-12T08:51:09.000Z"
        },
        {
          "label": "Executive handoff",
          "dueMinutes": 120,
          "dueAt": "2026-06-12T10:21:09.000Z"
        }
      ],
      "metrics": [
        {
          "label": "Risk",
          "value": "100/100",
          "detail": "containment still open"
        },
        {
          "label": "SLA windows",
          "value": "4",
          "detail": "triage, containment, update, handoff"
        },
        {
          "label": "Evidence",
          "value": "3",
          "detail": "51% avg confidence"
        },
        {
          "label": "Records",
          "value": "20",
          "detail": "single-table DynamoDB-shaped entities"
        },
        {
          "label": "Ready tasks",
          "value": "3",
          "detail": "immediately actionable response work"
        }
      ],
      "tasks": [
        {
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Identity response",
          "status": "ready",
          "dueAt": "2026-06-12T08:31:09.000Z",
          "action": "Confirm blast radius for build-prod-runner and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded"
        },
        {
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Freeze risky path on build-prod-runner until evidence is preserved",
          "acceptance": "Containment action is reversible, logged, and linked to evidence"
        },
        {
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp"
        },
        {
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns"
        },
        {
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-12T10:21:09.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history"
        }
      ],
      "evidence": [
        {
          "id": "evidence-001",
          "source": "cloud-idp",
          "status": "pending-review",
          "confidence": 58,
          "detail": "Token used from previously unseen ASN",
          "integrityHash": "b0e25f04"
        },
        {
          "id": "evidence-002",
          "source": "cloud-idp",
          "status": "weak-signal",
          "confidence": 51,
          "detail": "Admin API call followed by audit-log export",
          "integrityHash": "dd110c6c"
        },
        {
          "id": "evidence-003",
          "source": "cloud-idp",
          "status": "weak-signal",
          "confidence": 44,
          "detail": "CI runner assumed production deploy role outside release window",
          "integrityHash": "2b018981"
        }
      ],
      "audit": [
        {
          "at": "2026-06-12T08:21:09Z",
          "event": "alert_ingested",
          "actor": "cloud-idp",
          "detail": "cloud-idp generated CASE-2026-0612-01"
        },
        {
          "at": "2026-06-12T08:23:09.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "at": "2026-06-12T08:29:09.000Z",
          "event": "risk_scored",
          "actor": "Identity response",
          "detail": "Risk score computed as 100/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "at": "2026-06-12T08:39:09.000Z",
          "event": "containment_planned",
          "actor": "Platform owner",
          "detail": "Containment task is ready with reversible action and evidence requirement"
        },
        {
          "at": "2026-06-12T08:51:09.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        }
      ],
      "updates": [
        {
          "audience": "Responder channel",
          "tone": "operational",
          "message": "CRITICAL Privileged token anomaly. Identity response owns triage. Current risk 100/100. Next checkpoint 2026-06-12T08:51:09.000Z."
        },
        {
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting build-prod-runner. Mitigation is in progress; next update is scheduled."
        },
        {
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "12 users or internal actors in scope, 3 evidence signals, $3,200 estimated exposure."
        }
      ],
      "records": [
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "CASE#META",
          "entity": "CASE",
          "title": "Privileged token anomaly",
          "severity": "critical",
          "owner": "Identity response",
          "risk": 100,
          "status": "active",
          "GSI1PK": "OPEN#CRITICAL",
          "GSI1SK": "2026-06-12T08:21:09Z",
          "GSI2PK": "OWNER#Identity response",
          "GSI2SK": "RISK#000"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "ALERT#2026-06-12T08:21:09Z",
          "entity": "ALERT",
          "source": "cloud-idp",
          "impactedSystem": "build-prod-runner",
          "impactedUsers": 12,
          "customerImpact": true
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-001",
          "entity": "EVIDENCE",
          "id": "evidence-001",
          "source": "cloud-idp",
          "status": "pending-review",
          "confidence": 58,
          "detail": "Token used from previously unseen ASN",
          "integrityHash": "b0e25f04"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-002",
          "entity": "EVIDENCE",
          "id": "evidence-002",
          "source": "cloud-idp",
          "status": "weak-signal",
          "confidence": 51,
          "detail": "Admin API call followed by audit-log export",
          "integrityHash": "dd110c6c"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-003",
          "entity": "EVIDENCE",
          "id": "evidence-003",
          "source": "cloud-idp",
          "status": "weak-signal",
          "confidence": 44,
          "detail": "CI runner assumed production deploy role outside release window",
          "integrityHash": "2b018981"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-triage",
          "entity": "TASK",
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Identity response",
          "status": "ready",
          "dueAt": "2026-06-12T08:31:09.000Z",
          "action": "Confirm blast radius for build-prod-runner and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded",
          "GSI2PK": "OWNER#Identity response",
          "GSI2SK": "DUE#2026-06-12T08:31:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-contain-primary",
          "entity": "TASK",
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Freeze risky path on build-prod-runner until evidence is preserved",
          "acceptance": "Containment action is reversible, logged, and linked to evidence",
          "GSI2PK": "OWNER#Platform owner",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-preserve-evidence",
          "entity": "TASK",
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp",
          "GSI2PK": "OWNER#Detection engineer",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-stakeholder-update",
          "entity": "TASK",
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns",
          "GSI2PK": "OWNER#Customer lead",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-handoff",
          "entity": "TASK",
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-12T10:21:09.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history",
          "GSI2PK": "OWNER#Incident commander",
          "GSI2SK": "DUE#2026-06-12T10:21:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:21:09Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:21:09Z",
          "event": "alert_ingested",
          "actor": "cloud-idp",
          "detail": "cloud-idp generated CASE-2026-0612-01"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:23:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:23:09.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:29:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:29:09.000Z",
          "event": "risk_scored",
          "actor": "Identity response",
          "detail": "Risk score computed as 100/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:39:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:39:09.000Z",
          "event": "containment_planned",
          "actor": "Platform owner",
          "detail": "Containment task is ready with reversible action and evidence requirement"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:51:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:51:09.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#01",
          "entity": "UPDATE",
          "audience": "Responder channel",
          "tone": "operational",
          "message": "CRITICAL Privileged token anomaly. Identity response owns triage. Current risk 100/100. Next checkpoint 2026-06-12T08:51:09.000Z."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#02",
          "entity": "UPDATE",
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting build-prod-runner. Mitigation is in progress; next update is scheduled."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#03",
          "entity": "UPDATE",
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "12 users or internal actors in scope, 3 evidence signals, $3,200 estimated exposure."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "METRIC#CURRENT",
          "entity": "METRIC",
          "risk": 100,
          "evidenceConfidence": 58,
          "revenueAtRiskUsd": 3200,
          "affectedScope": 12
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "HANDOFF#EXECUTIVE",
          "entity": "HANDOFF",
          "summary": "CRITICAL Privileged token anomaly: 100/100 risk, 3 evidence records, 5 response tasks, containment pending."
        }
      ],
      "schema": {
        "tableName": "IncidentZeroCases",
        "partitionKey": "PK",
        "sortKey": "SK",
        "indexes": [
          {
            "name": "GSI1",
            "partitionKey": "GSI1PK",
            "sortKey": "GSI1SK",
            "purpose": "Query active incidents by severity and updated time"
          },
          {
            "name": "GSI2",
            "partitionKey": "GSI2PK",
            "sortKey": "GSI2SK",
            "purpose": "Query owner workload, due tasks, and handoff readiness"
          }
        ],
        "entities": [
          "CASE",
          "ALERT",
          "EVIDENCE",
          "TASK",
          "AUDIT",
          "UPDATE",
          "METRIC",
          "HANDOFF"
        ],
        "accessPatterns": [
          "Load one incident with all response records",
          "List open incidents by severity",
          "Find response tasks due within the next SLA window",
          "Export an executive handoff packet without scanning the table"
        ]
      },
      "architectureQueries": [
        {
          "name": "Incident packet",
          "query": "PK = CASE#CASE-2026-0612-01",
          "reason": "Loads case, evidence, tasks, audit, updates, metrics, and handoff in one partition"
        },
        {
          "name": "Open severity queue",
          "query": "GSI1PK = OPEN#CRITICAL",
          "reason": "Ranks active incidents for command-center triage"
        },
        {
          "name": "Owner due work",
          "query": "GSI2PK = OWNER#Identity response",
          "reason": "Finds response tasks and accountable handoffs without table scans"
        }
      ],
      "storagePlan": {
        "adapter": "local-memory",
        "liveAdapterTarget": "aws-dynamodb",
        "tableName": "IncidentZeroCases",
        "recordCount": 20,
        "entityCounts": {
          "CASE": 1,
          "ALERT": 1,
          "EVIDENCE": 3,
          "TASK": 5,
          "AUDIT": 5,
          "UPDATE": 3,
          "METRIC": 1,
          "HANDOFF": 1
        },
        "writeStrategy": "Batch write incident packet by PK/SK, then append audit and evidence events as immutable records",
        "readStrategy": "Load one incident by PK; use GSI1 for active severity queue and GSI2 for owner due work",
        "safety": {
          "noCredentialsInCode": true,
          "noSecretsStored": true,
          "accountOwnerProvisioningRequired": true
        }
      },
      "handoff": {
        "filename": "case-2026-0612-01-handoff.md",
        "summary": "CRITICAL Privileged token anomaly: risk 100/100, containment pending, 3 evidence records, 5 open response tasks.",
        "nextUpdateAt": "2026-06-12T08:51:09.000Z",
        "markdown": "# CASE-2026-0612-01 Executive Handoff\n\n## Executive Summary\n\nCRITICAL Privileged token anomaly: risk 100/100, containment pending, 3 evidence records, 5 open response tasks.\n\n## Current Scope\n\n- System: build-prod-runner\n- Owner: Identity response\n- Affected scope: 12\n- Customer impact: yes\n- Estimated exposure: $3,200\n\n## Evidence\n\n- pending-review (58%): Token used from previously unseen ASN\n- weak-signal (51%): Admin API call followed by audit-log export\n- weak-signal (44%): CI runner assumed production deploy role outside release window\n\n## Open Actions\n\n- [ready] Identity response: Confirm blast radius for build-prod-runner and assign one incident commander\n- [ready] Platform owner: Freeze risky path on build-prod-runner until evidence is preserved\n- [ready] Detection engineer: Write source logs, analyst notes, and decision markers into immutable evidence records\n- [drafted] Customer lead: Draft customer-safe update without exposing investigation details\n- [drafted] Incident commander: Generate executive handoff with decisions, open risks, and database-backed timeline\n\n## Next Update\n\nStakeholder update: 2026-06-12T08:51:09.000Z"
      },
      "gates": {
        "noSecretsStored": true,
        "localPrototypeReady": true,
        "liveAwsDatabaseClaimed": false,
        "vercelDeploymentClaimed": false,
        "awsScreenshotRequired": true,
        "devpostFinalSubmitRequired": true
      }
    },
    {
      "caseId": "CASE-2026-0612-01",
      "alert": {
        "id": "identity",
        "name": "Privileged Identity",
        "caseId": "CASE-2026-0612-01",
        "title": "Privileged token anomaly",
        "severity": "critical",
        "source": "cloud-idp",
        "detectedAt": "2026-06-12T08:21:09Z",
        "owner": "Identity response",
        "impactedSystem": "build-prod-runner",
        "impactedUsers": 48,
        "customerImpact": true,
        "contained": false,
        "evidenceConfidence": 89,
        "revenueAtRiskUsd": 12400,
        "signals": [
          "Token used from previously unseen ASN",
          "Admin API call followed by audit-log export",
          "CI runner assumed production deploy role outside release window"
        ],
        "scenarioId": "identity"
      },
      "risk": 100,
      "windows": [
        {
          "label": "Triage",
          "dueMinutes": 10,
          "dueAt": "2026-06-12T08:31:09.000Z"
        },
        {
          "label": "Contain",
          "dueMinutes": 30,
          "dueAt": "2026-06-12T08:51:09.000Z"
        },
        {
          "label": "Stakeholder update",
          "dueMinutes": 30,
          "dueAt": "2026-06-12T08:51:09.000Z"
        },
        {
          "label": "Executive handoff",
          "dueMinutes": 120,
          "dueAt": "2026-06-12T10:21:09.000Z"
        }
      ],
      "metrics": [
        {
          "label": "Risk",
          "value": "100/100",
          "detail": "containment still open"
        },
        {
          "label": "SLA windows",
          "value": "4",
          "detail": "triage, containment, update, handoff"
        },
        {
          "label": "Evidence",
          "value": "3",
          "detail": "82% avg confidence"
        },
        {
          "label": "Records",
          "value": "20",
          "detail": "single-table DynamoDB-shaped entities"
        },
        {
          "label": "Ready tasks",
          "value": "3",
          "detail": "immediately actionable response work"
        }
      ],
      "tasks": [
        {
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Identity response",
          "status": "ready",
          "dueAt": "2026-06-12T08:31:09.000Z",
          "action": "Confirm blast radius for build-prod-runner and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded"
        },
        {
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Freeze risky path on build-prod-runner until evidence is preserved",
          "acceptance": "Containment action is reversible, logged, and linked to evidence"
        },
        {
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp"
        },
        {
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns"
        },
        {
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-12T10:21:09.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history"
        }
      ],
      "evidence": [
        {
          "id": "evidence-001",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 89,
          "detail": "Token used from previously unseen ASN",
          "integrityHash": "2dc74d4e"
        },
        {
          "id": "evidence-002",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 82,
          "detail": "Admin API call followed by audit-log export",
          "integrityHash": "6e18ac74"
        },
        {
          "id": "evidence-003",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 75,
          "detail": "CI runner assumed production deploy role outside release window",
          "integrityHash": "9a0476d5"
        }
      ],
      "audit": [
        {
          "at": "2026-06-12T08:21:09Z",
          "event": "alert_ingested",
          "actor": "cloud-idp",
          "detail": "cloud-idp generated CASE-2026-0612-01"
        },
        {
          "at": "2026-06-12T08:23:09.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "at": "2026-06-12T08:29:09.000Z",
          "event": "risk_scored",
          "actor": "Identity response",
          "detail": "Risk score computed as 100/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "at": "2026-06-12T08:39:09.000Z",
          "event": "containment_planned",
          "actor": "Platform owner",
          "detail": "Containment task is ready with reversible action and evidence requirement"
        },
        {
          "at": "2026-06-12T08:51:09.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        }
      ],
      "updates": [
        {
          "audience": "Responder channel",
          "tone": "operational",
          "message": "CRITICAL Privileged token anomaly. Identity response owns triage. Current risk 100/100. Next checkpoint 2026-06-12T08:51:09.000Z."
        },
        {
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting build-prod-runner. Mitigation is in progress; next update is scheduled."
        },
        {
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "48 users or internal actors in scope, 3 evidence signals, $12,400 estimated exposure."
        }
      ],
      "records": [
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "CASE#META",
          "entity": "CASE",
          "title": "Privileged token anomaly",
          "severity": "critical",
          "owner": "Identity response",
          "risk": 100,
          "status": "active",
          "GSI1PK": "OPEN#CRITICAL",
          "GSI1SK": "2026-06-12T08:21:09Z",
          "GSI2PK": "OWNER#Identity response",
          "GSI2SK": "RISK#000"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "ALERT#2026-06-12T08:21:09Z",
          "entity": "ALERT",
          "source": "cloud-idp",
          "impactedSystem": "build-prod-runner",
          "impactedUsers": 48,
          "customerImpact": true
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-001",
          "entity": "EVIDENCE",
          "id": "evidence-001",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 89,
          "detail": "Token used from previously unseen ASN",
          "integrityHash": "2dc74d4e"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-002",
          "entity": "EVIDENCE",
          "id": "evidence-002",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 82,
          "detail": "Admin API call followed by audit-log export",
          "integrityHash": "6e18ac74"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-003",
          "entity": "EVIDENCE",
          "id": "evidence-003",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 75,
          "detail": "CI runner assumed production deploy role outside release window",
          "integrityHash": "9a0476d5"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-triage",
          "entity": "TASK",
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Identity response",
          "status": "ready",
          "dueAt": "2026-06-12T08:31:09.000Z",
          "action": "Confirm blast radius for build-prod-runner and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded",
          "GSI2PK": "OWNER#Identity response",
          "GSI2SK": "DUE#2026-06-12T08:31:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-contain-primary",
          "entity": "TASK",
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Freeze risky path on build-prod-runner until evidence is preserved",
          "acceptance": "Containment action is reversible, logged, and linked to evidence",
          "GSI2PK": "OWNER#Platform owner",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-preserve-evidence",
          "entity": "TASK",
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp",
          "GSI2PK": "OWNER#Detection engineer",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-stakeholder-update",
          "entity": "TASK",
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns",
          "GSI2PK": "OWNER#Customer lead",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-handoff",
          "entity": "TASK",
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-12T10:21:09.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history",
          "GSI2PK": "OWNER#Incident commander",
          "GSI2SK": "DUE#2026-06-12T10:21:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:21:09Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:21:09Z",
          "event": "alert_ingested",
          "actor": "cloud-idp",
          "detail": "cloud-idp generated CASE-2026-0612-01"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:23:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:23:09.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:29:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:29:09.000Z",
          "event": "risk_scored",
          "actor": "Identity response",
          "detail": "Risk score computed as 100/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:39:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:39:09.000Z",
          "event": "containment_planned",
          "actor": "Platform owner",
          "detail": "Containment task is ready with reversible action and evidence requirement"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:51:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:51:09.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#01",
          "entity": "UPDATE",
          "audience": "Responder channel",
          "tone": "operational",
          "message": "CRITICAL Privileged token anomaly. Identity response owns triage. Current risk 100/100. Next checkpoint 2026-06-12T08:51:09.000Z."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#02",
          "entity": "UPDATE",
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting build-prod-runner. Mitigation is in progress; next update is scheduled."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#03",
          "entity": "UPDATE",
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "48 users or internal actors in scope, 3 evidence signals, $12,400 estimated exposure."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "METRIC#CURRENT",
          "entity": "METRIC",
          "risk": 100,
          "evidenceConfidence": 89,
          "revenueAtRiskUsd": 12400,
          "affectedScope": 48
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "HANDOFF#EXECUTIVE",
          "entity": "HANDOFF",
          "summary": "CRITICAL Privileged token anomaly: 100/100 risk, 3 evidence records, 5 response tasks, containment pending."
        }
      ],
      "schema": {
        "tableName": "IncidentZeroCases",
        "partitionKey": "PK",
        "sortKey": "SK",
        "indexes": [
          {
            "name": "GSI1",
            "partitionKey": "GSI1PK",
            "sortKey": "GSI1SK",
            "purpose": "Query active incidents by severity and updated time"
          },
          {
            "name": "GSI2",
            "partitionKey": "GSI2PK",
            "sortKey": "GSI2SK",
            "purpose": "Query owner workload, due tasks, and handoff readiness"
          }
        ],
        "entities": [
          "CASE",
          "ALERT",
          "EVIDENCE",
          "TASK",
          "AUDIT",
          "UPDATE",
          "METRIC",
          "HANDOFF"
        ],
        "accessPatterns": [
          "Load one incident with all response records",
          "List open incidents by severity",
          "Find response tasks due within the next SLA window",
          "Export an executive handoff packet without scanning the table"
        ]
      },
      "architectureQueries": [
        {
          "name": "Incident packet",
          "query": "PK = CASE#CASE-2026-0612-01",
          "reason": "Loads case, evidence, tasks, audit, updates, metrics, and handoff in one partition"
        },
        {
          "name": "Open severity queue",
          "query": "GSI1PK = OPEN#CRITICAL",
          "reason": "Ranks active incidents for command-center triage"
        },
        {
          "name": "Owner due work",
          "query": "GSI2PK = OWNER#Identity response",
          "reason": "Finds response tasks and accountable handoffs without table scans"
        }
      ],
      "storagePlan": {
        "adapter": "local-memory",
        "liveAdapterTarget": "aws-dynamodb",
        "tableName": "IncidentZeroCases",
        "recordCount": 20,
        "entityCounts": {
          "CASE": 1,
          "ALERT": 1,
          "EVIDENCE": 3,
          "TASK": 5,
          "AUDIT": 5,
          "UPDATE": 3,
          "METRIC": 1,
          "HANDOFF": 1
        },
        "writeStrategy": "Batch write incident packet by PK/SK, then append audit and evidence events as immutable records",
        "readStrategy": "Load one incident by PK; use GSI1 for active severity queue and GSI2 for owner due work",
        "safety": {
          "noCredentialsInCode": true,
          "noSecretsStored": true,
          "accountOwnerProvisioningRequired": true
        }
      },
      "handoff": {
        "filename": "case-2026-0612-01-handoff.md",
        "summary": "CRITICAL Privileged token anomaly: risk 100/100, containment pending, 3 evidence records, 5 open response tasks.",
        "nextUpdateAt": "2026-06-12T08:51:09.000Z",
        "markdown": "# CASE-2026-0612-01 Executive Handoff\n\n## Executive Summary\n\nCRITICAL Privileged token anomaly: risk 100/100, containment pending, 3 evidence records, 5 open response tasks.\n\n## Current Scope\n\n- System: build-prod-runner\n- Owner: Identity response\n- Affected scope: 48\n- Customer impact: yes\n- Estimated exposure: $12,400\n\n## Evidence\n\n- corroborated (89%): Token used from previously unseen ASN\n- corroborated (82%): Admin API call followed by audit-log export\n- corroborated (75%): CI runner assumed production deploy role outside release window\n\n## Open Actions\n\n- [ready] Identity response: Confirm blast radius for build-prod-runner and assign one incident commander\n- [ready] Platform owner: Freeze risky path on build-prod-runner until evidence is preserved\n- [ready] Detection engineer: Write source logs, analyst notes, and decision markers into immutable evidence records\n- [drafted] Customer lead: Draft customer-safe update without exposing investigation details\n- [drafted] Incident commander: Generate executive handoff with decisions, open risks, and database-backed timeline\n\n## Next Update\n\nStakeholder update: 2026-06-12T08:51:09.000Z"
      },
      "gates": {
        "noSecretsStored": true,
        "localPrototypeReady": true,
        "liveAwsDatabaseClaimed": false,
        "vercelDeploymentClaimed": false,
        "awsScreenshotRequired": true,
        "devpostFinalSubmitRequired": true
      }
    },
    {
      "caseId": "CASE-2026-0612-01",
      "alert": {
        "id": "identity",
        "name": "Privileged Identity",
        "caseId": "CASE-2026-0612-01",
        "title": "Privileged token anomaly",
        "severity": "critical",
        "source": "cloud-idp",
        "detectedAt": "2026-06-12T08:21:09Z",
        "owner": "Identity response",
        "impactedSystem": "build-prod-runner",
        "impactedUsers": 48,
        "customerImpact": true,
        "contained": true,
        "evidenceConfidence": 94,
        "revenueAtRiskUsd": 12400,
        "signals": [
          "Token used from previously unseen ASN",
          "Admin API call followed by audit-log export",
          "CI runner assumed production deploy role outside release window"
        ],
        "scenarioId": "identity"
      },
      "risk": 100,
      "windows": [
        {
          "label": "Triage",
          "dueMinutes": 10,
          "dueAt": "2026-06-12T08:31:09.000Z"
        },
        {
          "label": "Contain",
          "dueMinutes": 30,
          "dueAt": "2026-06-12T08:51:09.000Z"
        },
        {
          "label": "Stakeholder update",
          "dueMinutes": 30,
          "dueAt": "2026-06-12T08:51:09.000Z"
        },
        {
          "label": "Executive handoff",
          "dueMinutes": 120,
          "dueAt": "2026-06-12T10:21:09.000Z"
        }
      ],
      "metrics": [
        {
          "label": "Risk",
          "value": "100/100",
          "detail": "contained path discount applied"
        },
        {
          "label": "SLA windows",
          "value": "4",
          "detail": "triage, containment, update, handoff"
        },
        {
          "label": "Evidence",
          "value": "3",
          "detail": "87% avg confidence"
        },
        {
          "label": "Records",
          "value": "20",
          "detail": "single-table DynamoDB-shaped entities"
        },
        {
          "label": "Ready tasks",
          "value": "2",
          "detail": "immediately actionable response work"
        }
      ],
      "tasks": [
        {
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Identity response",
          "status": "ready",
          "dueAt": "2026-06-12T08:31:09.000Z",
          "action": "Confirm blast radius for build-prod-runner and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded"
        },
        {
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "complete",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Validate containment and watch for recurrence",
          "acceptance": "Containment action is reversible, logged, and linked to evidence"
        },
        {
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp"
        },
        {
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns"
        },
        {
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-12T10:21:09.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history"
        }
      ],
      "evidence": [
        {
          "id": "evidence-001",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 94,
          "detail": "Token used from previously unseen ASN",
          "integrityHash": "a4c4370c"
        },
        {
          "id": "evidence-002",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 87,
          "detail": "Admin API call followed by audit-log export",
          "integrityHash": "6b18a7bb"
        },
        {
          "id": "evidence-003",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 80,
          "detail": "CI runner assumed production deploy role outside release window",
          "integrityHash": "a70b4711"
        }
      ],
      "audit": [
        {
          "at": "2026-06-12T08:21:09Z",
          "event": "alert_ingested",
          "actor": "cloud-idp",
          "detail": "cloud-idp generated CASE-2026-0612-01"
        },
        {
          "at": "2026-06-12T08:23:09.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "at": "2026-06-12T08:29:09.000Z",
          "event": "risk_scored",
          "actor": "Identity response",
          "detail": "Risk score computed as 100/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "at": "2026-06-12T08:39:09.000Z",
          "event": "containment_verified",
          "actor": "Platform owner",
          "detail": "Primary risky path is already contained and under watch"
        },
        {
          "at": "2026-06-12T08:51:09.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        }
      ],
      "updates": [
        {
          "audience": "Responder channel",
          "tone": "operational",
          "message": "CRITICAL Privileged token anomaly. Identity response owns triage. Current risk 100/100. Next checkpoint 2026-06-12T08:51:09.000Z."
        },
        {
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting build-prod-runner. Mitigation is in place; next update is scheduled."
        },
        {
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "48 users or internal actors in scope, 3 evidence signals, $12,400 estimated exposure."
        }
      ],
      "records": [
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "CASE#META",
          "entity": "CASE",
          "title": "Privileged token anomaly",
          "severity": "critical",
          "owner": "Identity response",
          "risk": 100,
          "status": "contained",
          "GSI1PK": "CONTAINED#CRITICAL",
          "GSI1SK": "2026-06-12T08:21:09Z",
          "GSI2PK": "OWNER#Identity response",
          "GSI2SK": "RISK#000"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "ALERT#2026-06-12T08:21:09Z",
          "entity": "ALERT",
          "source": "cloud-idp",
          "impactedSystem": "build-prod-runner",
          "impactedUsers": 48,
          "customerImpact": true
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-001",
          "entity": "EVIDENCE",
          "id": "evidence-001",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 94,
          "detail": "Token used from previously unseen ASN",
          "integrityHash": "a4c4370c"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-002",
          "entity": "EVIDENCE",
          "id": "evidence-002",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 87,
          "detail": "Admin API call followed by audit-log export",
          "integrityHash": "6b18a7bb"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "EVIDENCE#evidence-003",
          "entity": "EVIDENCE",
          "id": "evidence-003",
          "source": "cloud-idp",
          "status": "corroborated",
          "confidence": 80,
          "detail": "CI runner assumed production deploy role outside release window",
          "integrityHash": "a70b4711"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-triage",
          "entity": "TASK",
          "id": "task-triage",
          "stage": "Triage",
          "owner": "Identity response",
          "status": "ready",
          "dueAt": "2026-06-12T08:31:09.000Z",
          "action": "Confirm blast radius for build-prod-runner and assign one incident commander",
          "acceptance": "Owner, affected service, severity, and next update time are recorded",
          "GSI2PK": "OWNER#Identity response",
          "GSI2SK": "DUE#2026-06-12T08:31:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-contain-primary",
          "entity": "TASK",
          "id": "task-contain-primary",
          "stage": "Contain",
          "owner": "Platform owner",
          "status": "complete",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Validate containment and watch for recurrence",
          "acceptance": "Containment action is reversible, logged, and linked to evidence",
          "GSI2PK": "OWNER#Platform owner",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-preserve-evidence",
          "entity": "TASK",
          "id": "task-preserve-evidence",
          "stage": "Evidence",
          "owner": "Detection engineer",
          "status": "ready",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Write source logs, analyst notes, and decision markers into immutable evidence records",
          "acceptance": "Each signal has source, confidence, status, and audit timestamp",
          "GSI2PK": "OWNER#Detection engineer",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-stakeholder-update",
          "entity": "TASK",
          "id": "task-stakeholder-update",
          "stage": "Communicate",
          "owner": "Customer lead",
          "status": "drafted",
          "dueAt": "2026-06-12T08:51:09.000Z",
          "action": "Draft customer-safe update without exposing investigation details",
          "acceptance": "Message states impact, current mitigation, next update, and unknowns",
          "GSI2PK": "OWNER#Customer lead",
          "GSI2SK": "DUE#2026-06-12T08:51:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "TASK#task-handoff",
          "entity": "TASK",
          "id": "task-handoff",
          "stage": "Handoff",
          "owner": "Incident commander",
          "status": "drafted",
          "dueAt": "2026-06-12T10:21:09.000Z",
          "action": "Generate executive handoff with decisions, open risks, and database-backed timeline",
          "acceptance": "Handoff can be exported without scanning or reassembling chat history",
          "GSI2PK": "OWNER#Incident commander",
          "GSI2SK": "DUE#2026-06-12T10:21:09.000Z"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:21:09Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:21:09Z",
          "event": "alert_ingested",
          "actor": "cloud-idp",
          "detail": "cloud-idp generated CASE-2026-0612-01"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:23:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:23:09.000Z",
          "event": "case_opened",
          "actor": "Incident Zero",
          "detail": "Owner map, SLA clock, and evidence ledger created"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:29:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:29:09.000Z",
          "event": "risk_scored",
          "actor": "Identity response",
          "detail": "Risk score computed as 100/100 from severity, confidence, blast radius, and containment state"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:39:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:39:09.000Z",
          "event": "containment_verified",
          "actor": "Platform owner",
          "detail": "Primary risky path is already contained and under watch"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "AUDIT#2026-06-12T08:51:09.000Z",
          "entity": "AUDIT",
          "at": "2026-06-12T08:51:09.000Z",
          "event": "handoff_drafted",
          "actor": "Incident commander",
          "detail": "Executive summary, stakeholder update, and open risks generated from case records"
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#01",
          "entity": "UPDATE",
          "audience": "Responder channel",
          "tone": "operational",
          "message": "CRITICAL Privileged token anomaly. Identity response owns triage. Current risk 100/100. Next checkpoint 2026-06-12T08:51:09.000Z."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#02",
          "entity": "UPDATE",
          "audience": "Customer-facing lead",
          "tone": "customer-safe",
          "message": "We are investigating an issue affecting build-prod-runner. Mitigation is in place; next update is scheduled."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "UPDATE#03",
          "entity": "UPDATE",
          "audience": "Executive handoff",
          "tone": "brief",
          "message": "48 users or internal actors in scope, 3 evidence signals, $12,400 estimated exposure."
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "METRIC#CURRENT",
          "entity": "METRIC",
          "risk": 100,
          "evidenceConfidence": 94,
          "revenueAtRiskUsd": 12400,
          "affectedScope": 48
        },
        {
          "PK": "CASE#CASE-2026-0612-01",
          "SK": "HANDOFF#EXECUTIVE",
          "entity": "HANDOFF",
          "summary": "CRITICAL Privileged token anomaly: 100/100 risk, 3 evidence records, 5 response tasks, contained."
        }
      ],
      "schema": {
        "tableName": "IncidentZeroCases",
        "partitionKey": "PK",
        "sortKey": "SK",
        "indexes": [
          {
            "name": "GSI1",
            "partitionKey": "GSI1PK",
            "sortKey": "GSI1SK",
            "purpose": "Query active incidents by severity and updated time"
          },
          {
            "name": "GSI2",
            "partitionKey": "GSI2PK",
            "sortKey": "GSI2SK",
            "purpose": "Query owner workload, due tasks, and handoff readiness"
          }
        ],
        "entities": [
          "CASE",
          "ALERT",
          "EVIDENCE",
          "TASK",
          "AUDIT",
          "UPDATE",
          "METRIC",
          "HANDOFF"
        ],
        "accessPatterns": [
          "Load one incident with all response records",
          "List open incidents by severity",
          "Find response tasks due within the next SLA window",
          "Export an executive handoff packet without scanning the table"
        ]
      },
      "architectureQueries": [
        {
          "name": "Incident packet",
          "query": "PK = CASE#CASE-2026-0612-01",
          "reason": "Loads case, evidence, tasks, audit, updates, metrics, and handoff in one partition"
        },
        {
          "name": "Open severity queue",
          "query": "GSI1PK = OPEN#CRITICAL",
          "reason": "Ranks active incidents for command-center triage"
        },
        {
          "name": "Owner due work",
          "query": "GSI2PK = OWNER#Identity response",
          "reason": "Finds response tasks and accountable handoffs without table scans"
        }
      ],
      "storagePlan": {
        "adapter": "local-memory",
        "liveAdapterTarget": "aws-dynamodb",
        "tableName": "IncidentZeroCases",
        "recordCount": 20,
        "entityCounts": {
          "CASE": 1,
          "ALERT": 1,
          "EVIDENCE": 3,
          "TASK": 5,
          "AUDIT": 5,
          "UPDATE": 3,
          "METRIC": 1,
          "HANDOFF": 1
        },
        "writeStrategy": "Batch write incident packet by PK/SK, then append audit and evidence events as immutable records",
        "readStrategy": "Load one incident by PK; use GSI1 for active severity queue and GSI2 for owner due work",
        "safety": {
          "noCredentialsInCode": true,
          "noSecretsStored": true,
          "accountOwnerProvisioningRequired": true
        }
      },
      "handoff": {
        "filename": "case-2026-0612-01-handoff.md",
        "summary": "CRITICAL Privileged token anomaly: risk 100/100, contained, 3 evidence records, 4 open response tasks.",
        "nextUpdateAt": "2026-06-12T08:51:09.000Z",
        "markdown": "# CASE-2026-0612-01 Executive Handoff\n\n## Executive Summary\n\nCRITICAL Privileged token anomaly: risk 100/100, contained, 3 evidence records, 4 open response tasks.\n\n## Current Scope\n\n- System: build-prod-runner\n- Owner: Identity response\n- Affected scope: 48\n- Customer impact: yes\n- Estimated exposure: $12,400\n\n## Evidence\n\n- corroborated (94%): Token used from previously unseen ASN\n- corroborated (87%): Admin API call followed by audit-log export\n- corroborated (80%): CI runner assumed production deploy role outside release window\n\n## Open Actions\n\n- [ready] Identity response: Confirm blast radius for build-prod-runner and assign one incident commander\n- [ready] Detection engineer: Write source logs, analyst notes, and decision markers into immutable evidence records\n- [drafted] Customer lead: Draft customer-safe update without exposing investigation details\n- [drafted] Incident commander: Generate executive handoff with decisions, open risks, and database-backed timeline\n\n## Next Update\n\nStakeholder update: 2026-06-12T08:51:09.000Z"
      },
      "gates": {
        "noSecretsStored": true,
        "localPrototypeReady": true,
        "liveAwsDatabaseClaimed": false,
        "vercelDeploymentClaimed": false,
        "awsScreenshotRequired": true,
        "devpostFinalSubmitRequired": true
      }
    }
  ],
  "cloudReadiness": {
    "okForLocalReview": true,
    "okForPublicCloudClaim": false,
    "database": {
      "tableName": "IncidentZeroCases",
      "adapter": "local",
      "liveWriteEnabled": false,
      "tableNameConfigured": false,
      "regionConfigured": false,
      "requiredEnv": [
        "INCIDENT_ZERO_STORAGE=dynamodb",
        "INCIDENT_ZERO_DYNAMODB_TABLE",
        "AWS_REGION"
      ],
      "credentialPolicy": "Use Vercel environment variables or account-owner AWS configuration; do not commit credentials."
    },
    "deployment": {
      "vercelProjectUrlConfigured": false,
      "publicBaseUrlConfigured": false,
      "expectedPaths": [
        "/",
        "/api/health",
        "/api/scenarios",
        "/api/case",
        "/api/schema",
        "/api/handoff",
        "/api/storage-preview"
      ]
    },
    "missingAccountOwnerGates": [
      "INCIDENT_ZERO_PUBLIC_URL",
      "INCIDENT_ZERO_STORAGE=dynamodb",
      "INCIDENT_ZERO_DYNAMODB_TABLE",
      "AWS_REGION"
    ],
    "iamPolicyTemplate": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "dynamodb:BatchWriteItem",
            "dynamodb:PutItem",
            "dynamodb:GetItem",
            "dynamodb:Query"
          ],
          "Resource": [
            "arn:aws:dynamodb:<region>:<account-id>:table/IncidentZeroCases",
            "arn:aws:dynamodb:<region>:<account-id>:table/IncidentZeroCases/index/*"
          ]
        }
      ]
    },
    "safety": {
      "returnsSecretValues": false,
      "storesCredentials": false,
      "accountOwnerActionRequired": true
    }
  },
  "boundary": {
    "storesCredentials": false,
    "containsPrivateMessages": false,
    "requiresLiveCloudForReview": false,
    "liveDeploymentStillSupported": true
  }
};
