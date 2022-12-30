# The official CouchDB Docker image
FROM couchdb:3

# Setup CouchDB to run as a single node
RUN echo '[couchdb]' > /opt/couchdb/etc/local.d/10-single-node.ini
RUN echo 'single_node=true' >> /opt/couchdb/etc/local.d/10-single-node.ini
