# Persona Status Mapping Fix

## Issue Description

The webhook endpoint was receiving Persona inquiries with status `"completed"` where all verifications passed, but the backend was incorrectly mapping them to `PENDING` status instead of `SUCCESS`.

## Root Cause

The status mapping logic only handled these cases:

- `"approved"` → SUCCESS
- `"declined"` → ERROR
- `"needs_review"` / `"marked-for-review"` → PENDING
- **Default (including "completed")** → PENDING ❌

According to Persona's API, when an inquiry reaches `"completed"` status, it means the user has finished all verification steps. The actual verification result is determined by:

1. The `status` field on individual verifications (passed/failed)
2. Whether the inquiry has been decisioned (`decisioned-at` timestamp)

## Solution Implemented

Updated the status mapping in `veriflevels.controller.js` to properly handle `"completed"` inquiries:

```javascript
case "completed":
  // Check all verifications in the included array
  const verificationDetails = includedData.filter(item =>
    item.type?.startsWith("verification/")
  );

  // Determine if all verifications passed
  const allVerificationsPassed = verificationDetails.every(verification =>
    verification.attributes?.status === "passed"
  );

  // Check if inquiry has been decisioned
  const decisionedAt = inquiryAttributes["decisioned-at"];

  // Apply mapping logic:
  if (allVerificationsPassed && decisionedAt) {
    mappedStatus = "SUCCESS";  // ✅ All checks passed and decisioned
  } else if (allVerificationsPassed && !decisionedAt) {
    mappedStatus = "PENDING";  // ⏳ Passed but awaiting decision
  } else {
    mappedStatus = "ERROR";    // ❌ Some verifications failed
  }
  break;
```

## Updated Status Mapping

| Persona Status      | Condition                                | Internal Status |
| ------------------- | ---------------------------------------- | --------------- |
| `approved`          | -                                        | SUCCESS         |
| `completed`         | All verifications passed + decisioned    | SUCCESS         |
| `completed`         | All verifications passed, not decisioned | PENDING         |
| `completed`         | Some verifications failed                | ERROR           |
| `declined`          | -                                        | ERROR           |
| `failed`            | -                                        | ERROR           |
| `needs_review`      | -                                        | PENDING         |
| `marked-for-review` | -                                        | PENDING         |
| Any other status    | -                                        | PENDING         |

## Verification Example

From the webhook you provided:

```json
{
  "data": {
    "attributes": {
      "status": "completed", // Inquiry status
      "decisioned-at": null // Not yet decisioned
      // ...
    },
    "relationships": {
      "verifications": {
        "data": [
          { "type": "verification/government-id", "id": "ver_Qm2..." },
          { "type": "verification/selfie", "id": "ver_oQ7u..." }
        ]
      }
    }
  },
  "included": [
    {
      "type": "verification/government-id",
      "id": "ver_Qm2...",
      "attributes": {
        "status": "passed" // ✅ Government ID passed
      }
    },
    {
      "type": "verification/selfie",
      "id": "ver_oQ7u...",
      "attributes": {
        "status": "passed" // ✅ Selfie passed
      }
    }
  ]
}
```

**Result**: Since all verifications passed but `decisioned-at` is `null`, the inquiry will be mapped to **PENDING** status (awaiting final decision).

## Testing

After deploying this fix:

1. **Test Case 1**: Completed + All Passed + Decisioned
   - Expected: SUCCESS ✅
2. **Test Case 2**: Completed + All Passed + Not Decisioned (your case)
   - Expected: PENDING ⏳
3. **Test Case 3**: Completed + Some Failed
   - Expected: ERROR ❌

## Deployment Steps

1. Restart the Criptoremesa-Backend service:

   ```bash
   pm2 restart criptoremesa-backend
   # or if using ecosystem file:
   pm2 restart pre-prod-be-bh:api
   ```

2. Monitor the logs for the new debug output:

   ```
   Persona completed inquiry - Verifications passed: true, Decisioned: false
   Verification details: [{"type":"verification/government-id","status":"passed","id":"ver_..."}]
   ```

3. If you have a test webhook, replay it to verify the correct status mapping

## Additional Notes

- The fix also added detailed console logging to help debug verification status determination
- No database changes required - this is purely webhook processing logic
- The full webhook JSON is still stored in the `persona_webhook_full_json` field for audit purposes

## Files Modified

- `src/modules/veriflevels/controllers/veriflevels.controller.js` (lines 1053-1133)
