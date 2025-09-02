FROM oven/bun:1-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]
