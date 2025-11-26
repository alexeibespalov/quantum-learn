# Course Schema Documentation (v2.0 - Chat & Tutor Enhanced)

This document defines the enhanced schema for QuantumLearn courses, now supporting AI-driven conversational lessons and dynamic asset generation.

## Overview

The course data model has been expanded to support `chat` based lessons where an AI tutor guides the student.

```
Course
├── Module[]
│   └── Lesson[]
│       ├── Content (Video | Text | Chat)
│       └── ...
```

## New & Updated Content Types

### ChatContent (New)

Content for AI-driven conversational lessons.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tutorConfig` | `TutorConfig` | ✅ | Configuration for the AI tutor |
| `openingMessage` | `string` | ✅ | The first message the AI sends to start the chat |

### TutorConfig

Configuration for the AI personality and knowledge base for a specific lesson.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `persona` | `string` | ✅ | e.g., "Socratic", "Direct", "Playful" |
| `systemPrompt` | `string` | ✅ | The core instruction for the LLM (The "Teacher's Guide") |
| `successCriteria` | `string[]` | ✅ | What the student must demonstrate to "pass" the lesson |
| `dynamicAssets` | `DynamicAsset[]` | ❌ | Assets the AI can generate on the fly |

### DynamicAsset

Pre-defined prompts for the AI to use with tools (Nano Banana, Veo) when specific topics arise.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | Unique ID |
| `trigger` | `string` | ✅ | Context/keyword that suggests using this asset (e.g., "explain_slope") |
| `type` | `"image" \| "video"` | ✅ | Tool to use (Nano Banana or Veo) |
| `prompt` | `string` | ✅ | The specific prompt for the tool |
| `altText` | `string` | ✅ | Fallback description |

---

## Example Chat Lesson

```json
{
  "id": "math-alg-1",
  "type": "chat",
  "title": "Understanding Variables",
  "duration": 20,
  "order": 1,
  "content": {
    "openingMessage": "Hi! Today we're going to solve the mystery of 'x'. If I told you I have a mystery number in a box, and if I double it, I get 10... what's in the box?",
    "tutorConfig": {
      "persona": "Socratic and Encouraging",
      "systemPrompt": "You are an expert math tutor. Your goal is to teach the concept of variables. Do not just give answers. Use the 'box' analogy. 1. Start with simple word problems. 2. Introduce 'x' as just a label for the box. 3. Move to notation (2x = 10). If the student gets it wrong, guide them gently. If they ask for the answer, ask them a simpler related question.",
      "successCriteria": [
        "Student can explain what a variable represents",
        "Student can solve simple one-step equations"
      ],
      "dynamicAssets": [
        {
          "id": "asset-box-viz",
          "trigger": "visualize_variable",
          "type": "image",
          "prompt": "A clear, 3D style cartoon illustration of a cardboard box with a large question mark on it, sitting on a table next to the number 10. The style should be friendly and educational.",
          "altText": "A mystery box with a question mark."
        }
      ]
    }
  }
}
```

## Video Content Update (Veo Support)

`VideoContent` now supports `veoPrompt` for on-the-fly generation or placeholder.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `veoPrompt` | `string` | ❌ | Prompt to generate video if url is missing |

---

## Schema Validation Rules (v2)
1. All `chat` lessons must have a valid `tutorConfig`.
2. `systemPrompt` should be comprehensive (>50 words).
3. `dynamicAssets` should be used for complex visual concepts.