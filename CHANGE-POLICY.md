# Sahand Laser Change Policy

## Prime directive
Minimal Change / Maximum Safety.

## Mandatory rules
1. Read PROJECT-MEMORY.md and the relevant data registry before changing site code.
2. Define TASK, GOAL, FILES ALLOWED, FILES PROTECTED, ACCEPTANCE CRITERIA and TEST PLAN.
3. Never guess product specifications, media ownership, 360 frames, drawings or 3D identity.
4. Preserve working navigation, languages, themes, forms, comments, downloads, applications, products and URLs.
5. Do not remove Training or Downloads.
6. Do not move all products to the homepage.
7. Do not replace verified real imagery with placeholders/generated references.
8. Database/schema changes require an explicit migration and rollback plan.
9. Small fixes must not trigger unrelated redesigns or broad rewrites.
10. Every production change passes QA and Reality Check.
11. Important visual changes require before/after evidence.
12. Use small, clear Git commits; avoid unnecessary rebuilds.

## Deployment gate
PLAN -> BUILD -> TEST -> VISUAL CHECK -> REALITY CHECK -> COMMIT -> DEPLOY

Any critical failure blocks deployment.
