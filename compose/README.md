# Generation of docker compose stack

The docker compose stack retrieves public repositories from github, builds, configures and runs them for you,
and is intended to be used as a starting point when onboarding or for non developer users. The instructions
are for a *nix based system but can be modified for other OS.

It currently btms-backend & btms-telemetry-extension, but will also include btms-gateway & btms-gateway-stub.

The intention here is to make it as easy as possible to onboard new users without relying
on too much access etc. People will often then re-configure the services for different purposes or work
on features but that is outside of the scope of this document.

Our github repos are open, so with the appropriate secrets it's possible to run the BTMS in a non prod
way very easily.

The compose config relies on a number of 'secrets' config files being present in the compose folder - these can be obtained from existing
team members:

- btms-frontend/compose/backend-secrets.env
- btms-frontend/compose/backend-local.env
- btms-frontend/compose/frontend-local.env

## Dependencies

The onboarding person will need to ensure a number of tools are present on their system:

- A recent docker runtime - this could be docker desktop for example
- Git
- A code editor
- Firewall access to the SND DMP data lake (configure in Azure portal)

## Existing person

If possible ensure your environment is in a sensible state for cloning - pointing to SND DMP datalake
for example rather than in cached mode etc.

Run the script below to produce a bundle that a new member of staff can use. This includes current copies
of your secrets files so that when they bring up the solution it's a clone of yours.

`./scripts/generate-compose-bundle.sh /tmp/btms`

This will produce a zip file at /tmp/btms.zip which you can give to the onboarding person.

## Onboarding person

Unzip the folder that has been provided to an appropriate folder on your machine where you
want the code to be stored, e.g. ~/src/defra/btms and cd into it within a terminal window.

`cd ~/src/defra/btms`

`./local-setup.sh`

After some time building & configuring the solution, the services should be available to browse
in your web browser of choice :

- [btms-frontend](http://btms-frontend.localtest.me:9081/)
- [btms-backend](http://btms-backend.localtest.me:9080/)
- [grafana](http://grafana.localtest.me:9000/)

Confirm you have access to blob storage (requires firewall config in Azure portal):

`http://btms-backend.localtest.me:9080/diagnostics/blob`

The overall health endpoint may also diagnose other issues:

`http://btms-backend.localtest.me:9080/health-dotnet`

Running the initialise method will load an initial dataset in from DMP:

`http://btms-backend.localtest.me:9080/mgmt/initialise?syncPeriod=All`

The state of the work can be seen here:

`http://btms-backend.localtest.me:9080/sync/jobs`

`http://btms-backend.localtest.me:9080/mgmt/collections`

With logs & metrics:

`http://grafana.localtest.me:9000/a/grafana-lokiexplore-app`

`http://grafana.localtest.me:9000/d/ce451ma3l1nuoc/btms-backend`

And the analytics dashboard here:

`http://localhost:9081/analytics`

