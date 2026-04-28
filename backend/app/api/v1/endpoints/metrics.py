from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.deployment import Deployment
from app.models.ml_model import MLModel
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
import random

router = APIRouter()


@router.get("/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_models = db.query(MLModel).filter(MLModel.owner_id == current_user.id).count()
    total_deployments = db.query(Deployment).filter(Deployment.owner_id == current_user.id).count()
    running = db.query(Deployment).filter(
        Deployment.owner_id == current_user.id,
        Deployment.status == "running"
    ).count()
    return {
        "total_models": total_models,
        "total_deployments": total_deployments,
        "running_deployments": running,
        "total_requests": random.randint(1000, 50000),
        "avg_latency_ms": random.randint(20, 150),
        "uptime_percent": 99.9,
        "requests_per_minute": [random.randint(10, 200) for _ in range(30)],
        "latency_history": [random.randint(20, 150) for _ in range(30)],
        "error_rate": [random.uniform(0, 2) for _ in range(30)],
    }