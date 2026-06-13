from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from beanie.exceptions import DocumentNotFound
from pymongo.errors import DuplicateKeyError
import jwt

class AppException(Exception):
    """
    Custom application exception wrapper.
    Allows throwing manual errors inside handlers with explicit status codes.
    """
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def register_error_handlers(app):
    """
    Attaches global event listeners to the FastAPI instance to map
    exceptions into standard JSON error responses.
    """

    # 1. Handle Custom Manual Application Errors (Replaces custom Error instances)
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "message": exc.message}
        )

    # 2. Handle MongoDB Document Not Found Errors (Replaces CastError/Resource Missing checks)
    @app.exception_handler(DocumentNotFound)
    async def document_not_found_handler(request: Request, exc: DocumentNotFound):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Requested resource not found in the database."}
        )

    # 3. Handle MongoDB Duplicate Key Constraints (Replaces code 11000 duplicate checks)
    @app.exception_handler(DuplicateKeyError)
    async def duplicate_key_handler(request: Request, exc: DuplicateKeyError):
        # Extract the clashing database key details safely out of the error message payload
        error_details = exc.details.get("keyValue", {})
        conflict_field = list(error_details.keys())[0] if error_details else "Field"
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": f"{conflict_field.capitalize()} already exists."}
        )

    # 4. Handle Invalid JWT Signatures (Replaces JsonWebTokenError)
    @app.exception_handler(jwt.PyJWTError)
    async def jwt_invalid_handler(request: Request, exc: jwt.PyJWTError):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Json Web Token is invalid, try again"}
        )

    # 5. Handle Expired Session JWTs (Replaces TokenExpiredError)
    @app.exception_handler(jwt.ExpiredSignatureError)
    async def jwt_expired_handler(request: Request, exc: jwt.ExpiredSignatureError):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Json Web Token is expired, try again"}
        )

    # 6. Handle Pydantic Validation Mismatches (NEW: Catches bad body types automatically)
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        # Grabs the first error details location and messages to present context nicely
        errors = exc.errors()
        error_msg = f"{errors[0]['loc'][-1]}: {errors[0]['msg']}" if errors else "Invalid request body payload."
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": error_msg}
        )

    # 7. Final Global Fallback Guard (Replaces status 500 Internal Server Error)
    @app.exception_handler(Exception)
    async def global_fallback_handler(request: Request, exc: Exception):
        # Log the real system traceback string directly to your terminal logs for debugging
        print(f"💥 CRITICAL GLOBAL SYSTEM FAILURE: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": "Internal Server Error"}
        )