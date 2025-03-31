const Verify = async (req, resp) => {
    const { otp } = req.body;
    const { id } = req.params;
    console.log("otp :>> ", otp);
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
      return resp.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    if (Date.now() > user?.otpExpire) {
      return resp.status(400).json({
        success: false,
        message: "Otp Expired",
      });
    }
    console.log(user);
    console.log(typeof otp);
    console.log(user.otpHash);
    const isMatch = await bcrypt.compare(otp, user.otpHash);
    if (!isMatch) {
      return resp.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    } else {
      return resp.status(200).json({
        success: true,
        message: "Otp Verified",
      });
    }
  };