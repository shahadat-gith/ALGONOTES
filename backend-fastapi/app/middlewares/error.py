import jwt
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pymongo.errors import DuplicateKeyError
from beanie.exceptions import DocumentNotFound


class AppException(Exception):
   
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def register_error_handlers(app):
 
    # 1. Handle Custom Manual Application Errors (Thrown explicitly in controllers)
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "message": exc.message}
        )

    # 2. Handle Beanie Resource Missing Checks
    @app.exception_handler(DocumentNotFound)
    async def resource_not_found_handler(request: Request, exc: DocumentNotFound):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"success": False, "message": "Requested resource not found in the database."}
        )

    # 3. Handle MongoDB Unique Index Constraint Violations (DuplicateKeyError)
    @app.exception_handler(DuplicateKeyError)
    async def duplicate_key_handler(request: Request, exc: DuplicateKeyError):
        # Mongo error messages contain the full index layout string details
        error_msg = str(exc)
        
        if "email" in error_msg.lower():
            message = "An account with this email already exists."
        elif "username" in error_msg.lower():
            message = "Username is already taken by another profile."
        else:
            message = "A record with these unique details already exists."

        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": message}
        )

    # 4. Handle Invalid JWT Signatures (Replaces JsonWebTokenError)
    @app.exception_handler(jwt.PyJWTError)
    async def jwt_invalid_handler(request: Request, exc: jwt.PyJWTError):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Json Web Token is invalid, try again."}
        )

    # 5. Handle Expired Session JWTs (Replaces TokenExpiredError)
    @app.exception_handler(jwt.ExpiredSignatureError)
    async def jwt_expired_handler(request: Request, exc: jwt.ExpiredSignatureError):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Json Web Token has expired, please log in again."}
        )

    # 6. Handle Pydantic Validation Mismatches (Catches malformed body payloads)
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        errors = exc.errors()
        # Grabs the last element of the location path (the field name) to print clean context
        error_msg = f"Field '{errors[0]['loc'][-1]}': {errors[0]['msg']}" if errors else "Invalid request payload."
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,  # Aligns with standard validation protocols
            content={"success": False, "message": error_msg}
        )

    # 7. Final Global Fallback Guard (Catches unexpected server errors)
    @app.exception_handler(Exception)
    async def global_fallback_handler(request: Request, exc: Exception):
        # Log the complete system traceback safely to your terminal output for immediate debugging
        print(f"💥 CRITICAL GLOBAL SYSTEM FAILURE: {str(exc)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": "Internal Server Error."}
        )