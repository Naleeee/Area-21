# API

## Table of Contents

- [Introduction](#introduction)
- [Routes](#routes)
  - [Authentication](#authentication)
  - [Dashboard](#dashboard)
  - [OAuth](#oauth)
  - [Services](#services)
  - [Actions](#actions)
  - [Reactions](#reactions)
  - [About](#about)

## Introduction

On this documentation, you can find all the available API routes with their HTTP method.

For more information, go to [http://localhost:8080/api-docs](http://localhost:8080/api-docs]).
Here you can find these routes and their HTTP method, but also the parameters expected for the request.
You can also try the request directly on this page, with the parameters prefilled.

## Routes

### Authentication

| HTTP Method | Route                 |
|:-----------:|:----------------------|
|    POST     | /users/login          |
|    POST     | /users/register       |
|     PUT     | /users/updatePassword |

### Dashboard

| HTTP Method | Route                 |
|:-----------:|:----------------------|
|     GET     | /dashboard            |
|    POST     | /dashboard            |
|     GET     | /dashboard/:id        |
|     PUT     | /dashboard/:id        |
|   DELETE    | /dashboard/:id        |
|     GET     | /dashboard/userid/:id |

### OAuth

| HTTP Method | Route                  |
|:-----------:|:-----------------------|
|     GET     | /oauth                 |
|    POST     | /oauth                 |
|     GET     | /oauth/:id             |
|     PUT     | /oauth/:id             |
|   DELETE    | /oauth/:id             |
|    POST     | /oauth/google          |
|    POST     | /oauth/spotify         |
|     GET     | /oauth/spotify/logout  |
|    POST     | /oauth/facebook        |
|     GET     | /oauth/facebook/logout |
|    POST     | /oauth/github          |
|     GET     | /oauth/github/logout   |
|    POST     | /oauth/todoist         |
|     GET     | /oauth/todoist/logout  |
|    POST     | /oauth/isConnected     |

### Services

| HTTP Method | Route         |
|:-----------:|:--------------|
|     GET     | /services     |
|     GET     | /services/:id |
|    POST     | /services     |
|     PUT     | /services/:id |
|   DELETE    | /services/:id |

### Actions

| HTTP Method | Route                  |
|:-----------:|:-----------------------|
|     GET     | /actions               |
|    POST     | /actions               |
|     GET     | /actions/:id           |
|     PUT     | /actions/:id           |
|   DELETE    | /actions/:id           |
|     GET     | /actions/serviceId/:id |

### Reactions

| HTTP Method | Route                    |
|:-----------:|:-------------------------|
|     GET     | /reactions               |
|    POST     | /reactions               |
|     GET     | /reactions/:id           |
|     PUT     | /reactions/:id           |
|   DELETE    | /reactions/:id           |
|     GET     | /reactions/serviceId/:id |

### About

| HTTP Method | Route       |
|:-----------:|:------------|
|     GET     | /about.json |
