const serverBaseUrl = 'http://localhost:4747';

function serveManifest(name, platform) {
  var requestString = `${serverBaseUrl}/serve-manifest?name=${name}&platform=${platform}`;
  http.get(requestString);
}

function lastRequestHeaders() {
  var requestString = `${serverBaseUrl}/last-request-headers`;
  const response = http.get(requestString);
  return JSON.parse(response.body);
}

function stopUpdatesServer() {
  http.get(`${serverBaseUrl}/stop-server`);
}

function delay(ms) {
  http.get(`${serverBaseUrl}/delay?ms=${ms}`);
}

output.api = {
  delay: delay,
  lastRequestHeaders: lastRequestHeaders,
  serveManifest: serveManifest,
  stopUpdatesServer: stopUpdatesServer,
};
