from sqlalchemy import Column, String, Float, Integer, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.db.database import Base


class ModelFramework(str, enum.Enum):
    sklearn = "sklearn"
    pytorch = "pytorch"
    onnx = "onnx"
    tensorflow = "tensorflow"
    unknown = "unknown"


class ModelStatus(str, enum.Enum):
    uploading = "uploading"
    validating = "validating"
    ready = "ready"
    failed = "failed"


class MLModel(Base):
    __tablename__ = "ml_models"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    version = Column(String, default="v1")
    framework = Column(Enum(ModelFramework), default=ModelFramework.unknown)
    status = Column(Enum(ModelStatus), default=ModelStatus.uploading)
    file_path = Column(String, nullable=True)
    file_size = Column(Float, nullable=True)
    input_schema = Column(JSON, nullable=True)
    output_schema = Column(JSON, nullable=True)
    metrics = Column(JSON, nullable=True)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="models")
    deployments = relationship("Deployment", back_populates="model")