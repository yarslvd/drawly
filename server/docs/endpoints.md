![image.png](image.png)

# Endpoints

## AUTH
___
### POST /api/auth/register

```json
{
  "username": "kevandee",           required
  "password": "12345678qqQ",        required
  "email": "achayka95@gmail.com",   required
  "first_name": "Anton",
  "last_name": "Chaika",
  "birthdate": ""
}
```
___
### POST /api/auth/login

```json
{
  "username": "kevandee",           required
  "password": "12345678",           required
  "email": "achayka95@gmail.com",   required
}
```
___
### POST /api/auth/logout

```json
{}
```
___
### POST /api/auth/refresh

```json
{
  "refresh_token": ""     required
}
```
___
### POST /api/auth/password-reset

```json
{
  "email": ""     required
}
```
___
### POST /api/auth/password-reset/:confirm-token

```json
{
  "password": ""  required
}
```
___
### GET /api/auth/email-confirm/:confirm-token
___


## ORGANIZERS
___
### POST /api/organizers/
```json
{
  "name":  "",    required
  "email": ""     required
}
```
___
### GET /api/organizers?limit=5&page=1&name=organizersName
___
### GET /api/organizers/:id
___
### PATCH /api/organizers/:id
```json
{
  "name":  "",    required
  "email": ""     required
}
```
___
### DELETE /api/organizers/:id
___


## EVENTS
___
### POST /api/events/
```json
{
  "title": "event title",         all required
  "description": "description",
  "price": "123",
  "iso_currency": "UAH",
  "address": "address",
  "location": "location",
  "date": "2023-04-12 00:00:00",
  "publish_date": "2023-04-13 00:00:00",
  "organizer_id": "1",
  "ticket_amount": 1000,
  "visability": "public" or "private"
}
```
___
### GET /api/events?limit=5&page=1&organizers=id&date_between[from]=...&date_between[to]=...&price_between[from]=...&price_between[to]=...
___
### GET /api/events/:id

INSERT INTO events (id, poster, title, description, price, iso_currency, address, location, date, publish_date, organizer_id, ticket_amount, visibility) VALUES(1, 'https://images.squarespace-cdn.com/content/v1/5c213a383c3a53bf091b1c36/3f825ca8-72ac-4c5d-b485-035b9ddb5364/h.jpeg', 'Harry Styles', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.', 700, 'USD', 'вулиця Пушкінська, 79/1, Харків, Харківська область, Украина, 61000', 'POINT(-118.4079 33.9434)', '2023-05-19 16:30:00+02', '2023-04-01 16:30:00+02', 1, 600, 'public');

INSERT INTO organizers (id, name, description, email, user_id) VALUES (1, 'Hello bitch', 'asdsd', 'asdsadsad@sddsf.dfd', 1);
___
### PATCH /api/events/
```json
{
  "title": "event title",         all required
  "description": "description",
  "price": "123",
  "iso_currency": "UAH",
  "address": "address",
  "location": "location",
  "date": "2023-04-12 00:00:00",
  "publish_date": "2023-04-13 00:00:00",
  "organizer_id": "1",
  "ticket_amount": 1000,
  "visability": "public" or "private"
}
```
___
### DELETE /api/events/:id
___
### POST /api/events/:id/poster

Upload poster image, form enctype="multipart/form-data", input - <input type="file" name="poster" />

___
## COMMENTS
__
### POST /api/comments/
```json
{
  "event_id": 1,               required
  "comment": "event comment",  required
  "parent_id": 1               for nested comments, id of parent comment, not required
}
```
___
### GET /api/comments?limit=5&page=1&event_id=...
___
### GET /api/comments/:id
___
### PATCH /api/comments/:id
```json
{
  "comment": "new comment" required
}
```
___
### DELETE /api/comments/:id
___

## TICKETS
___
### POST /api/tickets/
```json
{
  "event_id": 2,  required
  "count": 5      required
}
```
___
### GET /api/tickets?event_id=...?user_id=...
___
## PROMOS
___
### POST /api/promos/
```json
{
  "event_id": 1,      all required
  "text": "PROMO",    text is primary key in db
  "discount": 15,
  "valid_till": "2023-04-13 00:00:00"
}
```
___
### POST /api/promos/validate
```json
{
  "event_id": 1,           all required
  "promo_text": "PROMO"    text is primary key in db
}
```
___
### GET /api/promos?event_id=...
___
### GET /api/promos/:text
___
### PATCH /api/promos/:text
```json
{
  "event_id": 1,      all required
  "text": "PROMO",    text is primary key in db
  "discount": 20
}
```
___
### DELETE /api/promos/:text
___
## PAYMENTS
___
### GET /api/payments/:id
___


## FAVOURITES
___
### POST /api/favourites/
```json
{
  "event_id": ""
}
```
___
### DELETE /api/favourites/:event_id
___
### GET /api/favourites?limit=5&page=1
___
### GET /api/favourites/:event_id
___

## SUBSCRIPTIONS
___
### POST /api/subscriptions/
```json
{
  "event_id": ""
}
```
___
### DELETE /api/subscriptions/:organizer_id
___
### GET /api/subscriptionslimit=5&page=1
___
## USERS
___
### GET /api/users/me
___ 
### GET /api/users/tickets
___
### GET /api/users/:id