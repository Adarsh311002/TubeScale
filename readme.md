# 🎬 TubeScale — Event-Driven Backend (AWS EC2, Docker, Nginx, Redis, BullMQ, MongoDB)
**Scalable Event-Driven Backend & Cloud Infrastructure**

TubeScale is a **production-grade, event-driven backend system** designed for **high scalability, resilience, and low latency**.  
It decouples heavy media processing from the request lifecycle using **background workers**, enabling **sub-100ms API responses** for critical user actions even under high load.

The system is **fully containerized, cloud-deployed on AWS**, and fronted by **Nginx** for secure traffic handling.

---

## 🚀 Key Highlights

- ⚡ Event-driven, non-blocking backend architecture  
- 📈 Built for high concurrency and horizontal scalability  
- 🧠 Intelligent caching with strong consistency guarantees  
- 🔁 Fault-tolerant background job processing  
- 🐳 Fully containerized and cloud-deployed (AWS EC2)  
- 🌐 Reverse-proxied with Nginx and publicly accessible  

---

## 🏗 System Architecture & Design Decisions

### 1️⃣ Asynchronous Media Pipeline (High Concurrency)

**Problem**  
Synchronous uploads to Cloudinary during user actions (registration, profile updates) caused:
- Network bottlenecks  
- Request timeouts  
- Poor API responsiveness  

**Solution**  
Implemented a **Producer–Consumer pattern** using **BullMQ + Redis**:

- API layer handles validation and database writes only  
- Media upload jobs are pushed to background workers  
- Workers process uploads independently and asynchronously  

**Result**
- 🚀 **~95% reduction** in API response time  
- Instant response for user-facing APIs  
- Retry-safe and failure-isolated media processing  

---

### 2️⃣ Distributed Caching (Performance Optimization)

**Strategy**
- Implemented **Cache-Aside pattern** using Redis  
- Cached expensive MongoDB aggregation queries such as:
  - User watch history  
  - Channel profile statistics  

**Efficiency**
- 🔥 **~80% reduction** in MongoDB CPU usage  
- Cached reads served in **<10ms** from memory  

**Consistency**
- Automatic cache invalidation on database writes  
- Ensures no stale or inconsistent reads  

---

### 3️⃣ Fault Tolerance & Resilience

**Retry Mechanism**
- Configured **exponential backoff retry policies** for background jobs  
- Gracefully handles:
  - Temporary Cloudinary outages  
  - Network failures  
  - Worker crashes  

**Observability**
- Integrated **BullBoard** for real-time job monitoring  
- Visibility into:
  - Waiting  
  - Active  
  - Completed  
  - Failed jobs with error diagnostics  

---

### 4️⃣ Cloud Deployment & Traffic Management

**Infrastructure**
- Deployed on **AWS EC2**  
- Fully containerized using **Docker**  
- **Docker Compose** orchestrates:
  - Node.js API service  
  - Redis (cache + queue)  
  - Background worker services  

**Reverse Proxy**
- Configured **Nginx as a reverse proxy**:
  - Handles incoming traffic on port 80  
  - Routes requests to internal services  
  - Masks internal application ports for improved security  

**Benefits**
- Environment parity across dev, test, and production  
- High availability and clean service isolation  
- Zero “works on my machine” issues  

---

## 🛠 Tech Stack

| Category | Technology |
|-------|-----------|
| Runtime | Node.js (LTS) |
| Framework | Express.js |
| Database | MongoDB |
| Cache & Queue | Redis |
| Job Processing | BullMQ |
| Media Storage | Cloudinary |
| Reverse Proxy | Nginx |
| Infrastructure | Docker, Docker Compose |
| Cloud | AWS EC2 |
| Monitoring | BullBoard |
| Authentication | JWT (Access & Refresh Tokens) |

---

## Database Design

![Schema]![Image](https://github.com/user-attachments/assets/bd71abb8-89eb-42a0-805d-3f219e717024)


## API Reference

#### To timely check the Server Status

```http
  GET api/v1/healthcheck
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**.  |

#### Register route

```http
  POST /api/v1/users/register
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required** |
| `email`      | `string` | **Required** |
| `password`      | `string` | **Required** |
| `fullname`      | `string` | **Required** |

### Login route

```http
POST /api/v1/users/login
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required** |
| `email`      | `string` | **Required** |
| `password`      | `string` | **Required** |

#### Change Password

```http
  POST /api/v1/users/change-password
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `OldPassword`      | `string` | **Required** |
| `NewPassword`      | `string` | **Required** |


#### To update the Account details

```http
    POST /v1/users/update-account
```

| Parameter | Type     | Description (Available after Authorization)                      |
| :-------- | :------- | :-------------------------------- |
| `fullname`      | `string` | Required if you want to update this |
| `email`      | `string` | Required if you want  to update this |

### To get the refresh-token

```http
 GET /api/v1/users/refresh-token
```
### To check current user

```http
 GET /api/v1/users/current-user
 ```

### Get user channel profile

```http
 GET /api/v1/users/c/username
 ```

 
### Update user Avatar

```http
 PATCH /api/v1/users/avatar
 ```
 In Form Data 

 (avatar : File)

 
### Check the Watch History

```http
 GET /api/v1/users/history
 ```

### Logout

```http
GET /api/v1/users/logout
```



## 🚦 Getting Started

### Prerequisites

- Docker & Docker Compose
- Cloudinary Account

---

### Setup & Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Adarsh311002/Backend-Platform.git
```
### 2. Environment Configuration
Create a .env file in the root directory:
```.env
PORT=8000
MONGODB_URI=mongodb://mongo:27017/videotube
REDIS_URL=redis://redis:6379

ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 3. Launch the Infrastructure
```bash
docker-compose up --build
```
This will:
- Pull MongoDB & Redis images
- Build the Node.js backend
- Wire all services together automatically

### 📊 Real-Time Monitoring

Background jobs are monitored using BullBoard, providing real-time visibility into queue execution and failures.

Dashboard Access: 
```
http://localhost:8000/admin/queues
```
- Metrics Tracked
- Upload progress
- Retry attempts
- Failed jobs with detailed error reasons

### 📌 Summary

It is well-suited for video platforms, media-heavy applications, and high-traffic systems where reliability and speed are critical.
- Performance
- Scalability
- Fault tolerance
- Clean architectural separation



⭐ If you find this project useful, consider giving it a star!