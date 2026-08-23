# Decisions

## 2026-08-23: Free local beta before licensing

**Context:** The product has no completed customer validation, and Chrome Web Store does not provide integrated extension payments.

**Choice:** Publish a free beta with the complete local conversion flow. Do not add a backend or third-party license provider yet.

**Tradeoff:** The beta cannot collect the proposed USD 19 payment, but it ships sooner and isolates demand from checkout and licensing complexity.

## 2026-08-23: Temporary tab access only

**Context:** Reading ticket content is sensitive and broad host access would weaken user trust.

**Choice:** Use `activeTab` and `scripting` after explicit invocation instead of persistent host permissions or content scripts.

**Tradeoff:** The popup cannot precompute results in the background, which is acceptable for the explicit copy flow.
