from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.ml_model import MLModel, ModelFramework, ModelStatus
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user
from app.core.config import settings
import os, shutil, uuid

router = APIRouter()


def detect_framework(filename: str) -> ModelFramework:
    ext = filename.lower().split(".")[-1]
    mapping = {
        "pkl": ModelFramework.sklearn,
        "joblib": ModelFramework.sklearn,
        "pt": ModelFramework.pytorch,
        "pth": ModelFramework.pytorch,
        "onnx": ModelFramework.onnx,
    }
    return mapping.get(ext, ModelFramework.unknown)


@router.get("/")
def list_models(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    models = db.query(MLModel).filter(MLModel.owner_id == current_user.id).all()
    return [
        {
            "id": str(m.id), "name": m.name, "version": m.version,
            "framework": m.framework, "status": m.status,
            "file_size": m.file_size, "created_at": m.created_at,
        }
        for m in models
    ]


@router.post("/upload", status_code=201)
async def upload_model(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    version: str = Form("v1"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allowed = {".pkl", ".joblib", ".pt", ".pth", ".onnx"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"File type {ext} not supported")

    storage_path = settings.MODEL_STORAGE_PATH
    os.makedirs(storage_path, exist_ok=True)
    file_id = str(uuid.uuid4())
    file_path = os.path.join(storage_path, f"{file_id}{ext}")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path) / (1024 * 1024)

    ml_model = MLModel(
        name=name,
        description=description,
        version=version,
        framework=detect_framework(file.filename),
        status=ModelStatus.ready,
        file_path=file_path,
        file_size=round(file_size, 2),
        owner_id=current_user.id,
    )
    db.add(ml_model)
    db.commit()
    db.refresh(ml_model)

    return {"message": "Model uploaded successfully", "id": str(ml_model.id), "framework": ml_model.framework}


@router.get("/{model_id}")
def get_model(model_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    model = db.query(MLModel).filter(MLModel.id == model_id, MLModel.owner_id == current_user.id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model


@router.delete("/{model_id}")
def delete_model(model_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    model = db.query(MLModel).filter(MLModel.id == model_id, MLModel.owner_id == current_user.id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    if model.file_path and os.path.exists(model.file_path):
        os.remove(model.file_path)
    db.delete(model)
    db.commit()
    return {"message": "Model deleted"}