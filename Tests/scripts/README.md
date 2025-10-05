# Create scripts folder (if not exists) and write README.md in one step
New-Item -ItemType Directory -Path "D:\Projects\Ease Chequ\Tests\scripts" -Force | Out-Null
@'
# Test Automation Scripts

This folder contains PowerShell scripts that manage the full lifecycle of API tests:
- Running tests
- Capturing actual responses
- Updating expected responses
- Logging decisions for audit and CI/CD transparency

---

## Workflow Overview


1. **Run-ApiTests.ps1**
   - Executes all tests or a specific group (`-Group "auth"`, `-Group "system"`, etc.).
   - Generates a JUnit report at `reports/junit-report.xml`.
   - Marks tests as **passed** or **failed**.

2. **AutoFix-FailedTests.ps1**
   - For each failed test, performs a real API call.
   - Saves the actual response to `actual/{TestName}.actual.json`.
   - This creates a snapshot of the current API behavior.

3. **AutoUpdate-FailedTests.ps1**
   - Compares `expectedResponse` (from payloads) with the saved `actual` response.
   - Displays a diff and provides a recommendation:
     - **Update** → if the API structure has changed.
     - **Do NOT update** → if differences are only in dynamic fields (e.g., `timestamp`, `trace-id`).
   - Asks for a decision (`Y/N`).
   - Logs every decision in `reports/audit-log.txt` with:
     - Timestamp
     - User (currently fixed as `Alexey`)
     - Group (auth/system/data/error)
     - Test name
     - Choice (Y/N)
     - Recommendation and reason

4. **Commit**
   - Commit updated payloads (if any), actual responses, and the audit log.
   - This ensures reproducibility and a transparent history of decisions.

---

## Audit Log Example
[2025-10-03 16:45:12] User=Alexey  Group=data  Test=GetData  Choice=N  Recommendation=Update  Reason=API response structure changed. [2025-10-03 16:47:01] User=Alexey  Group=auth  Test=Login  Choice=N  Recommendation=Update  Reason=API response structure changed.



---

## Best Practices

- **For real tests**:  
  If the API has legitimately changed, answer **Y** to update `expectedResponse`.

- **For placeholders (scaffolding tests)**:  
  Always answer **N** until real endpoints are available.  
  This prevents overwriting templates with meaningless 404 responses.

- **CI/CD integration**:  
  - Use the JUnit report for pipeline test results.  
  - Use the audit log for traceability of decisions.  

---

## Summary

This workflow guarantees:
- Clear separation between *expected* and *actual* responses.
- Full transparency of every decision made during test maintenance.
- A reproducible, CI/CD‑ready testing process.
'@ | Out-File -FilePath "D:\Projects\Ease Chequ\Tests\scripts\README.md" -Encoding UTF8 -Force

# Test Automation Scripts

This folder contains PowerShell scripts that manage the full lifecycle of API tests:
- Running tests
- Capturing actual responses
- Updating expected responses
- Logging decisions for audit and CI/CD transparency

---

## Workflow Overview
Run-ApiTests.ps1  →  AutoFix-FailedTests.ps1  →  AutoUpdate-FailedTests.ps1  →  Commit


1. **Run-ApiTests.ps1**
   - Executes all tests or a specific group (`-Group "auth"`, `-Group "system"`, etc.).
   - Generates a JUnit report at `reports/junit-report.xml`.
   - Marks tests as **passed** or **failed**.

2. **AutoFix-FailedTests.ps1**
   - For each failed test, performs a real API call.
   - Saves the actual response to `actual/{TestName}.actual.json`.
   - This creates a snapshot of the current API behavior.

3. **AutoUpdate-FailedTests.ps1**
   - Compares `expectedResponse` (from payloads) with the saved `actual` response.
   - Displays a diff and provides a recommendation:
     - **Update** → if the API structure has changed.
     - **Do NOT update** → if differences are only in dynamic fields (e.g., `timestamp`, `trace-id`).
   - Asks for a decision (`Y/N`).
   - Logs every decision in `reports/audit-log.txt` with:
     - Timestamp
     - User (currently fixed as `Alexey`)
     - Group (auth/system/data/error)
     - Test name
     - Choice (Y/N)
     - Recommendation and reason

4. **Commit**
   - Commit updated payloads (if any), actual responses, and the audit log.
   - This ensures reproducibility and a transparent history of decisions.

---

## Audit Log Example
[2025-10-03 16:45:12] User=Alexey  Group=data  Test=GetData  Choice=N  Recommendation=Update  Reason=API response structure changed. [2025-10-03 16:47:01] User=Alexey  Group=auth  Test=Login  Choice=N  Recommendation=Update  Reason=API response structure changed.


---

## Best Practices

- **For real tests**:  
  If the API has legitimately changed, answer **Y** to update `expectedResponse`.

- **For placeholders (scaffolding tests)**:  
  Always answer **N** until real endpoints are available.  
  This prevents overwriting templates with meaningless 404 responses.

- **CI/CD integration**:  
  - Use the JUnit report for pipeline test results.  
  - Use the audit log for traceability of decisions.  

---

## Summary

This workflow guarantees:
- Clear separation between *expected* and *actual* responses.
- Full transparency of every decision made during test maintenance.
- A reproducible, CI/CD‑ready testing process.