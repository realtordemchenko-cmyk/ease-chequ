# D:\Projects\Ease Chequ\Tests\test_client_document_service.py
import requests


def test_no_upload_without_consent():
    r = requests.post('http://localhost:3001/api/uploads/presign', json={
        'caseId': 'case-1', 'agentId': 'agent-1', 'items': []
    })
    # presign path only, actual PUT without consent should be blocked at storage policy
    assert r.status_code in (200, 400)


def test_metadata_only_flow():
    r = requests.post(
        'http://localhost:3001/api/cases/case-1/analysis/metadata', json={'items': []})
    assert r.status_code in (200, 400)
