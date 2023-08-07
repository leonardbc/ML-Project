import pytest
from routes import app
import sys

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

