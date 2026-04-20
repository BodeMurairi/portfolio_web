#!/usr/bin/env python3
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from app.utils.crud_handler import CRUDService
from app.utils.http_status_code import NotFound

# Setup Test Model & DB
Base = declarative_base()

class TestModel(Base):
    __tablename__ = "test_model"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    value = Column(String, nullable=True)

# SQLite in-memory DB
@pytest.fixture(scope="function")
def db_session():
    engine = create_engine("sqlite:///:memory:", echo=False)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

@pytest.fixture(scope="function")
def crud_service(db_session):
    return CRUDService(db_session, TestModel)

# Test Create
def test_create(crud_service):
    payload = {"name": "Test Item", "value": "123"}
    instance = crud_service.create(payload)
    assert instance.id is not None
    assert instance.name == "Test Item"
    assert instance.value == "123"

# Test Read / Get
def test_get_existing(crud_service):
    # first create
    instance = crud_service.create({"name": "Item", "value": "abc"})
    found = crud_service.get("id", instance.id)
    assert found.id == instance.id
    assert found.name == "Item"

def test_get_not_found(crud_service):
    with pytest.raises(NotFound):
        crud_service.get("id", 999)

# Test Update
def test_update(crud_service):
    instance = crud_service.create({"name": "Old", "value": "val"})
    updated = crud_service.update("id", instance.id, {"name": "New", "value": "newval"})
    assert updated.name == "New"
    assert updated.value == "newval"

# Test Delete
def test_delete(crud_service):
    instance = crud_service.create({"name": "DeleteMe", "value": "x"})
    response = crud_service.delete("id", instance.id)
    assert "deleted successfully" in response["message"]
    # verify deletion
    with pytest.raises(NotFound):
        crud_service.get("id", instance.id)