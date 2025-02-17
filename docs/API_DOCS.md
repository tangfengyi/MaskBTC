# API Documentation

## Base URL
`https://api.maskly.com/v1`

## Authentication
- JWT tokens required for protected endpoints
- Signature-based authentication for blockchain operations

## Endpoints

### User Management

#### POST /users/register
- Registers new user
- Request Body:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string"
  }
  ```

#### POST /users/login
- Authenticates user
- Request Body:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Blockchain Operations

#### POST /transactions
- Creates new blockchain transaction
- Request Body:
  ```json
  {
    "fromAddress": "string",
    "toAddress": "string",
    "amount": "number",
    "chainId": 
    // Supported values:
    // 1 - Ethereum Mainnet
    // 56 - Binance Smart Chain
    // Other chain IDs as per network specifications
  }
  ```

#### GET /transactions/:id
- Retrieves transaction details
- Response:
  ```json
  {
    "id": "string",
    "status": "string",
    "timestamp": "date",
    "details": {}
  }
  ```

### Governance

#### GET /proposals
- Lists all governance proposals
- Query Parameters:
  - status: "active" | "completed"

#### POST /proposals/vote
- Submits vote on proposal
- Request Body:
  ```json
  {
    "proposalId": "string",
    "vote": "for" | "against",
    "votingPower": "number"
  }
  ```

## Error Responses
```json
{
  "error": {
    "code": "number",
    "message": "string"
  }
}
```

## Rate Limits
- 100 requests/minute per IP
- Authenticated users: 500 requests/minute

## WebSockets
- Real-time updates available at:
  `wss://api.maskly.com/socket`

