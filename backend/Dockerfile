FROM python:3.10-alpine

# Don't buffer terminal output
ENV PYTHONUNBUFFERED 1

# Install requiremnts before copying other files (so that this step only runs if requirements.txt changes)
COPY requirements.txt ./
RUN pip install -r requirements.txt

# Copy all other files
COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]