from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.deployment import Deployment, DeploymentStatus
from app.models.ml_model import MLModel
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from pydantic import BaseModel
import uuid

router = APIRouter()


class DeployRequest(BaseModel):
    model_id: str
    name: str
    replicas: int = 1
    max_replicas: int = 5
    cpu_limit: str = "500m"
    memory_limit: str = "512Mi"


@router.get("/")
def list_deployments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deployments = db.query(Deployment).filter(Deployment.owner_id == current_user.id).all()
    return [
        {
            "id": str(d.id), "name": d.name, "status": d.status,
            "endpoint_url": d.endpoint_url, "replicas": d.replicas,
            "total_requests": d.total_requests, "avg_latency_ms": d.avg_latency_ms,
            "created_at": d.created_at,
        }
        for d in deployments
    ]


@router.post("/", status_code=201)
def create_deployment(req: DeployRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    model = db.query(MLModel).filter(MLModel.id == req.model_id, MLModel.owner_id == current_user.id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    deployment = Deployment(
        name=req.name,
        status=DeploymentStatus.running,
        endpoint_url=f"http://localhost:8000/api/v1/inference/{str(uuid.uuid4())}",
        replicas=req.replicas,
        max_replicas=req.max_replicas,
        cpu_limit=req.cpu_limit,
        memory_limit=req.memory_limit,
        model_id=model.id,
        owner_id=current_user.id,
        config={"model_name": model.name, "framework": model.framework, "version": model.version},
    )
    db.add(deployment)
    db.commit()
    db.refresh(deployment)
    return {"message": "Deployed successfully", "id": str(deployment.id), "endpoint": deployment.endpoint_url}


@router.delete("/{deployment_id}")
def delete_deployment(deployment_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    deployment = db.query(Deployment).filter(Deployment.id == deployment_id, Deployment.owner_id == current_user.id).first()
    if not deployment:
        raise HTTPException(status_code=404, detail="Deployment not found")
    deployment.status = DeploymentStatus.stopped
    db.commit()
    return {"message": "Deployment stopped"}