# 🤖 AI Agent Command Cheat Sheet (Cursor)

Этот документ содержит идеальные промпты для запуска наших архитектурных процессов. Копируй английский текст из правого столбца и отправляй в чат.

## 🚀 1. Старт нового проекта и сессий
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Инициализация с нуля**<br>*(В пустой папке с нашим шаблоном)* | `Run the project-initialization workflow. We are building [ОПИШИ СУТЬ ПРОЕКТА]. Update PROJECT.md, scaffold Next.js (App Router, Tailwind, TS Strict), and ensure .agent is in .gitignore.` |
| **Старт в новом чате**<br>*(Восстановление контекста)* | `Session Bootstrapping: Read PROJECT.md, INSTRUCTIONS.md, and .agent/HANDOVER.md. Summarize our current active task, architectural changes, and tell me what we are doing next. Do not write code yet.` |

## ✨ 2. Разработка фичей и UI
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Создать новый компонент**<br>*(Scaffolding + TDD)* | `Use the feature-scaffolder skill to create a component named [ИМЯ_КОМПОНЕНТА] in category [ui ИЛИ features]. Claude: write the failing tests. Gemini: implement the logic to pass them.` |
| **Большая фича (Воркфлоу)**<br>*(Базы данных, API, логика)* | `Trigger the feature-implementation workflow for [ОПИШИ ФИЧУ]. Read PROJECT.md first. Architect (Claude), draft the plan and interfaces. Implementer (Gemini), write the code and run tests.` |
| **Параллельная работа**<br>*(Независимые задачи)* | `We need to build [ЗАДАЧА 1] and [ЗАДАЧА 2]. These are independent. Plan and implement in order or in parallel as appropriate. Run quality gates (type-check, lint, test, build) and update .agent/HANDOVER.md when done.` |

## 🐛 3. Багфикс и Рефакторинг
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Починить ошибку/баг**<br>*(Защита от слепого угадывания)* | `Trigger the bugfix-resolution workflow. We have an issue: [ОПИШИ БАГ ИЛИ ВСТАВЬ ОШИБКУ]. Gemini, gather logs. Claude, you MUST write a failing regression test before fixing the logic.` |
| **Рефакторинг кода**<br>*(Улучшение без смены логики)* | `Run the code-review-refactor workflow on [ПУТЬ_К_ФАЙЛУ ИЛИ ПАПКЕ]. Focus on TS strictness, DRY principles, and Next.js best practices. Ensure all tests pass after changes.` |

## 🛠 4. Инструменты, QA и Git
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Проверка здоровья (QA)**<br>*(Перед коммитом)* | `Run quality gates: npm run type-check && npm run lint && npm test && npm run build. If anything fails, fix and re-run. Update .agent/HANDOVER.md with the snapshot.` |
| **Сохранение в Git**<br>*(Строгие коммиты)* | `Commit the latest changes with Conventional Commits: "feat: [ЧТО СДЕЛАЛИ]" (or fix/chore/refactor). Ensure .agent/HANDOVER.md is updated.` |
| **Создать новый Скилл**<br>*(Обучение ИИ новому)* | `Create a new Cursor rule or skill for [ОПИШИ ЧТО ДОЛЖЕН ДЕЛАТЬ]. Ensure it follows project conventions and has clear scope.` |

## 🛑 5. Завершение работы (Handover)
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Конец задачи / Смена чата**<br>*(Генерация слепка)* | `We are done with this task. Append a snapshot to .agent/HANDOVER.md: Goal achieved, Files changed, Evidence / quality gate results, Next action.` |

---
> **💡 CTO Tip:** Project rules live in `.cursor/rules/*.mdc` and `INSTRUCTIONS.md`. For persistence bugs use the debug protocol: Network → DB → UI hydration. Always run quality gates and update HANDOVER before handoff.