---
title: "Give your AI agent two memories with Azure App Service"
author_name: "Jordan Selig"
toc: true
toc_sticky: true
---

Agents feel continuous only when they can operate across two very different time horizons. They
need the recent turns that make the current conversation coherent, and they need a smaller set of
durable facts that can follow an authenticated user into a new conversation.

This sample implements both horizons on Azure App Service with Microsoft Agent Framework, Azure
Managed Redis, Azure Cosmos DB for NoSQL vector search, and Azure OpenAI. It is deployed and
available as a complete reference implementation with a browser UI, deterministic local mode,
tests, Bicep, and Azure Developer CLI support.

**Sample:** <https://github.com/seligj95/app-service-agent-memory>

## Why one memory store is not enough

Conversation history and durable memory have different jobs.

**Conversation history** is ordered, session-specific, frequently updated, and naturally
short-lived. The agent needs it to resolve statements such as "use the second option" or "what did
I just say?"

**Durable memory** is selective, user-scoped, and useful across sessions. It holds facts such as a
preferred deployment region, product name, accessibility need, or writing preference. Retrieval is
semantic rather than chronological.

Putting both into one unbounded prompt makes cost, latency, privacy, and deletion harder to reason
about. The sample instead gives each horizon a purpose-built store and joins them through the Agent
Framework context pipeline.

## The Azure architecture

![Persistent agent memory architecture]({{site.baseurl}}/media/2026/07/agent-memory-architecture.png)

The public FastAPI application runs on one always-on App Service Premium v4 instance with Python
3.13. The browser creates demo user and conversation IDs in local storage. That keeps the sample
easy to explore, but it is not production authentication.

For every chat turn, the application:

1. Validates the user ID, session ID, message, and retrieval limit.
2. Loads bounded conversation history from Azure Managed Redis.
3. Creates an embedding for the new input.
4. Runs a partition-scoped vector query in Cosmos DB for the same user.
5. Adds relevant durable memories to the Agent Framework context.
6. Runs `gpt-5-mini`.
7. Stores the new conversation messages in Redis and refreshes their TTL.
8. Extracts conservative durable facts, embeds them, deduplicates them, and upserts them to Cosmos
   DB.

The chat response also returns memory attribution so the UI can show that a memory influenced the
turn.

## Short-term history with a custom HistoryProvider

Agent Framework's current Python API makes history a context provider. The custom provider only
implements the storage boundary; the framework handles when to load and persist messages.

```python
class RedisHistoryProvider(HistoryProvider):
    def __init__(self, store, ttl_seconds, max_messages=40):
        super().__init__("redis-history")
        self._store = store
        self._ttl_seconds = ttl_seconds
        self._max_messages = max_messages

    async def get_messages(self, session_id, *, state=None, **kwargs):
        user_id = _required_state_value(state, "user_id")
        values = await self._store.load(user_id, session_id)
        return [Message.from_dict(json.loads(value)) for value in values[-self._max_messages:]]

    async def save_messages(self, session_id, messages, *, state=None, **kwargs):
        user_id = _required_state_value(state, "user_id")
        values = [json.dumps(message.to_dict()) for message in messages]
        await self._store.append(
            user_id, session_id, values, self._ttl_seconds, self._max_messages
        )
```

The Redis key is `session:{user_id}:{session_id}`. Each append also trims the list and refreshes the
seven-day TTL. Serializing the complete Agent Framework `Message` preserves tool and attribution
metadata instead of reducing history to plain strings.

## Durable recall with a custom ContextProvider

The durable provider participates before and after the model call.

```python
class CosmosContextProvider(ContextProvider):
    async def before_run(self, *, agent, session, context, state):
        user_id = _required_state_value(state, "user_id")
        embedding = await self._embeddings.embed(_latest_input_text(context))
        recalled = await self._store.recall(user_id, embedding, self._recall_limit)
        state["recalled_memories"] = [item.model_dump(mode="json") for item in recalled]

        if recalled:
            facts = "\n".join(f"- {item.text}" for item in recalled)
            context.extend_instructions(
                self.source_id,
                "Use these durable memories only when relevant:\n" + facts,
            )

    async def after_run(self, *, agent, session, context, state):
        for fact, category in extract_durable_facts(_latest_input_text(context)):
            embedding = await self._embeddings.embed(fact)
            await self._store.remember(
                state["user_id"], fact, category, state["source_turn"], embedding
            )
```

The Cosmos container uses `/user_id` as its partition key and a 1,536-dimension cosine
`quantizedFlat` vector index. Recall is always routed to one user's partition and is bounded to a
small TOP N result set. A stable ID derived from the user scope and normalized content hash makes
writes idempotent.

## Passwordless by default

App Service uses its system-assigned managed identity for every data service.

- **Azure OpenAI:** `Cognitive Services OpenAI User`
- **Cosmos DB:** native built-in data contributor
- **Key Vault:** `Key Vault Secrets User`
- **Azure Managed Redis:** database-scoped Entra access-policy assignment

Azure OpenAI and Cosmos DB local authentication are disabled. Redis requires TLS and Entra
authentication, and its access keys are disabled. The application explicitly selects
`ManagedIdentityCredential` in Azure and `AzureCliCredential` for local real-service development.
It does not use a broad production credential chain.

Key Vault remains the secrets boundary for future extensions, although this passwordless sample
does not need a runtime secret.

## Try it locally without Azure

The deterministic fake mode exercises the real provider pipeline and complete UI without an Azure
subscription:

```bash
uv sync --python 3.13 --all-groups
uv run uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000`, tell the agent "My favorite launch color is teal," start a new
conversation, and ask for the color. You can inspect attribution, list the stored memory, and
forget it.

## Deploy with Azure Developer CLI

After creating an azd environment and setting its subscription and supported region, deployment is
one command:

```bash
azd up --no-prompt
```

The Bicep creates App Service, Managed Redis, Cosmos DB, Azure OpenAI model deployments, Key Vault,
Application Insights, and Log Analytics. A smoke test then checks health, same-session history,
explicit remember, new-session recall, list, forget, and absence after forget.

Azure Managed Redis availability is subscription- and region-dependent. The deployed reference
uses East US 2 after the service preflight rejected East US for this subscription.

## What the demo deliberately does not hide

The browser identity is anonymous and user-controlled. That is useful for understanding the data
flow, but a production application must replace it with authenticated claims and authorization on
every memory operation.

The sample also keeps one App Service instance. Before scaling out, replace the in-process
conversation lock with a distributed lock so concurrent requests cannot reorder one session's
history.

Other production work includes private endpoints and VNet integration, consent and retention
policy, user export and deletion, content safety, prompt-injection defenses, abuse throttling,
per-user quotas, and evaluation of retrieval thresholds.

## Learn more

- [Microsoft Agent Framework memory](https://learn.microsoft.com/agent-framework/get-started/memory)
- [Agent Framework context providers](https://learn.microsoft.com/agent-framework/agents/conversations/context-providers)
- [Configure Python on Azure App Service](https://learn.microsoft.com/azure/app-service/configure-language-python)
- [Use Microsoft Entra ID with Azure Managed Redis](https://learn.microsoft.com/azure/redis/entra-for-authentication)
- [Vector search in Azure Cosmos DB for NoSQL](https://learn.microsoft.com/azure/cosmos-db/how-to-python-vector-index-query)
- [Use Azure OpenAI without keys](https://learn.microsoft.com/azure/developer/ai/keyless-connections)

Two memory horizons make the agent easier to operate and easier to trust: session history remains
temporary, durable memory remains selective and user-scoped, and both have explicit lifecycle
controls.
