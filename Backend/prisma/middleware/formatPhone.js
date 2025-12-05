function formatPhone(phone) {
  if (!phone) return phone;

  let cleaned = phone.toString().replace(/\D/g, "");

  // Convert to +27 format
  if (cleaned.startsWith("0")) {
    cleaned = "+27" + cleaned.substring(1);
  } else if (!cleaned.startsWith("27") && !cleaned.startsWith("+27")) {
    cleaned = "+27" + cleaned;
  } else if (cleaned.startsWith("27")) {
    cleaned = "+" + cleaned;
  }

  return cleaned;
}

module.exports = { formatPhone };
