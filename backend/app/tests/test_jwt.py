import uuid

from app.security.jwt import TokenType, create_token, decode_token


def test_jwt_includes_account_id_and_keeps_org_id():
    user_id = uuid.uuid4()
    org_id = uuid.uuid4()
    account_id = uuid.uuid4()

    token = create_token(user_id, org_id, TokenType.access, account_id)
    payload = decode_token(token)

    assert payload["sub"] == str(user_id)
    assert payload["org_id"] == str(org_id)
    assert payload["account_id"] == str(account_id)
    assert payload["type"] == TokenType.access.value
    assert payload["iss"] == "smartarchive-hsa"
    assert "email_verified" not in payload
