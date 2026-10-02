# Security policy

SS-WD controls agent execution and publishes sanitized configuration metadata. A bypass in snapshot redaction, staged-content verification, endpoint ownership, or cleanup authority can expose private data or affect unrelated processes.

## Supported versions

Security fixes are applied to the latest release on `main`. Older tags may be used for historical reference but do not receive fixes unless a release note states otherwise.

## Report a vulnerability

Do not open a public issue containing credentials, private paths, internal endpoints, exploit payloads, or instructions that could affect another user's runtime.

Use GitHub's private vulnerability reporting for this repository:

1. Open the repository's **Security** tab.
2. Choose **Advisories**.
3. Choose **Report a vulnerability**.

Include:

- affected commit or release;
- impact and realistic attack path;
- minimal reproduction using fake credentials and disposable state;
- whether staged Git content, snapshots, runtime endpoints, or cleanup are involved;
- suggested mitigation if known.

If private reporting is unavailable, contact the repository owner privately through the contact method on their GitHub profile and disclose only enough publicly to establish contact.

## Response targets

These are targets, not guarantees:

- acknowledgement within 3 business days;
- initial severity and scope assessment within 7 business days;
- coordinated fix and disclosure timing based on impact.

## Sensitive-data incident procedure

If private material reaches the repository:

1. stop publishing and do not quote the secret in issues or chat;
2. revoke or rotate affected credentials immediately;
3. identify every branch, tag, release asset, pull request, fork, cache, and artifact that may contain it;
4. remove live refs and follow GitHub's sensitive-data removal procedure;
5. add a regression test using synthetic data;
6. rerun public-snapshot verification against staged blobs and working-tree candidates;
7. document impact without reproducing the secret.

History rewriting alone does not guarantee that an object is immediately unavailable from hosting caches or existing clones.

## Security boundaries

- Snapshot generation is an allowlist, not a backup mechanism.
- The verifier detects known unsafe patterns; it cannot prove arbitrary content safe.
- Runtime send receipts do not prove worker execution or completion.
- Mutable terminal labels do not grant ownership or cleanup authority.
- Unknown endpoint, process, worktree, or integration state fails closed.
- External runtimes and agent products retain their own security and update policies.
