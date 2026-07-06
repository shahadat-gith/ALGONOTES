# Use an official, lightweight Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables to prevent Python from writing pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements file first to take advantage of Docker's cache layers
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend application code into the container
COPY . .

# Expose the port that FastAPI running on Uvicorn will listen on
EXPOSE 5000

# Command to run the FastAPI app with live reloading enabled for development
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]