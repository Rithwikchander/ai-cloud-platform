from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict
import time, random

router = APIRouter()


class InferenceRequest(BaseModel):
    deployment_id: str
    inputs: Dict[str, Any]


@router.post("/predict")
def predict(req: InferenceRequest):
    start = time.time()
    time.sleep(random.uniform(0.01, 0.1))
    latency = round((time.time() - start) * 1000, 2)
    return {
        "deployment_id": req.deployment_id,
        "prediction": {"label": "class_1", "confidence": round(random.uniform(0.7, 0.99), 4)},
        "latency_ms": latency,
        "status": "success",
    }