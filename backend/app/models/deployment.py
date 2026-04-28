from sqlalchemy import Column, String, Integer, DateTime, Enum, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.db.database import Base


class DeploymentStatus(str, enum.Enum):
    pending = "pending"
    building = "building"
    deploying = "deploying"
    running = "running"
    failed = "failed"
    stopped = "stopped"


class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    status = Column(Enum(DeploymentStatus), default=DeploymentStatus.pending)
    endpoint_url = Column(String, nullable=True)
    replicas = Column(Integer, default=1)
    max_replicas = Column(Integer, default=5)
    cpu_limit = Column(String, default="500m")
    memory_limit = Column(String, default="512Mi")
    total_requests = Column(Integer, default=0)
    avg_latency_ms = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    config = Column(JSON, nullable=True)
    model_id = Column(UUID(as_uuid=True), ForeignKey("ml_models.id"))
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    model = relationship("MLModel", back_populates="deployments")
    owner = relationship("User", back_populates="deployments")