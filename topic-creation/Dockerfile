FROM confluentinc/cp-kafka:latest
WORKDIR /bin
CMD kafka-topics --bootstrap-server kafka:9092 --list && kafka-topics --bootstrap-server kafka:9092 --create --if-not-exists --topic events-v2 --replication-factor 1 --partitions 1
    