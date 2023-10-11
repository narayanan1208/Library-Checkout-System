FROM python:3.8

# Set working dir in image (creates automatically if doesn't exist)
WORKDIR /app

# install vim
RUN apt-get update && \
    apt-get install -y vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./requirements.txt
RUN pip install --trusted-host pypi.python.org --no-cache-dir -r requirements.txt

COPY . .

CMD python reset_database.py
