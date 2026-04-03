#!/bin/sh
set -e

host="$POSTGRES_HOST"
port="$POSTGRES_PORT"

echo "Waiting for Postgres at $host:$port..."
until nc -z "$host" "$port"; do
  sleep 2
done

echo "Postgres has started."