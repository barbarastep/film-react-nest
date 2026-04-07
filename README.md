# FILM!

## Деплой

- Приложение: http://filmproject.nomorepartiessite.ru
- API: http://filmproject.nomorepartiessite.ru/api/afisha/films

## Установка

### PostgreSQL

Установите PostgreSQL и запустите сервер базы данных. Затем создайте
пользователя и базу для проекта, например:

```sql
CREATE ROLE prac WITH LOGIN PASSWORD 'prac';
CREATE DATABASE prac OWNER prac;
```

В каталоге `backend/test` лежат SQL-файлы для подготовки тестовых данных:

- `prac.init.sql` - создаёт таблицы
- `prac.films.sql` - заполняет таблицу фильмами
- `prac.shedules.sql` - заполняет таблицу расписанием сеансов

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД, в нашем случае это `postgres`
* `DATABASE_URL` - адрес PostgreSQL, например `postgres://localhost:5432/prac`
* `DATABASE_USERNAME` - логин пользователя базы данных
* `DATABASE_PASSWORD` - пароль пользователя базы данных

PostgreSQL должен быть установлен и запущен.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.


