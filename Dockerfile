# Etapa builder
FROM golang:1.24.1-alpine as builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY .env .env
RUN go build -o app main.go

# Etapa runtime
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/app .
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/.env .env
EXPOSE 8080
CMD ["./app"]
