# Last Changes – Migration Guide

> **Scope:** All changes made to the LMS frontend during the recent task series.
> This document is written so a developer can reproduce every change manually in another project.

---

## 1. Overview

### What was done
Eight separate tasks were completed in sequence:

| # | Task |
|---|------|
| 1 | Added "Students Who Need Attention" block to the Teacher dashboard |
| 2 | Refactored the Teacher page to use Swagger-confirmed API endpoints |
| 3 | Fixed a critical UI freeze when selecting a course |
| 4 | Removed all legacy student routes; replaced with authoritative teacher endpoints |
| 5 | Updated the teacher students-list endpoint to `GET /api/teacher/students` (no courseId) |
| 6 | Fixed duplicate React keys (`.$0`) and "Student #undefined" in the students list |
| 7 | Fixed "unknown student" by rewriting analytics integration around the real per-question API shape |
| 8 | Attempted (then reverted) a sidebar collapsed-logo size fix |

### Goal
Build a fully functional Teacher dashboard that:
- Fetches real data from five Swagger-confirmed endpoints.
- Shows course analytics, at-risk students, a full student list, and unit-level quiz analytics.
- Has no UI freezes, no duplicate-key warnings, and no "unknown student" labels.

---

## 2. List of Changed Files

| File | Why it was changed |
|------|--------------------|
| `src/api/constants.ts` | Add/replace teacher endpoint URL constants; remove legacy routes |
| `src/api/user/types.ts` | Define types for per-question analytics, teacher students, pagination |
| `src/api/user/index.ts` | Add/replace raw API functions for teacher endpoints; delete legacy ones |
| `src/api/user/hooks.ts` | Add React Query hooks for every teacher endpoint; tune `staleTime`/`enabled` |
| `src/modules/user/teacher/index.tsx` | Full rewrite of Teacher dashboard page |
| `src/modules/user/teacher/utils/atRisk.ts` | Create shared transformer (per-question → per-student) and risk helpers |
| `src/modules/user/teacher/components/AtRiskStudents.tsx` | New component – "Students Who Need Attention" block |
| `src/modules/user/teacher/components/CourseAnalyticsCard.tsx` | New component – Course quiz overview stats |
| `src/modules/user/teacher/components/CourseStudentsList.tsx` | New component – All teacher students list |
| `src/modules/user/teacher/components/UnitAnalyticsBlock.tsx` | New component – Unit-level quiz analytics with unit selector |
| `src/components/shared/user/teacher/index.tsx` | Switched from legacy hook to `useTeacherStudentCourses`; client-side sort/filter |
| `src/components/shared/user/teacher/constants/studentsCourseTable.tsx` | Aligned `StudentCourse` type with `TeacherStudentCourse` |
| `src/components/shared/user/quiz/index.tsx` | Switched from legacy hook to `useTeacherStudentCourseQuizResults` |
| `src/components/ui/logo/index.tsx` | Reverted to original (logo fix was applied then undone) |
| `src/components/ui/layouts/user.tsx` | Reverted logo-section changes; sidebar logic unchanged |

---

## 3. Detailed Change Log

### 3.1 `src/api/constants.ts`

**Previous:** Had `students`, `studentCourse`, `studentQuiz` routes. Teacher students endpoint was `teacherCourseStudents: (courseId) => …/course/${courseId}/students`.

**New:** Removed legacy routes. Teacher student endpoints are:

```ts
quizAnalyticsCourse: (courseId: number) => `/api/teacher/courses/${courseId}/quiz-analytics`,
quizAnalyticsUnit:   (unitId: number)   => `/api/teacher/units/${unitId}/quiz-analytics`,
teacherStudents:     `/api/teacher/students`,   // static – no courseId
teacherStudentCourses: (userId: number) => `/api/teacher/students/${userId}/courses`,
teacherStudentCourseQuizResults: (userId: number, courseId: number) =>
  `/api/teacher/students/${userId}/courses/${courseId}/quiz-results`,
```

**Required when porting:** Yes. Adjust the base prefix if your axios `baseURL` already includes `/api`.

---

### 3.2 `src/api/user/types.ts`

**Previous:** Had `QuizAnalyticsStudentEntry` (per-student shape). Missing pagination types for teacher students.

**New state (complete):**

```ts
// Per-question analytics entry (used by BOTH course and unit endpoints)
export type QuizAnalyticsQuestionEntry = {
  question_id: number;
  question_content: string;
  total_answers: number;
  correct_answers: number;
  accuracy: number;           // 0..1 fraction – multiply by 100 for %
  incorrect_user_ids: number[];
};
export type QuizAnalyticsCourseResponse = { data: QuizAnalyticsQuestionEntry[] };
export type QuizAnalyticsUnitResponse   = QuizAnalyticsCourseResponse; // same shape

// Teacher student
export type TeacherStudent = {
  id: number; school_id: number; name: string;
  first_name: string; last_name: string; email: string;
  phone: string | null; image: string | null;
  gender: number; birthday: string | null; role: number;
  created_at: string; language: string; timezone: string; theme: string;
  send_notifications: boolean; course_reminders: boolean; new_courses: boolean;
  assignment_feedback: boolean; progress_updates: boolean; announcements: boolean;
};
export type PaginationLinks = { first: string; last: string; prev: string|null; next: string|null };
export type PaginationMeta  = { current_page: number; from: number|null; last_page: number;
                                per_page: number; to: number|null; total: number; path: string };
export type TeacherStudentsResponse = { data: TeacherStudent[]; links: PaginationLinks; meta: PaginationMeta };

export type TeacherStudentCourse = {
  id: number; name: string; description?: string; instructor?: string;
  progress?: number; progress_status?: number; modules_count?: number;
  duration?: number; status?: number; image?: string | null;
};
export type TeacherStudentCoursesResponse = { data: TeacherStudentCourse[] };

export type TeacherQuizResultEntry = {
  id?: number; unit_id?: number; unit_name?: string;
  score: number; correct_answers: number; total_questions: number; answers?: any[];
};
export type TeacherStudentCourseQuizResultsResponse = { data: TeacherQuizResultEntry[] };
```

**Required when porting:** Yes – types must match your backend's actual response shapes.

---

### 3.3 `src/api/user/index.ts`

**Removed:** `GetStudents`, `GetStudentCourse`, `GetStudentQuiz`.

**Added/replaced:**

```ts
export const GetQuizAnalyticsCourse = async (courseId: number) =>
  (await client.get(UserApiRoutes.quizAnalyticsCourse(courseId))).data;

export const GetQuizAnalyticsUnit = async (unitId: number) =>
  (await client.get(UserApiRoutes.quizAnalyticsUnit(unitId))).data;

export const GetTeacherStudents = async (): Promise<TeacherStudentsResponse> =>
  (await client.get(UserApiRoutes.teacherStudents)).data;

export const GetTeacherStudentCourses = async (userId: number): Promise<TeacherStudentCoursesResponse> =>
  (await client.get(UserApiRoutes.teacherStudentCourses(userId))).data;

export const GetTeacherStudentCourseQuizResults = async (
  userId: number, courseId: number
): Promise<TeacherStudentCourseQuizResultsResponse> =>
  (await client.get(UserApiRoutes.teacherStudentCourseQuizResults(userId, courseId))).data;
```

**Required when porting:** Yes.

---

### 3.4 `src/api/user/hooks.ts`

**Removed:** `useGetStudents`, `useGetStudentCourse`, `useGetStudentQuiz`.

**Key design decisions applied to all teacher hooks:**

```ts
const TEACHER_STALE_TIME = 5 * 60 * 1000; // 5 minutes – prevents burst refetch on course change
```

**Added/replaced:**

```ts
// Course quiz analytics
export const useGetQuizAnalyticsCourse = (courseId?: number) => useQuery<QuizAnalyticsCourseResponse>({
  queryKey: ["quiz-analytics-course", courseId],   // primitive in key – stable
  queryFn:  () => GetQuizAnalyticsCourse(courseId as number),
  enabled:  !!courseId && courseId > 0,            // guard – no fire with undefined
  staleTime: TEACHER_STALE_TIME,
  retry: false,
});

// Unit quiz analytics
export const useGetQuizAnalyticsUnit = (unitId?: number) => useQuery<QuizAnalyticsUnitResponse>({
  queryKey: ["quiz-analytics-unit", unitId],
  queryFn:  () => GetQuizAnalyticsUnit(unitId as number),
  enabled:  !!unitId && unitId > 0,
  staleTime: TEACHER_STALE_TIME,
  retry: false,
});

// All teacher students (no courseId param)
export const useTeacherStudents = () => useQuery<TeacherStudentsResponse>({
  queryKey: ["teacher-students"],                  // always-static key
  queryFn:  GetTeacherStudents,
  staleTime: TEACHER_STALE_TIME,
  retry: false,
  placeholderData: (prev) => prev,                 // no flash on refetch
});

// Student courses (teacher view)
export const useTeacherStudentCourses = (userId?: number) => useQuery<TeacherStudentCoursesResponse>({
  queryKey: ["teacher-student-courses", userId],
  queryFn:  () => GetTeacherStudentCourses(userId as number),
  enabled:  !!userId && userId > 0,
  staleTime: TEACHER_STALE_TIME,
  retry: false,
  placeholderData: (prev) => prev,
});

// Student quiz results for a course (teacher view)
export const useTeacherStudentCourseQuizResults = (userId?: number, courseId?: number) =>
  useQuery<TeacherStudentCourseQuizResultsResponse>({
    queryKey: ["teacher-student-quiz-results", userId, courseId],
    queryFn:  () => GetTeacherStudentCourseQuizResults(userId as number, courseId as number),
    enabled:  !!userId && userId > 0 && !!courseId && courseId > 0,
    staleTime: TEACHER_STALE_TIME,
    retry: false,
  });
```

**Required when porting:** Yes. The `enabled` guards and `staleTime` are critical for freeze prevention.

---

### 3.5 `src/modules/user/teacher/utils/atRisk.ts` *(new file)*

**Purpose:** Pure, unit-testable helpers that convert per-question analytics → per-student rows.

**Complete current content:**

```ts
import type { QuizAnalyticsQuestionEntry, TeacherStudent } from "api/user/types";

export const RISK_THRESHOLDS = { HIGH: 60, MEDIUM: 70 } as const;
export type RiskLevel = "high" | "medium";

export type AtRiskStudent = {
  studentId: number;
  name: string;
  email?: string;
  image?: string | null;
  avgScore: number;         // 0–100
  totalAttempts: number;    // = incorrectCount
  failedAttempts: number;   // = incorrectCount
  riskScore: number;        // sort key – higher = worse
};

export function getRiskLevel(avgScore: number): RiskLevel {
  return avgScore < RISK_THRESHOLDS.HIGH ? "high" : "medium";
}

export function resolveStudentName(student: TeacherStudent): string {
  if (student.name) return student.name;
  const full = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim();
  return full || `Student #${student.id}`;
}

/**
 * Shared transformer: per-question entries → per-student rows (all students).
 * Used by AtRiskStudents (course flow) AND UnitAnalyticsBlock (unit flow).
 */
export function buildStudentRowsFromQuestions(
  questions: QuizAnalyticsQuestionEntry[],
  studentsById: Map<number, TeacherStudent>,
): AtRiskStudent[] {
  const totalQuestions = questions.length;
  if (totalQuestions === 0) return [];

  const incorrectByUser = new Map<number, number>();
  for (const q of questions) {
    for (const rawId of q.incorrect_user_ids) {
      const uid = Number(rawId);
      incorrectByUser.set(uid, (incorrectByUser.get(uid) ?? 0) + 1);
    }
  }

  return [...incorrectByUser.entries()]
    .map(([userId, incorrectCount]): AtRiskStudent => {
      const avgScore = Math.max(0, Math.min(100,
        ((totalQuestions - incorrectCount) / totalQuestions) * 100));
      const incorrectRate = incorrectCount / totalQuestions;
      const student = studentsById.get(userId);
      const name = student ? resolveStudentName(student) : `Student #${userId}`;
      return {
        studentId: userId, name,
        email: student?.email,
        image: student?.image ?? null,
        avgScore, totalAttempts: incorrectCount, failedAttempts: incorrectCount,
        riskScore: (100 - avgScore) + incorrectRate * 40,
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);
}

/** Filtered version: only students below MEDIUM threshold, capped at topN. */
export function computeAtRiskFromQuestions(
  questions: QuizAnalyticsQuestionEntry[],
  studentsById: Map<number, TeacherStudent>,
  topN = 10,
): AtRiskStudent[] {
  return buildStudentRowsFromQuestions(questions, studentsById)
    .filter((s) => s.avgScore < RISK_THRESHOLDS.MEDIUM)
    .slice(0, topN);
}
```

**Required when porting:** Yes – this is the core business logic.

---

### 3.6 `src/modules/user/teacher/index.tsx` *(full rewrite)*

**Previous behavior:** Legacy `AllStudentsTable` using `useGetStudents`, no course selector, no analytics blocks.

**New behavior:**

- `useTransition` wraps `setSelectedCourseId` so the dropdown repaint is instant.
- Four child blocks rendered in a `<VStack spacing={6}>`: `CourseAnalyticsCard`, `AtRiskStudents`, `CourseStudentsList`, `UnitAnalyticsBlock`.
- Inline `<ChakraSpinner>` shown next to the dropdown while loading/pending.
- No legacy imports (`useGetStudents`, TanStack table, etc.).

**Key snippet:**

```tsx
const [isPending, startTransition] = useTransition();
const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

const handleCourseChange = useCallback((e) => {
  const val = e.target.value;
  startTransition(() => { setSelectedCourseId(val ? Number(val) : null); });
}, [startTransition]);
```

**Required when porting:** Yes. The `useTransition` pattern is what prevents the freeze.

---

### 3.7 Teacher dashboard sub-components *(all new files)*

#### `CourseAnalyticsCard.tsx`
- Calls `useGetQuizAnalyticsCourse(courseId)`.
- Computes stats from `QuizAnalyticsQuestionEntry[]`: `totalQuestions`, `avgAccuracy` (`accuracy × 100`), `passRate`, `atRisk` (unique IDs in `incorrect_user_ids`).
- Shows four `StatCard` tiles + an accuracy progress bar.
- `mt={6}` on root `<Box>`.

#### `AtRiskStudents.tsx`
- Calls `useGetQuizAnalyticsCourse(courseId)` AND `useTeacherStudents()`.
- Builds `studentsById: Map<number, TeacherStudent>` from the students response.
- Calls `computeAtRiskFromQuestions(analyticsData.data, studentsById)`.
- Renders `StudentRow` per result; `key={student.studentId}` (real DB user ID → always unique).
- "View details" navigates to `UserRoutes.quiz.replace(":id", userId).replace(":courseId", courseId)`.
- `mt={6}` on root `<Box>`.

#### `CourseStudentsList.tsx`
- Calls `useTeacherStudents()` (no params).
- Client-side search over `data.data` (array); uses `student.id` as key.
- Displays `first_name + last_name` (via `fullName()` helper), email, phone.
- "View details" → `UserRoutes.studentCourse.replace(":id", studentId)`.

#### `UnitAnalyticsBlock.tsx`
- Has internal `selectedUnitId` state; `useEffect(() => { setSelectedUnitId(null); }, [courseId])` resets it on course change — **this is the freeze fix for the unit block**.
- Calls `useGetQuizAnalyticsUnit(selectedUnitId)` AND `useTeacherStudents()`.
- Uses the shared `buildStudentRowsFromQuestions` transformer (not filtered by risk).
- `key={student.studentId}`, `mt={6}` on root `<Box>`.

---

### 3.8 `src/components/shared/user/teacher/index.tsx` (StudentsCourse)

**Previous:** Called `useGetStudentCourse(studentId)` — legacy endpoint.

**New:** Calls `useTeacherStudentCourses(studentId)`.
- Server-side `sort`/`search` parameters removed (endpoint doesn't support them).
- Client-side filtering and sorting implemented instead:

```ts
const rawCourses = data?.data ?? [];
const filtered = rawCourses
  .filter((c) => search.trim() ? c.name.toLowerCase().includes(search.trim().toLowerCase()) : true)
  .sort((a, b) => { … });
```

---

### 3.9 `src/components/shared/user/quiz/index.tsx` (StudentQuizResultContent)

**Previous:** Called legacy `useGetStudentQuiz`.

**New:** Calls `useTeacherStudentCourseQuizResults(studentId, courseIdNumber)`.

---

### 3.10 Logo + Sidebar (Task 8 – reverted)

A logo-size fix was applied and then **fully reverted**. The current state of both files is the original pre-fix code:

- `src/components/ui/logo/index.tsx` — Tailwind classes `w-[150px] h-[150px] md:w-[220px] md:h-[220px]`.
- `src/components/ui/layouts/user.tsx` — `HStack` with static `px="8px"`, no `overflow="hidden"`.

**Required when porting:** Not applicable (reverted).

---

## 4. UI / Styling Changes

### 4.1 Teacher Dashboard Layout

- All dashboard blocks live inside `<VStack spacing={6} align="stretch">`.
- Each block is wrapped in `<UserBox>` (the existing styled container from `components/ui/layouts/user.tsx`).
- Every new block has `mt={6}` on its internal root `<Box>` for internal top breathing room.

### 4.2 Risk Colour Palette

| Level | Border | Badge scheme | Score colour |
|-------|--------|--------------|--------------|
| High  | `#FC8181` | `red` | `#C53030` |
| Medium | `#F6AD55` | `orange` | `#C05621` |
| Pass | `#D7E8EE` | `green` | `#2F855A` |

### 4.3 Stat Cards (CourseAnalyticsCard)

```tsx
<StatCard label="Questions in quiz"     value={stats.totalQuestions} />
<StatCard label="Average accuracy"       value={`${stats.avgScore.toFixed(0)}%`} />
<StatCard label="Pass rate (≥ 60%)"     value={`${stats.passRate}%`} />
<StatCard label="Students with mistakes" value={stats.atRisk} />
```

Card style: `p={4}`, `borderWidth="1px"`, `borderColor="#D7E8EE"`, `borderRadius="8px"`, `textAlign="center"`.

### 4.4 Student Row Avatar

```tsx
<Avatar size="sm" name={student.name} src={student.image ?? undefined}
        bg="#DDECF7" color="#0070C1" />
```

### 4.5 Empty State Colours

| State | Border | Background | Text |
|-------|--------|------------|------|
| No course selected | `#D7E8EE` | `#F5F7F9` | `#718096` |
| Error | `#FC8181` | `#FFF5F5` | `#C53030` |
| All clear | `#9AE6B4` | `#F0FFF4` | `#2F855A` |

---

## 5. Components and Logic Updates

### 5.1 `useTransition` for Course Selection (Freeze Fix)

```tsx
const [isPending, startTransition] = useTransition();
const handleCourseChange = useCallback((e) => {
  startTransition(() => setSelectedCourseId(Number(e.target.value) || null));
}, [startTransition]);
```

Without `startTransition`, setting `selectedCourseId` is a synchronous high-priority update that blocks the browser paint until all child components re-render.

### 5.2 `staleTime` on All Teacher Queries

```ts
const TEACHER_STALE_TIME = 5 * 60 * 1000;
```

Default `staleTime=0` caused React Query to immediately refetch on every component remount, creating burst requests when switching courses. Five minutes prevents this without sacrificing data freshness.

### 5.3 Unit Reset Effect (Freeze Fix #2)

In `UnitAnalyticsBlock`:

```ts
useEffect(() => { setSelectedUnitId(null); }, [courseId]);
```

Without this, `selectedUnitId` retained a stale value from the previous course, causing `useGetQuizAnalyticsUnit` to fire with a mismatched unit immediately on course change.

### 5.4 Student Name Resolution Priority

```ts
export function resolveStudentName(student: TeacherStudent): string {
  if (student.name) return student.name;
  const full = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim();
  return full || `Student #${student.id}`;
}
```

If the `studentsById` map doesn't contain the userId at all (genuine unknown), the fallback is `` `Student #${userId}` `` (numeric, never `#undefined`).

### 5.5 `accuracy` Field Normalisation

The API returns `accuracy` as a **fraction (0..1)**, not a percentage. All calculations multiply by 100:

```ts
const avgAccuracy = (questions.reduce((sum, q) => sum + q.accuracy, 0) / totalQuestions) * 100;
const passing     = questions.filter(q => q.accuracy * 100 >= RISK_THRESHOLDS.HIGH).length;
```

### 5.6 React Key Stability

- Student rows: `key={student.studentId}` — real DB user ID from `incorrect_user_ids`, always unique.
- Student list rows: `key={student.id}` — the primary key from `/api/teacher/students`.
- Never use array index as key for lists that can reorder.

---

## 6. Step-by-Step Transfer Guide

Follow this order when applying to another project:

### Step 1 – Types (`src/api/user/types.ts`)

Add all types from section 3.2. Verify `accuracy` is documented as `0..1`.

### Step 2 – API Constants (`src/api/constants.ts`)

Add the five teacher routes from section 3.1. Check whether your axios `baseURL` already includes `/api`; if it does, strip the `/api` prefix from the route strings.

### Step 3 – API Functions (`src/api/user/index.ts`)

Add the five functions from section 3.3. Remove any legacy student functions if present.

### Step 4 – Hooks (`src/api/user/hooks.ts`)

Add the five hooks from section 3.4. Set `staleTime = 5 * 60 * 1000` on all of them. Confirm `enabled` guards use `!!param && param > 0`.

### Step 5 – Utility (`src/modules/user/teacher/utils/atRisk.ts`)

Create this new file with the full content from section 3.5. No dependencies outside `api/user/types`.

### Step 6 – Sub-components

Create these four files (see section 3.7 for contents):
1. `src/modules/user/teacher/components/CourseAnalyticsCard.tsx`
2. `src/modules/user/teacher/components/AtRiskStudents.tsx`
3. `src/modules/user/teacher/components/CourseStudentsList.tsx`
4. `src/modules/user/teacher/components/UnitAnalyticsBlock.tsx`

Verify the following imports exist in your target project:
- `useNavigate`, `useParams` from `react-router-dom`
- `Avatar`, `Badge`, `Skeleton`, `Select`, `SimpleGrid` from `@chakra-ui/react`
- `UserRoutes` — ensure `UserRoutes.quiz` has `:id` and `:courseId` params

### Step 7 – Teacher Page (`src/modules/user/teacher/index.tsx`)

Replace or rewrite with the content from section 3.6. Key points:
- Import `useTransition` from React.
- Import `useGetCourses` (or equivalent) for the course selector.
- Import the four sub-components above.
- Wrap all `<UserBox>` blocks in `<VStack spacing={6} align="stretch">`.

### Step 8 – StudentsCourse page (`src/components/shared/user/teacher/index.tsx`)

Replace `useGetStudentCourse` with `useTeacherStudentCourses`. Add client-side search/sort.

### Step 9 – Quiz Results page (`src/components/shared/user/quiz/index.tsx`)

Replace legacy quiz hook with `useTeacherStudentCourseQuizResults`.

### Step 10 – Verify Routes

Ensure `UserRoutes` has:
```ts
quiz:          "/teacher/:id/courses/:courseId/quiz",
studentCourse: "/teacher/:id/courses",
teacher:       "/teacher",
```
(Adjust to your actual route structure.)

---

## 7. Risks / Dependencies

| Risk | Details |
|------|---------|
| `accuracy` is 0..1 | If the backend ever changes to 0..100, every threshold comparison and display in `CourseAnalyticsCard`, `atRisk.ts`, and `UnitAnalyticsBlock` must be updated |
| `incorrect_user_ids` are integers | All IDs are coerced with `Number(rawId)`. If they arrive as strings this still works, but if they are UUIDs the map lookup will fail |
| `GET /api/teacher/students` is not paginated in the transformer | The current code fetches page 1 only. If the teacher has > `per_page` students, students on later pages will resolve as `Student #<id>`. Add pagination handling if needed |
| `useShowCourse` in `UnitAnalyticsBlock` | Relies on the course detail endpoint returning `{ modules: [{ units: [] }] }`. If the structure differs, the unit dropdown will be empty |
| Chakra UI v2 | All component APIs (`Avatar`, `Badge`, `SimpleGrid`, `useDisclosure`) target Chakra UI v2. Chakra v3 has breaking API changes |
| `useTransition` | Requires React 18+. On React 17 or earlier, remove `useTransition` and call `setSelectedCourseId` directly |
| `placeholderData: (prev) => prev` | TanStack Query v5 syntax. On TanStack Query v4 use `keepPreviousData: true` instead |
| `UserRoutes.quiz` shape | The "View details" navigation in `AtRiskStudents` uses `.replace(":id", …).replace(":courseId", …)`. If your route uses different param names, update these calls |
| `authStore` / `localStore` | Sidebar and layout components depend on Zustand stores. These are not changed but must exist in the target project |

---

## 8. Final Verification Checklist

After porting, verify each item manually:

### API & Network
- [ ] `GET /api/teacher/courses/{id}/quiz-analytics` returns 200 and `{ data: [ { question_id, accuracy, incorrect_user_ids } ] }`
- [ ] `GET /api/teacher/units/{id}/quiz-analytics` returns same shape
- [ ] `GET /api/teacher/students` returns `{ data: [ { id, name, first_name, last_name, … } ], links, meta }`
- [ ] `GET /api/teacher/students/{userId}/courses` returns `{ data: [ … ] }`
- [ ] `GET /api/teacher/students/{userId}/courses/{courseId}/quiz-results` returns `{ data: [ … ] }`
- [ ] No 404s — double-check `/api` prefix isn't duplicated

### Course Selector
- [ ] Selecting a course in the dropdown is instant (no UI freeze)
- [ ] `isPending` spinner appears briefly then disappears
- [ ] No "Maximum update depth exceeded" in console
- [ ] Network shows exactly one request per endpoint per selection (not looping)

### Course Analytics Card
- [ ] Shows 4 stat tiles when a course is selected and data exists
- [ ] "Average accuracy" value is between 0% and 100% (not 0–1)
- [ ] Progress bar width scales correctly to the accuracy percentage

### Students Who Need Attention
- [ ] No "unknown student" label for students with real IDs in `incorrect_user_ids`
- [ ] Student names show real first+last name (e.g. "School Student"), not "Student #6"
- [ ] No duplicate key warning `.$0` in the console
- [ ] "View details" navigates to the quiz results page for the correct student + course

### Course Students List
- [ ] Shows all teacher students (not filtered by course)
- [ ] Names display as `first_name last_name`, never "Student #undefined"
- [ ] `key={student.id}` — no duplicate key warnings
- [ ] Search filters by name and email

### Unit Analytics Block
- [ ] Unit dropdown populates after selecting a course
- [ ] Selecting a unit fires `GET /api/teacher/units/{id}/quiz-analytics`
- [ ] Switching course resets the selected unit (dropdown returns to placeholder)
- [ ] Student names are resolved from `/api/teacher/students` — no "unknown"

### Student Drill-Down
- [ ] Clicking "View details" on a student row in `CourseStudentsList` opens their course list
- [ ] Clicking a course in that list opens quiz results
- [ ] Back button works on all drill-down levels

### Sidebar (Logo – reverted, no changes active)
- [ ] Expanded sidebar: logo renders as expected (Tailwind `w-[150px] h-[150px]`)
- [ ] Collapsed sidebar: logo may appear small (this was NOT fixed — intentionally reverted)
- [ ] Sidebar toggle animates without layout jumps
- [ ] No broken imports in `src/components/ui/logo/index.tsx`

### Build
- [ ] `tsc --noEmit` passes with zero errors
- [ ] `vite build` (or equivalent) completes without errors
- [ ] No unused-import lint warnings in changed files
