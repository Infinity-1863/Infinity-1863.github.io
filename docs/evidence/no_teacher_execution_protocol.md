# No-Teacher-Execution Protocol

AL is framed as a constrained self-learning research prototype, not as a product agent.

The core protocol is:

1. Agent acts first.
2. Objective verifier checks the result.
3. Teacher may diagnose only after failure.
4. Teacher execution is not allowed.
5. Patch-shaped teacher outputs are rejected.
6. Agent must derive the repair or procedure itself.
7. Procedure promotion requires replay or near-transfer success.

Safety constraints:

- Teacher cannot execute tasks.
- Objective verifier is the source of truth.
- Blocked states become structured localization evidence.
- Procedures are promoted only after replay or near-transfer success.
- The system is designed to measure teacher dependency, false learning, false success, and bounded transfer.
