# AEGIS — Advanced Emergency Guidance & Information System

AEGIS is an offline-first disaster preparedness and emergency guidance application built with React Native, Expo, and Supabase.

The system is designed around one core principle: **critical safety information should remain accessible even when network connectivity is degraded or unavailable**.

AEGIS combines local deterministic search, cloud-backed retrieval-augmented generation, offline persistence, community features, and gamified preparedness tools in a single cross-platform mobile application.

---

## Overview

AEGIS provides:

- Offline-accessible disaster preparedness guides
- Trie-based local search for fast deterministic information retrieval
- A Retrieval-Augmented Generation (RAG) assistant backed by PostgreSQL/pgvector
- Automatic fallback from cloud AI retrieval to local search when connectivity fails
- Local-first persistence with cloud synchronization
- Community discussion, voting, reputation, and moderation features
- Gamified preparedness through XP, levels, badges, quizzes, and checklists
- AI-generated disaster scenarios through an interactive RPG-style simulator
- Emergency contacts, location features, notifications, and disaster-related news aggregation

---

## Architecture

AEGIS uses a hybrid local/cloud architecture.

### Mobile Client

The application is built with:

- React Native
- Expo
- AsyncStorage
- Expo Network
- Expo Location
- Expo Notifications
- Expo Sensors

Application state is managed through a centralized context layer responsible for user progression, connectivity state, persistence, location data, and synchronization.

Core application data is written locally first, allowing the UI and preparedness tools to continue functioning without an active network connection.

### Backend

Supabase provides:

- PostgreSQL
- Authentication
- Edge Functions
- Cloud persistence
- Real-time data services
- pgvector-based semantic retrieval

Edge Functions are used for AI-related workloads and LLM orchestration rather than performing those operations directly on the mobile device.

---

## Offline-First Persistence and Synchronization

AEGIS is designed to tolerate intermittent connectivity.

Changes to user state are persisted locally before cloud synchronization is attempted. This includes data such as:

- XP and level progression
- Completed preparedness tasks
- Checklist state
- User preferences

The application monitors network availability and triggers synchronization when connectivity becomes available again.

The synchronization layer also handles conflicts between local and remote state, including scenarios where progress has been made on multiple devices or while one device was offline.

This allows core preparedness features to remain usable even when the backend cannot be reached.

---

## Local Search Engine

AEGIS includes a custom trie-based search engine for offline information retrieval.

Instead of depending on a remote database query for every search, the application builds an in-memory prefix index over the local disaster knowledge base.

The search system supports:

- Prefix matching
- Multi-word queries
- Set intersection across search terms
- Priority-aware relevance ranking
- Offline operation

For example, a query such as:

`flood first aid`

is split into individual terms, prefix matches are resolved independently, and their result sets are intersected to return content relevant to all search terms.

Search results are then ranked according to safety priority:

`Critical > High > Medium`

with exact title matches prioritized where appropriate.

---

## Hybrid RAG Assistant

AEGIS includes a Retrieval-Augmented Generation assistant for natural-language disaster guidance.

When an internet connection is available:

1. The application invokes a Supabase Edge Function.
2. Relevant disaster-preparedness material is retrieved using vector similarity search.
3. Retrieved knowledge-base content is supplied as context to the language model.
4. The generated response is returned to the mobile client.

The knowledge base is stored in PostgreSQL using `pgvector` embeddings.

### Graceful Offline Fallback

The AI assistant is designed to degrade gracefully.

If the cloud request fails or the device loses connectivity, AEGIS automatically falls back to the local trie-based search system.

This creates two retrieval paths:

**Online**

`User Query → Vector Retrieval → Knowledge Base Context → LLM Response`

**Offline**

`User Query → Local Trie Search → Ranked Preparedness Information`

The goal is not to make critical information dependent on the availability of an external AI service.

---

## Disaster Simulation RPG

AEGIS includes an AI-driven disaster simulation mode designed to make preparedness training more interactive.

The user progresses through an emergency scenario and makes decisions in response to changing conditions.

The backend evaluates each decision and advances the scenario accordingly.

Safe decisions can feed into the application's XP and progression system, connecting scenario-based learning with the broader gamification framework.

---

## Gamification

The preparedness system includes:

- XP progression
- User levels
- Preparedness/readiness scoring
- Checklists
- Quizzes
- Badges
- Leaderboards
- Community reputation

Preparedness tasks award XP and contribute to the user's overall progress.

The system prevents duplicate rewards for previously completed tasks and persists progression locally so that rewards remain available during offline use.

---

## Community System

AEGIS includes a community forum backed by a relational PostgreSQL schema.

Features include:

- User accounts
- Categories
- Posts and replies
- Upvotes and downvotes
- Reputation scoring
- Content reporting
- Moderation support
- Guest browsing

Voting relationships are represented separately from forum content, allowing duplicate votes to be prevented and aggregate scores to be calculated consistently.

The database also supports separate reporting entities for moderation workflows.

---

## Disaster Information & Utilities

AEGIS includes several supporting preparedness tools:

- Structured disaster-preparedness guides
- Emergency contact directory
- One-tap phone integration
- Disaster-related RSS news aggregation
- Location-aware features
- Compass functionality
- Emergency location sharing
- Simulated emergency notifications
- Offline preparedness content

The current emergency alert implementation uses simulated disaster events rather than a live external disaster-alert API.

---

## Testing

AEGIS includes an automated Jest test suite covering core application logic.

The suite contains more than 150 individual test cases across 11 test files.

Testing covers areas including:

- Trie prefix search
- Multi-word query handling
- Search-result priority ordering
- Local/cloud state reconciliation
- Conflict resolution
- Checklist deduplication
- XP and leveling logic
- Preparedness/readiness calculations
- Static knowledge-base validation
- Native Expo API behavior through mocks

Native APIs including networking, location, sensors, and notifications are mocked so that application logic can be tested independently of physical hardware.

The application has also been tested across Android emulators, iOS simulators, and physical mobile devices.

---

## Technology Stack

### Frontend

- React Native
- Expo
- JavaScript
- AsyncStorage
- React Native Maps

### Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Edge Functions
- pgvector

### AI / Retrieval

- Retrieval-Augmented Generation
- Vector similarity search
- Gemini models
- Custom trie-based local retrieval

### Device & Platform APIs

- Expo Network
- Expo Location
- Expo Notifications
- Expo Sensors
- Haptics

### Testing

- Jest
- Native API mocks

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file containing the required Supabase configuration:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Additional backend configuration may be required for Edge Functions and AI features.

### 4. Start the development server

```bash
npx expo start
```

The application can then be launched using Expo Go, an Android emulator, or an iOS simulator.

---

## Demo Environment

The hosted backend currently uses the Supabase free tier.

Supabase may pause the project after an extended period of inactivity. If the hosted instance is paused, cloud-dependent functionality such as authentication, synchronization, community features, and AI services may temporarily be unavailable.

Local and offline functionality is unaffected where supported.

---

## Design Philosophy

AEGIS is built around graceful degradation.

Cloud-backed features provide richer capabilities when connectivity is available, while deterministic local systems preserve access to essential preparedness information when external services are unavailable.

The project explores the trade-offs between cloud intelligence and local reliability in software intended for connectivity-constrained environments.