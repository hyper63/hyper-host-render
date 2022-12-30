# hyper on Render

> This is a work in progress

This is a recipe for deploying the hyper Service Framework to [Render](https://render.com)

<!-- toc -->

- [Motivation](#motivation)
- [How's It Work](#hows-it-work)

<!-- tocstop -->

## Motivation

The hyper Service Framework api is built to be a consistent service boundary between your
applications and the services tier that powers them, such that your apps and business logic do not
become coupled or beholden to your services tier. This allows application devs to focus on business
logic, and DevOps devs to focus on infra and network topology, all while discouraging
[vendor lock-in](https://www.cloudflare.com/learning/cloud/what-is-vendor-lock-in/). The hyper
Service Framework itself is built such that it can be deployed to many different
providers/platforms. hyper can even be self hosted on your own infrastructure or cloud.

If you're a small team, or would rather not manage infrastructure or dive into a Cloud Provider, you
might choose to use a PaaS instead. A popular option is [Render](https://render.com) which offers
near-turnkey hosting for containerized applications, as well as some managed service offerings.

## How's It Work

This recipe uses Render's [Infra as Code](https://render.com/docs/infrastructure-as-code) feature.
Using the `render.yaml` file, 6 `docker` services are provisioned:

- [x] The hyper Service, using the RESTful api, so that you may consume your services over Http.
- [ ] CouchDB to power hyper data
- [ ] Redis to power hyper cache
- [ ] Elasticsearch to power hyper search
- [ ] Minio to power hyper storage
- [ ] RabbitMQ to power hyper queue

Where needed a [Render Disk](https://render.com/docs/disks) is mounted on the service, for
Persistent storage.
