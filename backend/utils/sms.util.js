/**
 * SMS fallback simulation
 * In real deployment:
 * - Android SMS
 * - Twilio
 * - NIC / Govt SMS Gateway
 */

function sendSOSViaSMS(sosEvent) {
  console.log("📲 SMS SENT (SIMULATED)");
  console.log(`Responder: ${sosEvent.responderId}`);
  console.log(`Mission: ${sosEvent.missionId}`);
  console.log(`Location: ${sosEvent.location}`);
}

module.exports = {
  sendSOSViaSMS
};
