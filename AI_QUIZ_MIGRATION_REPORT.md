# AI Quiz Generation Migration Report

## 1. Executive Summary

### How It Works

The **Course Provider** (role `CourseProvider` or `SchoolCourseProvider`) navigates a 4-level hierarchy — Courses → Modules → Units → Sections. The **Sections editor page** is the central workspace for both section content and quiz management. On this page, a **right-side panel** (`SidePanel.tsx`) contains a single "Include Quiz" / "Edit Quiz" button. Clicking it opens a Chakra UI `Modal` containing the full `QuizForm`. Inside the form, the provider specifies the desired number of questions (1–20) and clicks **"Generate Quiz"**, which triggers a `POST /api/admin/units/:unitId/generate-quiz` API call. The API responds with a pre-populated list of questions (with options and correct answers already flagged). The form is immediately populated with those questions. The provider can then add/edit/delete questions and options inline, then click **"Save"** to `PUT /api/admin/units/:unitId/quiz`.

The entity the quiz is attached to is the **Unit** (called "unit" in the API, equivalent to a "lesson"). There is no individual section-level quiz concept — quiz is always at the unit level.

### Migration Complexity

**Medium-high.** The AI generation call itself is a single endpoint (`POST .../generate-quiz`), but the complete migration requires: the full domain type chain (Course → Module → Unit), the Section editor shell, the quiz form with react-hook-form field arrays, two Zustand modal stores, TanStack Query mutations, Chakra UI modal and form primitives, and the Axios client with Bearer token injection.

### Main Architectural Risks

1. The `generateUnitQuiz` API function does **not** invalidate any React Query cache — the generated quiz only populates the form's in-memory state; it is **not persisted until the provider clicks Save**. A target project that assumes generation = persistence will break.
2. The quiz is scoped to the **Unit ID** (from the URL param `unitId`), not to an individual section. Losing this coupling breaks both read and write.
3. All route protection relies on Zustand `authStore` plus a simple role-equality check (`user?.role === "CourseProvider"`), not on React Router loaders or server-side guards.

---

## 2. Verified Facts

All of the following are directly confirmed by code inspection:

- **Route to sections editor**: `/course-provider/courses/:id/modules/:moduleId/units/:unitId/sections` → page renders `<Editor unitId={unitId} />`
- **Route guard**: `src/routes/CourseProviderProtectedRoute.tsx` checks `token && user?.role === "CourseProvider"`. SchoolCourseProvider has a parallel guard checking `"SchoolCourseProvider"`.
- **Quiz is attached to Unit, not Section**: All quiz API routes use `unitId`: `GET/PUT/DELETE /api/admin/units/:unitId/quiz` and `POST /api/admin/units/:unitId/generate-quiz`.
- **Generation does NOT auto-save**: `useGenerateUnitQuiz` mutation has **no** `onSuccess` cache invalidation; it only returns data that is loaded into the form via `methods.reset({ questions: data })`.
- **Save is a separate mutation**: `useUpdateUnitQuiz` calls `PUT /api/admin/units/:unitId/quiz` and on success invalidates `['unit-quiz']` cache key.
- **Questions count UI constraint**: Validated client-side only — `if (isNaN(count) || count < 1 || count > 20)` with a toast error. No Zod schema rule for this parameter.
- **Question schema fields**: `id (number|null), content (string), is_multiple (boolean), options[]` where each option is `{id (number|null), label (string), is_correct (boolean)}`.
- **Questions are fully editable before save**: `QuestionsForm` uses `useFieldArray` to add/remove/edit questions; `OptionsForm` does the same for options within each question. Both use `motion.div` animations.
- **Correct answer selection**: Using `RadioField` with True/False for `is_correct` per option — provider explicitly marks which option is correct.
- **Delete quiz exists**: `ConfirmQuizDeleteModal` calls `DELETE /api/admin/units/:unitId/quiz`, closes both modals, and shows a success toast.
- **"Include Quiz" vs "Edit Quiz"** label: The `SidePanel` checks `(quizResponse?.data?.length ?? 0) > 0` to toggle the label.
- **API client**: Axios instance with `baseURL: env.API_URL`, Bearer token injected from `localStorage` key `lms-local-store`, 401 → redirect to `/login`.
- **State management**: Two dedicated Zustand stores — `useQuizModal` (isOpen/open/close) and `useQuizDeleteModal` (isOpen/open/close). Neither is in the global `useModalStore`.
- **Form library**: React Hook Form with `zodResolver` from `@hookform/resolvers/zod`.
- **Toast system**: `react-toastify` with `<ToastContainer />` mounted globally in `providers.tsx`.
- **UI component library**: Chakra UI v2 for Modal, Button, RadioGroup, Stack.
- **Animation**: `framer-motion` for question/option enter animations.
- **Quiz query key**: `['unit-quiz', unitId]` — invalidated on save and delete.
- **No optimistic updates**: All mutations use standard success/error callbacks.
- **SchoolCourseProvider uses identical editor**: Same `Editor` component, same `QuizModal`, same hooks — only route and protection wrapper differ.
- **No quiz-specific i18n**: All UI strings are hardcoded in English in the component files; no i18n translation key system for quiz.

---

## 3. Assumptions / Unclear Areas

- **Backend AI model**: The frontend sends only `{ questions_count: number }` to `POST .../generate-quiz`. **No** `source_text`, `difficulty`, `type`, or `language` parameters exist on the frontend. Whether the backend infers context from existing section content (e.g., scraping section text) is **not visible in the frontend code** — assumed to be server-side logic.
- **Authentication requirement**: Frontend injects Bearer token for all `client.*` calls. Assumed backend requires `Authorization: Bearer <token>` header. No scoped API key or additional header is set.
- **Backend validation constraints**: The Zod schema for `QuizSchema` has no `minLength` / `maxLength` rules on questions or options, no `min`/`max` on question count at schema level. Backend may impose its own validation; the frontend only handles `422` errors by reading `error.response?.data.errors.questions[]` (array of messages) and toasting each.
- **`id: null` for new questions/options**: When the AI generates questions and the provider edits/adds questions before saving, newly added questions have `id: null`. Whether the backend accepts `null` IDs or requires omitting the field is **inferred from the type definition** (`z.number().nullable()`), not confirmed.
- **`is_multiple` field**: Present in the schema and type but the UI provides no control to toggle it. All manually added questions default to `is_multiple: true`. AI-generated questions may set this from the backend response.
- **Regeneration**: Clicking "Generate Quiz" while questions exist **replaces** the form state (`methods.reset`). There is no confirmation dialog before overwriting. Backend behavior on repeated calls is unknown.
- **Error shape from generate endpoint**: The `ApiGenerateQuizErrorResponse` is `AxiosError<{ message: string; errors: Record<string, string[]> }>`. The frontend only shows `error.response?.data.message || "Failed to generate quiz."` — field-level errors are not shown.
- **Section content is NOT sent to generate endpoint**: The generate payload is only `{ questions_count: number }`. Whether the backend fetches section content internally using the `unitId` is unknown.
- **Publication state**: The `EditorHeader` controls course-level publication (Draft → Published → Archived). There is no quiz-specific publish/draft state visible in the frontend.

---

## 4. User Flow

Step-by-step provider journey:

1. **Login** → Frontend checks `user.role === "CourseProvider"` via `CourseProviderProtectedRoute`. Redirect to `/course-provider/courses` on success.
2. **Navigate to course** → `/course-provider/courses` → click course → `/course-provider/courses/:id/modules`
3. **Navigate to module** → click module → `/course-provider/courses/:id/modules/:moduleId/units`
4. **Navigate to unit** → click unit → `/course-provider/courses/:id/modules/:moduleId/units/:unitId/sections`
5. **Sections editor loads** → `Editor` component renders: `EditorHeader` (top bar with course name + Save Draft / Publish), `Sections` (left 2/3: list of draggable section cards), `SidePanel` (right 1/3: quiz button).
6. **Quiz button** → `SidePanel` renders `"Include Quiz"` if no quiz exists, `"Edit Quiz"` if `quizResponse.data.length > 0`. Click fires `useQuizModal.openModal()`.
7. **QuizModal opens** → Chakra `Modal` (max-width 704px, centered, max-height 90vh, scrollable). The `useUnitQuiz(unitId)` query fetches `GET /api/admin/units/:unitId/quiz`. If the unit has no quiz, `data.data` is an empty array `[]`, and `QuizForm` renders with empty questions.
8. **Provider sets question count** → `TextField` labeled "Number of questions (1–20)", default `"5"`. Input is local `useState` — not RHF-controlled.
9. **Click "Generate Quiz"** → Client-side validates count (1–20), then fires `POST /api/admin/units/:unitId/generate-quiz` with body `{ questions_count: 5 }`.
10. **During generation** → "Generate Quiz" button shows loading spinner (`isGenerating = true`), "Save" button disabled.
11. **API returns** → Response is `{ data: ApiQuizType[] }`. `methods.reset({ questions: data })` repopulates the form. Toast: `"Quiz generated successfully!"`.
12. **Provider edits** → Can edit question text (`TextAreatField`), delete questions (delete icon), add new questions ("+ Add Question"), edit option labels (`TextField`), delete options, add options ("+ Add Option"), mark correct answer (`RadioField` True/False per option).
13. **Click "Save"** → `PUT /api/admin/units/:unitId/quiz` with body `{ questions: [...] }`. On success: `methods.reset({ questions: data })`, modal closes, `['unit-quiz']` cache invalidated → `SidePanel` refetches, button switches to "Edit Quiz".
14. **Delete quiz** → "Delete" button visible only if `questions.length > 0` → opens `ConfirmQuizDeleteModal` → confirm → `DELETE /api/admin/units/:unitId/quiz` → both modals close, toast `"Quiz deleted successfully"`, button switches back to "Include Quiz".

---

## 5. UI Architecture

### Page: `CourseProviderSectionsPage`
- **File**: `src/app/course-provider/courses/[id]/modules/[moduleId]/units/[unitId]/sections/page.tsx`
- **Purpose**: Extracts `id`, `moduleId`, `unitId` from URL params; passes them to module component.
- **Parent**: `CourseProviderProtectedRoute`
- **Child**: `CourseProviderSections` module component

### Module: `CourseProviderSections`
- **File**: `src/modules/course-provider/courses/id/modules/moduleId/units/unitId/sections/index.tsx`
- **Purpose**: Wraps `Editor` in `CourseProviderLayout`
- **Props**: `courseId`, `moduleId`, `unitId` (only `unitId` forwarded to `Editor`)

### Component: `Editor`
- **File**: `src/components/shared/courseProvider/editor/components/Editor.tsx`
- **Purpose**: Root of the editor UI — composes all sub-components
- **Props**: `unitId: number`
- **Children**: `EditorHeader`, `Sections` (col-span-2), `SidePanel` (col-span-1), `QuizModal`, `ConfirmQuizDeleteModal`, `TranslationsModal`
- **Layout**: CSS `grid-cols-3`

### Component: `SidePanel`
- **File**: `src/components/shared/courseProvider/editor/components/SidePanel.tsx`
- **Purpose**: Right panel with quiz entry button
- **Props**: none (reads `unitId` from `useParams()`)
- **Key logic**: `const hasQuiz = (quizResponse?.data?.length ?? 0) > 0`
- **Triggers**: `useQuizModal.openModal()`

### Component: `QuizModal`
- **File**: `src/components/shared/courseProvider/editor/components/modals/quiz/index.tsx`
- **Purpose**: Modal wrapper — fetches current quiz and renders `QuizForm`
- **Props**: `unitId: number`
- **Data source**: `useUnitQuiz(unitId)`

### Component: `QuizForm`
- **File**: `src/components/shared/courseProvider/editor/components/modals/quiz/QuizForm.tsx`
- **Purpose**: Core form — AI generation trigger, question editing, save/cancel/delete
- **Props**: `unitId: number`, `questions: ApiQuizType[]`
- **Local state**: `questionsCount` (useState, default `"5"`)
- **RHF state**: `questions[]` field array
- **Mutations**: `useUpdateUnitQuiz`, `useGenerateUnitQuiz`

### Component: `QuestionsForm`
- **File**: `src/components/shared/courseProvider/editor/components/modals/quiz/QuestionsForm.tsx`
- **Purpose**: All question fields with add/remove
- **RHF**: `useFieldArray({ name: "questions" })`
- **Features**: animated entries, `TextAreatField` for content, delete icon, "+ Add Question"

### Component: `OptionsForm`
- **File**: `src/components/shared/courseProvider/editor/components/modals/quiz/OptionsForm.tsx`
- **Purpose**: Options per question — add/remove, mark correct answer
- **Props**: `questionIndex: number`
- **RHF**: `useFieldArray({ name: "questions.${questionIndex}.options" })`
- **Features**: `TextField` for label, `RadioField` for `is_correct` (True/False), delete icon

### Component: `ConfirmQuizDeleteModal`
- **File**: `src/components/shared/courseProvider/editor/components/modals/ConfirmQuizDelete.tsx`
- **Purpose**: Confirmation dialog before deleting the entire quiz
- **Props**: `unitId: number`
- **Mutation**: `useDeleteUnitQuiz` — on success closes both modals and shows toast

### Shared UI Primitives
| Component | File | Notes |
|---|---|---|
| `Modal` | `src/components/ui/modal/index.tsx` | Chakra `ChakraModal`, 704px max-width, 90vh max-height |
| `MainButton` | `src/components/ui/button/MainButton.tsx` | Chakra `Button` wrapper |
| `TextField` | `src/components/ui/fields/TextField.tsx` | Plain HTML input with label + error |
| `TextAreatField` | `src/components/ui/fields/TextAreaField.tsx` | Auto-sizing textarea |
| `RadioField` | `src/components/ui/fields/RadioField.tsx` | Chakra `useRadioGroup` with True/False options |

---

## 6. API Contract Analysis

### 6.1 GET /api/admin/units/:unitId/quiz — Fetch Existing Quiz
- **File**: `src/api/courseProvider/units/index.ts` → `getUnitQuiz(unitId)`
- **Hook**: `useUnitQuiz(unitId)` in `src/api/courseProvider/units/hooks.ts`
- **Method**: `GET`
- **URL**: `/api/admin/units/${unitId}/quiz`
- **Payload**: none
- **Response**:
```json
{
  "data": [
    {
      "id": 1,
      "content": "Question text",
      "is_multiple": true,
      "options": [
        { "id": 10, "label": "Option A", "is_correct": true },
        { "id": 11, "label": "Option B", "is_correct": false }
      ]
    }
  ]
}
```
- **Auth**: `Authorization: Bearer <token>`
- **Failure**: 401 → global redirect to `/login`
- **Purpose**: Pre-populate quiz form on modal open; determine button label

---

### 6.2 POST /api/admin/units/:unitId/generate-quiz — AI Generate Quiz
- **File**: `src/api/courseProvider/units/index.ts` → `generateUnitQuiz({ unitId, params })`
- **Hook**: `useGenerateUnitQuiz()` in `src/api/courseProvider/units/hooks.ts`
- **Method**: `POST`
- **URL**: `/api/admin/units/${unitId}/generate-quiz`
- **Request payload**:
```json
{ "questions_count": 5 }
```
- **Response**: same shape as GET quiz (full `{ data: ApiQuizType[] }`)
- **Auth**: `Authorization: Bearer <token>`
- **Cache invalidation**: **NONE** — generated data goes only into RHF form state
- **On success**: `methods.reset({ questions: data })` + `toast.success("Quiz generated successfully!")`
- **On error**: `toast.error(error.response?.data.message || "Failed to generate quiz.")`
- **Purpose**: AI generation only — does NOT persist to database

---

### 6.3 PUT /api/admin/units/:unitId/quiz — Save / Update Quiz
- **File**: `src/api/courseProvider/units/index.ts` → `updateUnitQuiz({ unitId, data })`
- **Hook**: `useUpdateUnitQuiz()` in `src/api/courseProvider/units/hooks.ts`
- **Method**: `PUT`
- **URL**: `/api/admin/units/${unitId}/quiz`
- **Request payload**:
```json
{
  "questions": [
    {
      "id": null,
      "content": "What is X?",
      "is_multiple": true,
      "options": [
        { "id": null, "label": "Option A", "is_correct": true },
        { "id": null, "label": "Option B", "is_correct": false }
      ]
    }
  ]
}
```
  (`id` may be `null` for newly created items)
- **Response**: `{ data: ApiQuizType[] }` (server-confirmed state)
- **Auth**: `Authorization: Bearer <token>`
- **Error handling**:
  - `422` → iterates `error.response?.data.errors.questions[]` → one toast per message
  - Other → single `toast.error(error.response?.data.message || error.message)`
- **Cache invalidation**: `queryClient.invalidateQueries({ queryKey: ['unit-quiz'] })`
- **On success**: `methods.reset({ questions: serverData })` + `closeModal()`
- **Purpose**: Persist quiz (AI-generated or manually created)

---

### 6.4 DELETE /api/admin/units/:unitId/quiz — Delete Entire Quiz
- **File**: `src/api/courseProvider/units/index.ts` → `deleteUnitQuiz(unitId)`
- **Hook**: `useDeleteUnitQuiz()` in `src/api/courseProvider/units/hooks.ts`
- **Method**: `DELETE`
- **URL**: `/api/admin/units/${unitId}/quiz`
- **Payload**: none
- **Response**: void
- **Auth**: `Authorization: Bearer <token>`
- **Cache invalidation**: `queryClient.invalidateQueries({ queryKey: ['unit-quiz'] })`
- **On success**: closes both modals + `toast.success("Quiz deleted successfully")`
- **Purpose**: Remove all questions/options for the unit

---

### 6.5 Route Constant Definitions
```typescript
// src/api/constants.ts
quiz:         (unitId: number) => `/api/admin/units/${unitId}/quiz`
generateQuiz: (unitId: number) => `/api/admin/units/${unitId}/generate-quiz`
```

---

## 7. State Management and Data Flow

### Form State
- **Library**: React Hook Form (`useForm`, `useFieldArray`, `useFormContext`, `FormProvider`)
- **Initial state**: `{ questions: [] }` or `{ questions: [ApiQuizType[]] }` if quiz already exists
- **After AI generation**: `methods.reset({ questions: generatedData })` — replaces all questions
- **After save**: `methods.reset({ questions: serverResponseData })` — syncs with server

### Zustand Modal Stores
```typescript
// useQuizModal — src/components/shared/courseProvider/editor/hooks/useQuizModal.ts
{ isOpen: false, openModal: () => void, closeModal: () => void }

// useQuizDeleteModal — src/components/shared/courseProvider/editor/hooks/useQuizDeleteModal.ts
{ isOpen: false, openModal: () => void, closeModal: () => void }
```
Both are singleton Zustand stores (not persisted, not in global `useModalStore`).

### React Query Cache Keys
| Key | Used By | Invalidated When |
|---|---|---|
| `['unit-quiz', unitId]` | `useUnitQuiz(unitId)` | `useUpdateUnitQuiz`, `useDeleteUnitQuiz` |
| `['course-provider-sections', unitId]` | `useSectionsQuery(unitId)` | `useCreateSection`, `useEditSection`, `useReorderSections`, `useDeleteSection` |
| `['course-provider-unit', unitId]` | `useUnitQuery(unitId)` | `useAddUnitImage` |
| `['course-provider-units', moduleId]` | `useUnitsQuery(moduleId)` | `useCreateUnit`, `useEditUnit`, `useDeleteUnit` |

### Mutation Lifecycle
- **Generate**: `isGenerating = true` → `onSuccess: methods.reset(data) + toast` OR `onError: toast`
- **Save**: `isPending = true` → `onSuccess: methods.reset(data) + closeModal()` OR `onError: toast(s)`
- **Delete**: `isPending = true` → `onSuccess: closeAll + toast` OR `onError: toast`

---

## 8. Validation Rules

### Client-Side Zod Schema (`quiz.schema.ts`)
```typescript
const quizSchema = z.object({
  questions: z.array(z.object({
    id: z.number().nullable(),
    content: z.string(),
    is_multiple: z.boolean(),
    options: z.array(z.object({
      id: z.number().nullable(),
      label: z.string(),
      is_correct: z.boolean(),
    })),
  })),
});
```
- No `min`/`max` on questions array
- No `minLength` on `content` string
- No "at least one correct option" rule
- No min options per question

### Client-Side Inline Validation (`QuizForm.tsx`)
```typescript
if (isNaN(count) || count < 1 || count > 20) {
  toast.error("Number of questions must be between 1 and 20.");
  return;
}
```

### Backend Validation (Inferred from Error Handler)
- `422` response → `errors.questions[]` (string array) → each message toasted individually
- Any other error → single message: `error.response?.data.message || error.message`

### Save Blockers
- Both "Save" and "Generate Quiz" are `disabled={isPending || isGenerating}`

---

## 9. Permissions and Provider Rules

### Route Guard
```typescript
// src/routes/CourseProviderProtectedRoute.tsx
return token && user?.role === "CourseProvider"
  ? <Outlet />
  : <Navigate to={checkRouteByRole(user?.role)} replace />;
```

### Role Identifiers
```typescript
// src/constants/roles.ts
1: 'SuperAdmin'
2: 'CourseProvider'      ← can use quiz AI generation
3: 'Teacher'
4: 'Student'
5: 'SchoolAdmin'
6: 'SchoolCourseProvider' ← same editor, parallel route guard
```

### Behavior
- No per-feature permission flags — role check alone gates the entire editor
- No frontend-visible ownership check on units (backend enforces via auth context)
- `SchoolCourseProvider` uses an **identical** editor under `/school-course-provider/...` routes

---

## 10. Domain Model

### Entity Relationships
```
Course (1) ──► (N) Module
Module (1) ──► (N) Unit          ← "lesson" / "unit of learning"
Unit   (1) ──► (N) Section       ← content blocks (text, video, image, etc.)
Unit   (1) ──► (1) Quiz          ← AI generation target
Quiz   (1) ──► (N) Question
Question(1) ──► (N) Option
```

### Frontend Types Summary

| Entity | Type Name | File |
|---|---|---|
| Course | `CourseType` | `src/types/models/Course.ts` |
| Module | `ModuleType` | `src/types/models/Module.ts` |
| Unit | `UnitType` | `src/types/models/Unit.ts` |
| Section | `SectionType` | `src/types/models/Section.ts` |
| Question | `QuizType` | `src/types/models/Unit.ts` |
| Option | `QuizOptionType` | `src/types/models/Unit.ts` |
| API Question | `ApiQuizType` | `src/api/courseProvider/units/types.ts` |
| API Option | `ApiQuizOptionType` | `src/api/courseProvider/units/types.ts` |

### Section Types (numeric IDs sent to API)
```
1: TITLE_AND_TEXT  2: IMAGE   3: ALBUM    4: VIDEO
5: DOCUMENT        6: AUDIO   7: EMBED    8: NOTE_FOR_TEACHER
```

---

## 11. Migration Dependency Inventory

| Item | Type | File Path | Why Needed | Priority | Notes |
|---|---|---|---|---|---|
| `QuizForm` | Component | `src/components/shared/courseProvider/editor/components/modals/quiz/QuizForm.tsx` | Core UI: generation + edit + save | **Required** | All quiz business logic here |
| `QuestionsForm` | Component | `...modals/quiz/QuestionsForm.tsx` | Question list with add/remove | **Required** | Uses `useFieldArray` |
| `OptionsForm` | Component | `...modals/quiz/OptionsForm.tsx` | Option list per question | **Required** | Nested `useFieldArray` |
| `QuizModal` | Component | `...modals/quiz/index.tsx` | Modal wrapper | **Required** | Thin orchestrator |
| `ConfirmQuizDeleteModal` | Component | `...modals/ConfirmQuizDelete.tsx` | Delete confirmation | **Recommended** | UX guard |
| `quiz.schema.ts` | Zod Schema | `...modals/quiz/validation/quiz.schema.ts` | Form validation types | **Required** | |
| `useQuizModal` | Zustand Store | `...hooks/useQuizModal.ts` | Modal open/close state | **Required** | Replaceable with any state |
| `useQuizDeleteModal` | Zustand Store | `...hooks/useQuizDeleteModal.ts` | Delete modal state | **Recommended** | |
| `useUnitQuiz` | TanStack Query | `src/api/courseProvider/units/hooks.ts` | Fetch existing quiz | **Required** | |
| `useUpdateUnitQuiz` | TanStack Mutation | same | Save quiz | **Required** | |
| `useGenerateUnitQuiz` | TanStack Mutation | same | AI generate quiz | **Required** | Core feature |
| `useDeleteUnitQuiz` | TanStack Mutation | same | Delete quiz | **Recommended** | |
| `getUnitQuiz` / `updateUnitQuiz` / `generateUnitQuiz` / `deleteUnitQuiz` | API Functions | `src/api/courseProvider/units/index.ts` | Raw API calls | **Required** | |
| `CourseProviderApiRoutes.quiz` / `.generateQuiz` | Constants | `src/api/constants.ts` | URL builders | **Required** | |
| `ApiQuizType` / `ApiQuizOptionType` / `ApiGenerateQuizResponse` | Types | `src/api/courseProvider/units/types.ts` | Request/response typing | **Required** | |
| `QuizType` / `QuizOptionType` | Types | `src/types/models/Unit.ts` | Frontend domain types | **Required** | |
| `SidePanel` | Component | `src/components/shared/courseProvider/editor/components/SidePanel.tsx` | Quiz entry button | **Required** | Can be simplified |
| `Editor` | Component | `src/components/shared/courseProvider/editor/components/Editor.tsx` | Shell mounting QuizModal | **Required** | Tightly coupled to section editor |
| `Modal` | UI Primitive | `src/components/ui/modal/index.tsx` | Modal shell (Chakra) | **Replaceable** | Any modal works |
| `MainButton` | UI Primitive | `src/components/ui/button/MainButton.tsx` | Buttons | **Replaceable** | Thin Chakra wrapper |
| `TextField` | UI Primitive | `src/components/ui/fields/TextField.tsx` | Question count input | **Replaceable** | |
| `TextAreatField` | UI Primitive | `src/components/ui/fields/TextAreaField.tsx` | Question content | **Replaceable** | |
| `RadioField` | UI Primitive | `src/components/ui/fields/RadioField.tsx` | Correct answer radio | **Replaceable** | |
| `client` (Axios) | API Client | `src/api/index.ts` | HTTP client with auth | **Replaceable** | Preserve Bearer token logic |
| `queryClient` (TanStack) | Query Client | `src/api/index.ts` | Cache management | **Replaceable** | |
| `react-hook-form` | Library | `package.json` | Form state | **Required** | Deep dependency |
| `zod` + `@hookform/resolvers/zod` | Library | `package.json` | Schema validation | **Required** | |
| `react-toastify` | Library | `package.json` | Notifications | **Replaceable** | Use target project's system |
| `framer-motion` | Library | `package.json` | Entry animations | **Optional** | Remove if unavailable |
| `zustand` | Library | `package.json` | Modal state | **Replaceable** | Use any state solution |
| `@chakra-ui/react` | Library | `package.json` | Modal + Radio + Button | **Replaceable** | Largest migration surface |
| `CourseProviderProtectedRoute` | Route Guard | `src/routes/CourseProviderProtectedRoute.tsx` | Role check | **Replaceable** | Adapt to target auth |

---

## 12. End-to-End Sequence Diagram (Textual)

```
Provider is authenticated (role = "CourseProvider")
  └─► Navigate to /course-provider/courses/:id/modules/:moduleId/units/:unitId/sections
        └─► CourseProviderProtectedRoute validates role
              └─► Editor renders with unitId from URL
                    ├─► SidePanel mounts
                    │     └─► useUnitQuery(unitId)  →  GET /api/admin/units/:unitId
                    │     └─► useUnitQuiz(unitId)   →  GET /api/admin/units/:unitId/quiz
                    │           └─► quizResponse.data.length > 0?
                    │                 ├─ YES: button label = "Edit Quiz"
                    │                 └─ NO:  button label = "Include Quiz"
                    └─► QuizModal mounted but isOpen = false

Provider clicks "Include Quiz" / "Edit Quiz"
  └─► useQuizModal.openModal() → isOpen = true
        └─► QuizModal renders
              └─► QuizForm initialized with RHF: { questions: existingOrEmpty }

Provider sets question count (default 5)

Provider clicks "Generate Quiz"
  └─► handleGenerateQuiz() validates count in [1..20]
        └─► useGenerateUnitQuiz.mutate({ unitId, params: { questions_count: N } })
              └─► POST /api/admin/units/:unitId/generate-quiz  { questions_count: N }
                    ├─► isGenerating = true → buttons disabled + spinner
                    └─► Backend runs AI generation
                          ├─ onSuccess: { data: ApiQuizType[] }
                          │     └─► methods.reset({ questions: data })
                          │           └─► QuestionsForm renders N questions
                          │           └─► toast.success("Quiz generated successfully!")
                          └─ onError:
                                └─► toast.error(message || "Failed to generate quiz.")

Provider edits questions/options (optional)
  ├─► Edit question content in TextAreatField
  ├─► Add/remove questions via useFieldArray
  ├─► Edit option labels in TextField
  ├─► Mark correct answer via RadioField (is_correct true/false)
  └─► Add/remove options via nested useFieldArray

Provider clicks "Save"
  └─► methods.handleSubmit(onSubmit)
        └─► useUpdateUnitQuiz.mutate({ unitId, data: { questions: [...] } })
              └─► PUT /api/admin/units/:unitId/quiz  { questions: [...] }
                    ├─► isPending = true → buttons disabled
                    └─► onSuccess: { data: ApiQuizType[] }
                          ├─► methods.reset({ questions: serverData })
                          ├─► closeModal()
                          └─► queryClient.invalidateQueries(['unit-quiz'])
                                └─► useUnitQuiz refetches → SidePanel shows "Edit Quiz"

Optional: Provider clicks "Delete"
  └─► openConfirmQuizDeleteModal()
        └─► ConfirmQuizDeleteModal opens
              └─► Provider confirms deletion
                    └─► useDeleteUnitQuiz.mutate(unitId)
                          └─► DELETE /api/admin/units/:unitId/quiz
                                ├─► closeDeleteModal()
                                ├─► closeQuizModal()
                                ├─► queryClient.invalidateQueries(['unit-quiz'])
                                └─► toast.success("Quiz deleted successfully")
                                      └─► SidePanel: button → "Include Quiz"
```

---

## 13. Target Project Implementation Plan

### Phase 1 — API Contract Preparation
**Goals**: Confirm backend implements all four quiz endpoints.

**Required endpoints**:
- `GET  /api/admin/units/:unitId/quiz` → `{ data: ApiQuizType[] }`
- `POST /api/admin/units/:unitId/generate-quiz` → same response, accepts `{ questions_count: number }`
- `PUT  /api/admin/units/:unitId/quiz` → same response, accepts full questions array
- `DELETE /api/admin/units/:unitId/quiz` → 204 / empty 200

**Risks**: Verify whether backend uses unit's section content as AI context. Confirm `null` IDs are accepted on save.

---

### Phase 2 — Domain Types and Schemas
**Goals**: Establish TypeScript types and Zod schemas for quiz entities.

**Copy directly**:
- `src/api/courseProvider/units/types.ts` (quiz-related types only)
- `src/types/models/Unit.ts` (`QuizType`, `QuizOptionType`)
- `src/components/shared/courseProvider/editor/components/modals/quiz/validation/quiz.schema.ts`

**Implementation Notes**: If target uses different entity naming (e.g. `lesson` vs `unit`), rename types but keep API field names matching the contract.

---

### Phase 3 — Section-Level Provider UI (Editor Shell)
**Goals**: Build or adapt the unit-level editor page where the quiz button lives.

**Required**:
- Page at unit-detail level (URL must contain `unitId`)
- Side panel or toolbar with "Include Quiz" / "Edit Quiz" button
- Logic: `const hasQuiz = (quizData?.length ?? 0) > 0`
- Route protected by provider role

**Risks**: If target project layout has no side panel, the entry point must be redesigned.

---

### Phase 4 — AI Generation Modal / Form
**Goals**: Implement `QuizModal` → `QuizForm` with generate action.

**Copy and adapt**:
- `QuizModal` — replace `Modal` wrapper with target project's modal
- `QuizForm` — replace `MainButton`, `TextField` with target DS; keep `questionsCount` as local `useState`
- `useQuizModal` Zustand store

**Key invariant to preserve**: `methods.reset({ questions: data })` after generation — this bridges AI response to form state.

**Risks**: Ensure modal is scrollable (max-height 90vh, overflow-y auto).

---

### Phase 5 — Generated Quiz Preview / Editor
**Goals**: Implement `QuestionsForm` and `OptionsForm` with full editing capability.

**Copy and adapt**:
- `QuestionsForm` — replace `TextAreatField` and `DeleteIcon`; keep `useFieldArray` pattern
- `OptionsForm` — replace `TextField`, `RadioField`, `DeleteIcon`; keep nested `useFieldArray`

**Remove if unavailable**: `framer-motion` `motion.div` wrappers (animations are cosmetic)

**Key invariant**: Nested `useFieldArray` (`questions.${index}.options`) — requires RHF v7+.

---

### Phase 6 — Save / Update Integration
**Goals**: Wire save mutation, cache invalidation, modal close behavior.

**Copy and adapt**:
- `useUpdateUnitQuiz` mutation — adapt query key naming to target project
- `useDeleteUnitQuiz` mutation
- `ConfirmQuizDeleteModal`

**Error handling to preserve**:
```typescript
if (error.status === 422) {
  error.response?.data.errors?.questions.forEach((msg) => toast.error(msg));
} else {
  toast.error(error.response?.data.message || error.message);
}
```

---

### Phase 7 — Permission Wiring
**Goals**: Ensure only provider roles access the editor.

**Adapt to target**:
- Route guard checking `user.role === "CourseProvider"`
- Redirect logic for unauthorized access
- If target uses permission-based auth, map `CourseProvider` role to appropriate permissions

---

### Phase 8 — QA / Edge Case Coverage
**Test scenarios**:
1. First quiz creation: empty form → generate → save
2. Edit existing quiz: existing questions → generate overwrites (no confirmation)
3. Generate with count = 0 → client-side toast, no API call
4. Generate with count = 21 → client-side toast, no API call
5. Save fails with 422 → multiple error toasts, modal stays open
6. Generate fails → error toast, form unchanged
7. Delete quiz → both modals close, button reverts to "Include Quiz"
8. Add question manually (no generation) → save works identically
9. Concurrent clicks → buttons are disabled during mutations
10. Close modal via X → form state is NOT reset (reopening shows same state)

---

## 14. Minimal Rebuild Checklist

```
TYPES AND SCHEMAS
[ ] Define ApiQuizOptionType { id, label, is_correct }
[ ] Define ApiQuizType { id, content, is_multiple, options: ApiQuizOptionType[] }
[ ] Define ApiQuizTypeResponse { data: ApiQuizType[] }
[ ] Define ApiGenerateQuizPayload { questions_count: number }
[ ] Define ApiGenerateQuizResponse { data: ApiQuizType[] }
[ ] Define ApiGenerateQuizErrorResponse (AxiosError shape)
[ ] Define ApiUpdateQuizErrorResponse (AxiosError shape)
[ ] Define QuizSchema (Zod) with questions array and nested options
[ ] Export quizSchemaResolver = zodResolver(quizSchema)

API FUNCTIONS
[ ] getUnitQuiz(unitId)          → GET    /api/admin/units/:unitId/quiz
[ ] updateUnitQuiz({ unitId, data }) → PUT /api/admin/units/:unitId/quiz
[ ] generateUnitQuiz({ unitId, params }) → POST /api/admin/units/:unitId/generate-quiz
[ ] deleteUnitQuiz(unitId)       → DELETE /api/admin/units/:unitId/quiz

REACT QUERY HOOKS
[ ] useUnitQuiz(unitId)         — query, key: ['unit-quiz', unitId]
[ ] useUpdateUnitQuiz()         — mutation, invalidates ['unit-quiz'] on success
[ ] useGenerateUnitQuiz()       — mutation, NO cache invalidation
[ ] useDeleteUnitQuiz()         — mutation, invalidates ['unit-quiz'] on success

STATE STORES
[ ] useQuizModal Zustand store: { isOpen, openModal, closeModal }
[ ] useQuizDeleteModal Zustand store: { isOpen, openModal, closeModal }

COMPONENTS
[ ] OptionsForm       — nested field array for options per question
[ ] QuestionsForm     — field array for questions, renders OptionsForm
[ ] QuizForm          — form shell: generate button, question count, save/cancel/delete
[ ] QuizModal         — modal wrapper fetching quiz data, rendering QuizForm
[ ] ConfirmQuizDeleteModal — delete confirmation dialog

ENTRY POINT
[ ] SidePanel (or equivalent) with "Include Quiz" / "Edit Quiz" button
[ ] Button logic: hasQuiz = (quizData?.length ?? 0) > 0
[ ] QuizModal and ConfirmQuizDeleteModal mounted at editor root level

ROUTE PROTECTION
[ ] Role guard: user.role === "CourseProvider" OR "SchoolCourseProvider"
[ ] unitId param accessible via useParams() at the sections editor page

UX DETAILS
[ ] Buttons disabled during isPending || isGenerating
[ ] Generate button shows loading spinner
[ ] toast.success on generate: "Quiz generated successfully!"
[ ] toast.success on delete: "Quiz deleted successfully"
[ ] toast.error per 422 field error on save
[ ] "Delete" button shown only when questions.length > 0
[ ] Modal: max-width 704px, centered, scrollable (90vh max)
```

---

## 15. Gap List for Cross-Project Migration

| Area | Can Copy Directly | Must Adapt |
|---|---|---|
| **Routing** | Route path patterns (`:unitId` param) | Adapt to target router (React Router v6 / Next.js App Router / etc.) |
| **Design system** | None (hardcoded Chakra) | Replace all `@chakra-ui/react` primitives: Modal, Button, RadioGroup, Stack |
| **Auth / Token** | Bearer token injection concept | Adapt to target token storage location and localStorage key name |
| **API client** | Axios `client` pattern | Replace with target HTTP client; preserve 401 redirect behavior |
| **Query library** | TanStack Query hook patterns | Port to target query library; preserve cache key `['unit-quiz', unitId]` |
| **Forms** | React Hook Form + Zod + nested `useFieldArray` | Directly portable if target uses RHF; redesign for Formik/RJSF/etc. |
| **Notification system** | Toast call sites (`toast.success`, `toast.error`) | Replace `react-toastify` with target notification API |
| **Role model** | Role names `CourseProvider`, `SchoolCourseProvider` | Map to target project's role/permission identifiers |
| **i18n** | N/A (no i18n used in quiz components) | Add i18n wrapper if target requires translated strings |
| **Entity naming** | `Unit`, `Quiz`, `Question`, `Option` | If target uses `Lesson`, `Assessment`, etc., rename throughout |
| **Animation library** | `framer-motion` (optional) | Remove or replace with target animation solution |
| **State store pattern** | Zustand `create<Store>` | Directly portable; or replace with Context/Redux/Jotai |

---

## 16. Final Recommendation

### Strategy: Partial Extraction + Targeted Adaptation

**Copy directly** (self-contained, no project-specific infrastructure):
- `quiz.schema.ts` — pure Zod, zero dependencies
- `QuizForm.tsx`, `QuestionsForm.tsx`, `OptionsForm.tsx` — core form logic; UI primitives are replaceable
- `useQuizModal.ts`, `useQuizDeleteModal.ts` — pure Zustand, trivially portable
- `src/api/courseProvider/units/types.ts` — pure TypeScript interfaces
- API function implementations (adapt URL builders only)
- React Query hooks (adapt cache key names only)

**Do NOT copy blindly**:
- `Editor.tsx` — deeply integrated with section list, translations modal, etc.; extract only the quiz fragment
- `SidePanel.tsx` — extract only the quiz button logic; discard commented-out code
- `src/api/index.ts` Axios client — 401 handler redirects to `AuthRoutes.login` which is project-specific

**Reimplement from behavior** (too tightly coupled to extract):
- Route protection wrappers — reimplement in target auth system
- `CourseProviderLayout` — use target project's layout shell
- UI primitives (`Modal`, `Button`, `TextField`, etc.) — reimplement with target design system

**Estimated effort**: 3–5 days for an engineer familiar with React Hook Form and TanStack Query, assuming the target project's design system and API client are already in place.
