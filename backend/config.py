from functools import lru_cache
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    """
    Runtime configuration for the backend service.

    Environment variables:
      - DEDALUS_API_BASE: Optional URL to a remote Dedalus server.
      - DEDALUS_API_KEY: Optional API key for authenticating with Dedalus.
    """

    dedalus_api_base: str | None = Field(default=None, env="DEDALUS_API_BASE")
    dedalus_api_key: str | None = Field(default=None, env="DEDALUS_API_KEY")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

