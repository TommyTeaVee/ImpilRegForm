module.exports = async (params, next) => {
  // Only act on create/update of registrations
  if (params.model === "Registration" && ["create", "update"].includes(params.action)) {
    const data = params.args.data;
    if (data && data.phone) {
      // Clean input
      let phone = data.phone.toString().replace(/\D/g, "");

      // Convert to +27 format
      if (phone.startsWith("0")) {
        phone = "+27" + phone.substring(1);
      } else if (!phone.startsWith("+27")) {
        phone = "+27" + phone;
      }

      data.phone = phone;
      params.args.data = data;
    }
  }

  // Proceed with next middleware or query
  return next(params);
};
