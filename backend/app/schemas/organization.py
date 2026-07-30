import uuid

from pydantic import BaseModel, ConfigDict

from app.models.organization import DeploymentMode


class OrganizationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    slug: str
    deployment_mode: DeploymentMode
    is_active: bool
