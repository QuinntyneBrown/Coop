# Coop Platform Hosting Cost Estimates

## 1. Overview

The Coop platform's current design baseline is a modular monolith built on ASP.NET Core running on **.NET 10 LTS**, with **Angular 21** used for both the public web app and the admin backend.

This document retains a higher-complexity distributed deployment model for comparison and future planning. For that distributed scenario, the infrastructure must support the following components:

| Component | Description |
|---|---|
| API Gateway | Single entry point for all client requests |
| Coop.Api | Monolithic main API |
| Identity Service | Authentication and authorization |
| Profile Service | Member profiles |
| Maintenance Service | Work order and maintenance tracking |
| Document Service | Document management |
| Asset Service | Digital asset storage (images/files) |
| Messaging Service | Internal messaging |
| Databases | 8 isolated SQL Server/PostgreSQL instances (one per service) |
| Redis | Inter-service messaging and caching |
| Frontend | Angular 21 public web app and Angular 21 admin backend served via CDN or static hosting |

All cost estimates below use publicly listed Azure and AWS pricing as of early 2026 and are quoted in USD per month. Actual costs will vary based on region, negotiated enterprise agreements, and consumption patterns.

For the current documented target architecture, treat these figures as comparative planning data rather than the default deployment recommendation.

---

## 2. Azure-Based Estimates (Primary Recommendation)

### 2.1 Development Environment

Goal: Minimize cost. Shared resources where possible. Single-region, no redundancy.

| Resource | SKU / Tier | Qty | Unit Cost | Monthly Cost |
|---|---|---|---|---|
| App Service Plan (API Gateway + Coop.Api) | B2 (2 vCPU, 3.5 GB) | 1 | $55 | $55 |
| App Service Plan (6 Microservices) | B1 (1 vCPU, 1.75 GB) | 2 | $55 | $110 |
| Azure SQL Database (per service DB) | Basic (5 DTU, 2 GB) | 8 | $5 | $40 |
| Azure Cache for Redis | Basic C0 (250 MB) | 1 | $17 | $17 |
| Azure Static Web Apps (Frontend) | Free tier | 1 | $0 | $0 |
| Azure Container Registry | Basic | 1 | $5 | $5 |
| Azure Monitor / Log Analytics | Free tier (5 GB ingest) | 1 | $0 | $0 |
| Networking / DNS | Minimal | -- | -- | $5 |
| **Total** | | | | **~$232/mo** |

Notes:
- Multiple microservices are packed onto shared App Service plans using deployment slots or multiple apps per plan.
- Basic-tier SQL databases are sufficient for development workloads.
- No SLA guarantees at Basic tiers.

---

### 2.2 Staging Environment

Goal: Mirror production topology at reduced scale. Used for integration testing, QA, and pre-release validation.

| Resource | SKU / Tier | Qty | Unit Cost | Monthly Cost |
|---|---|---|---|---|
| App Service Plan (API Gateway + Coop.Api) | S2 (2 vCPU, 3.5 GB) | 1 | $100 | $100 |
| App Service Plan (6 Microservices) | S1 (1 vCPU, 1.75 GB) | 2 | $73 | $146 |
| Azure SQL Database (per service DB) | S1 (20 DTU, 250 GB max) | 8 | $30 | $240 |
| Azure Cache for Redis | Standard C1 (1 GB) | 1 | $82 | $82 |
| Azure Static Web Apps (Frontend) | Standard | 1 | $9 | $9 |
| Azure Container Registry | Standard | 1 | $20 | $20 |
| Application Insights | Pay-as-you-go (est. 5 GB/mo) | 1 | $14 | $14 |
| Azure Key Vault | Standard | 1 | $1 | $1 |
| Networking / DNS / TLS | -- | -- | -- | $10 |
| **Total** | | | | **~$622/mo** |

Notes:
- Standard-tier Redis provides replication and a 99.9% SLA.
- S-tier SQL databases support more concurrent workloads and have better I/O performance.
- Consider shutting down staging during off-hours (nights/weekends) to reduce costs by ~60%.

---

### 2.3 Production Environment

Goal: High availability, redundancy, monitoring, and capacity for real user traffic.

| Resource | SKU / Tier | Qty | Unit Cost | Monthly Cost |
|---|---|---|---|---|
| App Service Plan (API Gateway + Coop.Api) | P2v3 (2 vCPU, 8 GB) | 1 | $220 | $220 |
| App Service Plan (6 Microservices) | P1v3 (1 vCPU, 4 GB), 2+ instances | 3 | $145 | $435 |
| Azure SQL Database (per service DB) | S3 (100 DTU, 250 GB max) | 6 | $150 | $900 |
| Azure SQL Database (Identity + Profile) | P1 (125 DTU, 500 GB max) | 2 | $465 | $930 |
| SQL DB Geo-Replication (critical DBs) | Active geo-replica | 2 | $465 | $930 |
| Azure Cache for Redis | Standard C2 (6 GB) | 1 | $162 | $162 |
| Azure Blob Storage (asset migration target) | Hot tier, LRS, ~500 GB est. | 1 | $10 | $10 |
| Azure Front Door | Standard tier | 1 | $35 | $35 |
| Azure Static Web Apps (Frontend) | Standard | 1 | $9 | $9 |
| Azure Container Registry | Standard | 1 | $20 | $20 |
| Application Insights | Pay-as-you-go (est. 20 GB/mo) | 1 | $56 | $56 |
| Azure Key Vault | Standard | 1 | $1 | $1 |
| Azure Monitor Alerts | 10 alert rules | -- | -- | $2 |
| Networking / DNS / DDoS Basic | -- | -- | -- | $15 |
| Azure Backup (DB long-term retention) | ~500 GB | 1 | $25 | $25 |
| **Total** | | | | **~$3,750/mo** |

Notes:
- Premium-tier databases for Identity and Profile services handle authentication and high-read workloads.
- Geo-replication covers the two most critical databases for disaster recovery.
- Azure Front Door provides global load balancing, WAF, and TLS termination.
- Blob Storage is budgeted for migrating digital assets out of database storage, which will improve database performance and reduce SQL costs over time.
- App Service auto-scaling is configured with a minimum of 2 instances per plan for high availability.

#### Production Alternative: Azure Kubernetes Service (AKS)

If operational complexity is acceptable, AKS can provide better density and scaling:

| Resource | SKU / Tier | Qty | Unit Cost | Monthly Cost |
|---|---|---|---|---|
| AKS Cluster (System node pool) | D2s_v3 (2 vCPU, 8 GB) | 2 | $96 | $192 |
| AKS Worker Node Pool | D4s_v3 (4 vCPU, 16 GB) | 3 | $192 | $576 |
| Azure Load Balancer | Standard | 1 | $25 | $25 |
| Databases, Redis, Storage, Monitoring | Same as above | -- | -- | $2,150 |
| **Total (AKS-based)** | | | | **~$2,943/mo** |

AKS saves approximately $800/mo over App Service at the cost of increased operational overhead (Kubernetes management, Helm charts, RBAC, etc.).

---

## 3. AWS Alternative Estimates

| Component | Dev (Monthly) | Staging (Monthly) | Production (Monthly) |
|---|---|---|---|
| Compute (ECS Fargate / EC2) | $100 | $200 | $700 |
| RDS SQL Server / PostgreSQL (8 DBs) | $80 | $280 | $1,800 |
| RDS Read Replicas (2 critical DBs) | -- | -- | $600 |
| ElastiCache Redis | $15 | $70 | $160 |
| S3 Storage (assets) | $0 | $1 | $12 |
| CloudFront CDN + WAF | $0 | $5 | $50 |
| ALB (Application Load Balancer) | $20 | $25 | $40 |
| CloudWatch / X-Ray | $0 | $15 | $60 |
| Route 53 / ACM / Secrets Manager | $5 | $5 | $10 |
| ECR (Container Registry) | $1 | $5 | $10 |
| **Total** | **~$221/mo** | **~$606/mo** | **~$3,442/mo** |

Key differences from Azure:
- AWS Fargate provides per-task billing which can be more cost-effective for variable workloads.
- RDS SQL Server licensing is similarly expensive on both platforms; PostgreSQL is significantly cheaper.
- AWS pricing is broadly comparable; the choice should be driven by team expertise rather than cost alone.

---

## 4. Cost Optimization Recommendations

### 4.1 Database Consolidation (Dev/Staging)

The biggest cost driver is running 8 isolated databases. For non-production environments:

| Strategy | Savings | Tradeoff |
|---|---|---|
| Use a single SQL Server instance with 8 schemas | ~60% on DB costs | Reduced isolation; noisy-neighbor risk |
| Use PostgreSQL instead of SQL Server | ~30-40% on DB costs | Requires dual-database support in code |
| Use Azure SQL Elastic Pool (S-tier, 100 eDTU) | ~40% on DB costs | Shared DTU budget across databases |

**Recommendation:** Use Azure SQL Elastic Pools for dev and staging. A single S2 pool (50 eDTU, ~$112/mo) can host all 8 databases, replacing $240/mo in individual databases.

### 4.2 Reserved Instances (Production)

| Resource | Pay-As-You-Go | 1-Year RI | 3-Year RI |
|---|---|---|---|
| App Service Plans (total) | $655/mo | $425/mo (35% off) | $330/mo (50% off) |
| SQL Databases (total) | $1,830/mo | $1,280/mo (30% off) | $1,010/mo (45% off) |
| Redis Cache | $162/mo | $114/mo (30% off) | $89/mo (45% off) |
| **Subtotal** | **$2,647/mo** | **$1,819/mo** | **$1,429/mo** |
| **Annual savings vs PAYG** | -- | **$9,936/yr** | **$14,616/yr** |

### 4.3 Auto-Scaling Policies

- **App Service:** Configure auto-scale rules based on CPU (>70%) and request queue length. Set minimum instances to 2, maximum to 6 during peak hours.
- **Off-hours scaling (staging):** Schedule staging to scale down to 0 or 1 instance from 8 PM to 7 AM and on weekends. Estimated savings: $370/mo (60% of staging).
- **AKS Cluster Autoscaler:** If using AKS, enable the Horizontal Pod Autoscaler and Cluster Autoscaler to avoid paying for idle nodes.

### 4.4 Asset Storage Migration

Currently, digital assets are stored as byte arrays in the database. Migrating to Azure Blob Storage will:

- Reduce database size and DTU consumption significantly.
- Lower storage cost from ~$9.80/GB (SQL Premium) to ~$0.02/GB (Blob Hot tier).
- Enable CDN integration for faster delivery.
- **Estimated annual savings after migration: $1,200-$3,600** (depending on asset volume).

### 4.5 Additional Optimizations

- **Use Azure Dev/Test pricing** for non-production environments (requires Visual Studio subscription; saves ~30% on VMs and SQL).
- **Implement aggressive log retention policies** in Application Insights to avoid ingestion overages.
- **Consider Azure Spot Instances** for AKS worker nodes handling non-critical batch processing.

---

## 5. Summary Comparison

| | Development | Staging | Production (App Service) | Production (AKS) |
|---|---|---|---|---|
| **Azure (PAYG)** | $232/mo | $622/mo | $3,750/mo | $2,943/mo |
| **Azure (1-yr RI)** | -- | -- | $2,922/mo | $2,115/mo |
| **Azure (3-yr RI)** | -- | -- | $2,563/mo | $1,756/mo |
| **AWS (PAYG)** | $221/mo | $606/mo | $3,442/mo | -- |
| | | | | |
| **Annual Total (Azure PAYG)** | $2,784/yr | $7,464/yr | $45,000/yr | $35,316/yr |
| **Annual Total (Azure 3-yr RI)** | $2,784/yr | $7,464/yr | $30,756/yr | $21,072/yr |

### Total Platform Cost (All Environments)

| Scenario | Monthly | Annual |
|---|---|---|
| Azure PAYG (App Service prod) | $4,604 | $55,248 |
| Azure PAYG (AKS prod) | $3,797 | $45,564 |
| Azure 3-yr RI (App Service prod) | $3,417 | $41,004 |
| Azure 3-yr RI (AKS prod) | $2,610 | $31,320 |
| With staging off-hours shutdown | Save $370/mo | Save $4,440/yr |
| With Elastic Pool consolidation (dev+staging) | Save $168/mo | Save $2,016/yr |

---

*Estimates are based on Azure and AWS public pricing as of Q1 2026 for the East US / us-east-1 region. Actual costs may vary based on region selection, negotiated enterprise agreements, Azure Hybrid Benefit eligibility, and real-world consumption patterns. All figures exclude tax.*
