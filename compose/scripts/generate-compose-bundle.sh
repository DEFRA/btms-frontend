#!/bin/bash
rm -rf /tmp/btms
mkdir -p /tmp/btms/config-files/btms-frontend/compose
mkdir -p /tmp/btms/config-files/btms-backend/Properties

echo "Copying btms-frontend compose config"
#cp -r ../btms-frontend/compose/*secrets* /tmp/btms/config-files/btms-frontend
cp ../btms-backend/Btms.Backend/Properties/local.env /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env

echo "Replacing env var : with __ to match env format needed by compose. NB - if we add new sections we need to add them here!"

# Would be nice if this worked
#sed -i -e 's/(:).*=:/__/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env

sed -i -e 's/BlobServiceOptions:/BlobServiceOptions__/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env
sed -i -e 's/BusinessOptions:/BusinessOptions__/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env
sed -i -e 's/ApiOptions:/ApiOptions__/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env
sed -i -e 's/ConsumerOptions:/ConsumerOptions__/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env
sed -i -e 's/ConcurrencyConfiguration:/ConcurrencyConfiguration__/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env
sed -i -e 's/ServiceBusOptions:/ServiceBusOptions__/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env

sed -i -e 's/:BlobPaths/__BlobPath/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env
sed -i -e 's/:BlobItems/__BlobItems/g' /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env

rm  /tmp/btms/config-files/btms-frontend/compose/backend-secrets.env-e

echo "Copying btms-backend service config"
cp ../btms-backend/Btms.Backend/Properties/local.env /tmp/btms/config-files/btms-backend/Properties

echo "Copying support files"
cp compose/scripts/local-setup.sh /tmp/btms/

echo "Zipping things up"

pushd /tmp/btms
zip -r /tmp/btms/btms.zip *
popd

echo "File is ready to pass on from /tmp/btms/btms.zip"
