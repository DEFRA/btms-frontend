#!/bin/bash

ENDPOINT_URL=http://sqs.eu-west-2.localhost.localstack.cloud:4566

SNS_ARN=arn:aws:sns:eu-west-2:000000000000
SQS_ARN=arn:aws:sqs:eu-west-2:000000000000

export AWS_ENDPOINT_URL=$ENDPOINT_URL
export AWS_REGION=eu-west-2
export AWS_DEFAULT_REGION=eu-west-2
export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local

# S3 buckets
# aws --endpoint-url=$ENDPOINT_URL s3 mb s3://my-bucket

# Debug SNS/SQS topics, queues, subscriptions

CCR=customs_clearance_request.fifo
CFN=customs_finalisation_notification.fifo
CEN=customs_error_notification.fifo
ADN=alvs_decision_notification.fifo
AEN=alvs_error_notification.fifo

# Gateway Test SNS/SQS topics, queues, subscriptions

TADF=alvs_decision_fork.fifo
TADR=alvs_decision_route.fifo
TAEF=alvs_error_fork.fifo
TAER=alvs_error_route.fifo
TCCF=customs_clearance_fork.fifo
TCCR=customs_clearance_route.fifo
TCEF=customs_error_fork.fifo
TCER=customs_error_route.fifo
TCFF=customs_finalisation_fork.fifo
TCFR=customs_finalisation_route.fifo

aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $CCR
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $CFN
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $CEN
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $ADN
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $AEN

aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TADF
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TADR
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TAEF
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TAER
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TCCF
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TCCR
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TCEF
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TCER
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TCFF
aws --endpoint-url=$ENDPOINT_URL sns create-topic --attributes FifoTopic=true --name $TCFR

aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $CCR
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $CFN
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $CEN
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $ADN
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $AEN

aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TADF
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TADR
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TAEF
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TAER
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TCCF
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TCCR
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TCEF
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TCER
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TCFF
aws --endpoint-url=$ENDPOINT_URL sqs create-queue --attributes FifoQueue=true --queue-name $TCFR

aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$CCR --protocol sqs --notification-endpoint $SQS_ARN:$CCR --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$CFN --protocol sqs --notification-endpoint $SQS_ARN:$CFN --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$CEN --protocol sqs --notification-endpoint $SQS_ARN:$CEN --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$ADN --protocol sqs --notification-endpoint $SQS_ARN:$ADN --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$AEN --protocol sqs --notification-endpoint $SQS_ARN:$AEN --attributes '{"RawMessageDelivery": "true"}'

aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TADF --protocol sqs --notification-endpoint $SQS_ARN:$TADF --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TADR --protocol sqs --notification-endpoint $SQS_ARN:$TADR --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TAEF --protocol sqs --notification-endpoint $SQS_ARN:$TAEF --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TAER --protocol sqs --notification-endpoint $SQS_ARN:$TAER --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TCCF --protocol sqs --notification-endpoint $SQS_ARN:$TCCF --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TCCR --protocol sqs --notification-endpoint $SQS_ARN:$TCCR --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TCEF --protocol sqs --notification-endpoint $SQS_ARN:$TCEF --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TCER --protocol sqs --notification-endpoint $SQS_ARN:$TCER --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TCFF --protocol sqs --notification-endpoint $SQS_ARN:$TCFF --attributes '{"RawMessageDelivery": "true"}'
aws --endpoint-url=$ENDPOINT_URL sns subscribe --topic-arn $SNS_ARN:$TCFR --protocol sqs --notification-endpoint $SQS_ARN:$TCFR --attributes '{"RawMessageDelivery": "true"}'
