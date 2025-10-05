# Тесты для ClientDocumentService
# Проверяют все ключевые функции:
# - CRUD участников
# - Независимые роли и employment types
# - Мультизагрузка paystubs с валидацией дат
# - Credit Report (PDF, Equifax, AKA)
# - OtherDocs (AKA проверка)
# - Финансовый summary и рекомендации
# - Генерация Ontario Rental HTML
# - Агентские хуки и 2FA

import pytest
from datetime import date, timedelta
from Utils.ClientDocumentService import (
    ClientDocumentService,
    Role,
    EmploymentType,
)


@pytest.fixture
def svc():
    return ClientDocumentService()


def test_create_and_get_participant(svc):
    p = svc.create_participant(displayName="Alex", role=Role.Primary,
                               employmentType=EmploymentType.Employee,
                               akaNames=["Alexey"], monthlyNetIncome=5000,
                               creditScore=720, agentId="agent-1")
    assert p.displayName == "Alex"
    assert p.role == Role.Primary
    assert p.employmentType == EmploymentType.Employee
    assert p.monthlyNetIncome == 5000
    assert p.creditScore == 720
    assert svc.get_participant(p.id) is not None


def test_update_participant(svc):
    p = svc.create_participant(displayName="Test")
    updated = svc.update_participant(
        p.id, displayName="Updated", monthlyNetIncome=3000)
    assert updated.displayName == "Updated"
    assert updated.monthlyNetIncome == 3000


def test_delete_participant(svc):
    p = svc.create_participant(displayName="ToDelete")
    assert svc.delete_participant(p.id) is True
    assert svc.get_participant(p.id) is None


def test_upload_paystubs_and_validation(svc):
    p = svc.create_participant(displayName="PaystubUser")
    today = date.today()
    old_date = today - timedelta(days=20)
    svc.upload_paystubs(
        p.id,
        files_meta=[("stub1.pdf", "application/pdf"),
                    ("stub2.pdf", "application/pdf")],
        stub_dates=[today, old_date],
    )
    p2 = svc.get_participant(p.id)
    assert len(p2.paystubs) == 2
    assert any(stub.isRecent for stub in p2.paystubs)


def test_credit_report_equifax_pdf(svc):
    p = svc.create_participant(
        displayName="CreditUser", akaNames=["CreditUser"])
    svc.upload_credit_report(
        p.id, fileName="Equifax_Report.pdf", contentType="application/pdf")
    p2 = svc.get_participant(p.id)
    assert p2.creditReport.isPdf
    assert p2.creditReport.isEquifax
    assert p2.creditReport.akaMatched


def test_other_docs_with_aka(svc):
    p = svc.create_participant(displayName="DocUser", akaNames=["DocUser"])
    svc.upload_other_docs(p.id, files_meta=[("DocUser_ID.png", "image/png")])
    p2 = svc.get_participant(p.id)
    assert len(p2.otherDocs) == 1
    assert p2.otherDocs[0].akaMatched


def test_summary_and_recommendations(svc):
    p1 = svc.create_participant(
        displayName="P1", monthlyNetIncome=4000, creditScore=710)
    p2 = svc.create_participant(
        displayName="P2", monthlyNetIncome=2000, creditScore=650)
    summary = svc.get_summary(targetRent=2500)
    assert summary.totalMonthlyNetIncome == 6000
    assert summary.affordabilityMin == 1800
    assert summary.affordabilityMax == 2400
    recs = [s.creditRecommendation for s in summary.participants]
    assert any("сильный" in r or "низкий" in r for r in recs)


def test_build_ontario_rental_html(svc):
    p = svc.create_participant(displayName="HTMLUser", monthlyNetIncome=3000)
    html_str = svc.build_ontario_rental_html(targetRent=2000)
    assert "Ontario Rental Application" in html_str
    assert "HTMLUser" in html_str


def test_agent_and_2fa_hooks(svc):
    p = svc.create_participant(displayName="AgentUser", agentId="agent-123")
    clients = svc.list_clients_for_agent("agent-123")
    assert any(c.displayName == "AgentUser" for c in clients)
    twofa = svc.is_2fa_enabled()
    assert "enabled" in twofa
    assert twofa["enabled"] is False
