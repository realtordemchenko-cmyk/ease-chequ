# D:\Projects\Ease Chequ\utils\ClientDocumentAPI.py
# ClientDocumentAPI: typed wrapper around document endpoints with robust error handling.

import os
import requests
from typing import Dict, Any, List, Optional, TypedDict


class MetadataPayload(TypedDict, total=False):
    id: str
    filename: str
    uploadedBy: str
    contentType: str
    size: int


class ClientDocumentAPI:
    def __init__(self, base_url: Optional[str] = None) -> None:
        base = base_url or os.getenv("BASE_URL", "http://localhost:3000/api")
        # Normalize to include /api suffix
        self.base_url: str = base if base.endswith(
            "/api") else base.rstrip("/") + "/api"

    def _request(self, method: str, path: str, **kwargs: Any) -> Dict[str, Any]:
        url: str = f"{self.base_url}{path}"
        try:
            resp: requests.Response = requests.request(
                method, url, timeout=20, **kwargs)
        except requests.RequestException as e:
            raise RuntimeError(f"Network error: {e}") from e
        if not resp.ok:
            raise RuntimeError(f"HTTP {resp.status_code}: {resp.text}")
        try:
            data: Dict[str, Any] = resp.json()  # type: ignore[assignment]
        except ValueError as e:
            raise RuntimeError("Invalid JSON response") from e
        return data

    def list_required_documents(self, role: str) -> List[Dict[str, Any]]:
        data = self._request("GET", f"/documents/required?role={role}")
        if not isinstance(data, list):
            raise RuntimeError("Expected list response for required documents")
        return data  # type: ignore[return-value]

    def upload_document_metadata(self, payload: MetadataPayload) -> Dict[str, Any]:
        return self._request("POST", "/documents/metadata", json=payload)

    def submit_documents_package(self, case_id: str) -> Dict[str, Any]:
        return self._request("POST", f"/documents/{case_id}/submit", json={})

    def download_package(self, case_id: str) -> Dict[str, Any]:
        return self._request("GET", f"/documents/{case_id}/package")
