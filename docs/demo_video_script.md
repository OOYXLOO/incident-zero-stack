# Demo Video Script

Target length: 2:30 to 2:50.

## 0:00 - 0:15: Open

Show the dashboard.

Voiceover:

```text
Incident Zero Stack is a database-first response cockpit. It turns an alert into response tasks, evidence records, audit events, stakeholder updates, and an executive handoff packet.
```

## 0:15 - 0:45: Run The Scenario

Click `Run demo`.

Voiceover:

```text
This starts with a weak identity signal, increases evidence confidence as corroborating data arrives, and finishes by marking containment complete.
```

Point at:

- Risk score
- Affected scope
- Containment state

## 0:45 - 1:15: Response Work

Show the action board and SLA windows.

Voiceover:

```text
The cockpit assigns owners, due windows, acceptance criteria, and customer-safe update paths. The response plan is generated from the same case state that will be stored.
```

## 1:15 - 1:55: Database Shape

Show storage adapter plan and DynamoDB-shaped records.

Voiceover:

```text
The database is not decorative. Every case becomes operational records: CASE, ALERT, EVIDENCE, TASK, AUDIT, UPDATE, METRIC, and HANDOFF. The local adapter uses the same shape that a DynamoDB adapter would write.
```

## 1:55 - 2:20: Architecture

Show the architecture panel and `docs/architecture.svg`.

Voiceover:

```text
The browser cockpit rebuilds incident state through the Node API. The incident model computes risk, tasks, evidence, and handoff output, then the storage boundary prepares a DynamoDB-compatible record packet.
```

## 2:20 - 2:45: Export

Open `/api/handoff` and briefly show `/api/case`.

Voiceover:

```text
The same state is available through the API and can be exported as an executive handoff markdown packet. That keeps the response auditable instead of spread across screenshots or chat messages.
```

## 2:45 - 2:55: Close

Return to the dashboard.

Voiceover:

```text
Incident Zero Stack keeps the first response hour structured, queryable, and ready for handoff.
```
