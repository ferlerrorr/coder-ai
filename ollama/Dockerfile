# Use official Ollama image
FROM ollama/ollama:latest

# Install curl and openssh-client
RUN apt-get update && apt-get install -y curl openssh-client

# Expose Ollama port
EXPOSE 11434

# Set up optional API key environment variable
ENV OLLAMA_API_KEY=${OLLAMA_API_KEY}

# Generate SSH key (if missing)
RUN mkdir -p /root/.ollama && \
    if [ ! -f /root/.ollama/id_ed25519 ]; then \
        ssh-keygen -t ed25519 -f /root/.ollama/id_ed25519 -N ""; \
    fi

# IMPORTANT: Start Ollama properly and pull model at runtime, not build time
ENTRYPOINT ["sh", "-c", "\
    ollama serve & \
    sleep 5 && \
    ollama pull qwen2.5-coder:0.5b && \
    wait \
"]
