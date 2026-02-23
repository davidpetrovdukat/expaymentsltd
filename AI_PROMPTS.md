# 🤖 AI Agent Command Cheat Sheet (Antigravity IDE)

Этот документ содержит идеальные промпты для запуска наших архитектурных процессов. Копируй английский текст из правого столбца и отправляй в чат.

## 🚀 1. Старт нового проекта и сессий
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Инициализация с нуля**<br>*(В пустой папке с нашим шаблоном)* | `Run the project-initialization workflow. We are building [ОПИШИ СУТЬ ПРОЕКТА]. Update PROJECT.md, scaffold Next.js (App Router, Tailwind, TS Strict), and ensure .agent is in .gitignore.` |
| **Старт в новом чате**<br>*(Восстановление контекста)* | `Session Bootstrapping: Read PROJECT.md and .agent/HANDOVER.md. Summarize our current active task, architectural changes, and tell me what we are doing next. Do not write code yet.` |

## ✨ 2. Разработка фичей и UI
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Создать новый компонент**<br>*(Scaffolding + TDD)* | `Use the feature-scaffolder skill to create a component named [ИМЯ_КОМПОНЕНТА] in category [ui ИЛИ features]. Claude: write the failing tests. Gemini: implement the logic to pass them.` |
| **Большая фича (Воркфлоу)**<br>*(Базы данных, API, логика)* | `Trigger the feature-implementation workflow for [ОПИШИ ФИЧУ]. Read PROJECT.md first. Architect (Claude), draft the plan and interfaces. Implementer (Gemini), write the code and run tests.` |
| **Параллельная работа**<br>*(Ускорение через Agent Manager)* | `We need to build [ЗАДАЧА 1] and [ЗАДАЧА 2]. These are independent. Use the Agent Manager to spawn parallel agents. Execute them simultaneously and wait for both to finish before running project-health.` |

## 🐛 3. Багфикс и Рефакторинг
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Починить ошибку/баг**<br>*(Защита от слепого угадывания)* | `Trigger the bugfix-resolution workflow. We have an issue: [ОПИШИ БАГ ИЛИ ВСТАВЬ ОШИБКУ]. Gemini, gather logs. Claude, you MUST write a failing regression test before fixing the logic.` |
| **Рефакторинг кода**<br>*(Улучшение без смены логики)* | `Run the code-review-refactor workflow on [ПУТЬ_К_ФАЙЛУ ИЛИ ПАПКЕ]. Focus on TS strictness, DRY principles, and Next.js best practices. Ensure all tests pass after changes.` |

## 🛠 4. Инструменты, QA и Git
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Проверка здоровья (QA)**<br>*(Перед коммитом)* | `Execute the project-health skill. Run type-checks, linter, and tests. If anything fails, Claude must analyze the logs before Gemini attempts a fix.` |
| **Сохранение в Git**<br>*(Строгие коммиты)* | `Use the git-manager skill to commit the latest changes. The commit message should be: "feat: [ЧТО СДЕЛАЛИ]" (or fix/chore/refactor).` |
| **Создать новый Скилл**<br>*(Обучение ИИ новому)* | `Use the skill-creator meta-skill to build a new tool for [ОПИШИ ЧТО ДОЛЖЕН ДЕЛАТЬ СКИЛЛ]. Ensure it follows the Anthropic SKILL.md standard, has robust error handling, and passes a test.` |

## 🛑 5. Завершение работы (Handover)
| Ситуация / Задача | Идеальный Промпт (Copy & Paste) |
| :--- | :--- |
| **Конец задачи / Смена чата**<br>*(Генерация слепка)* | `We are done with this task. Use the context-handover skill. Claude, dictate the architectural changes to Gemini. Provide me the final HANDOVER.md output so I can move to the next chat.` |

---
> **💡 CTO Tip:** Если агент начинает галлюцинировать или "ходить по кругу", отправь команду `STOP. Re-read AGENTS.md and GEMINI.md core rules. We are violating the Anti-Loop protocol.`