"""Database package.

This project has both:
- backend/database.py (top-level module)
- backend/backend/database/ (package)

The main app imports from backend.backend.database (this package).
To avoid circular imports, we simply re-export from the actual implementation
located at backend/database.py.
"""

from .connection import engine, Base, get_db  # noqa: F401

# Re-export async session factory for convenience.
from .connection import AsyncSessionLocal  # noqa: F401







