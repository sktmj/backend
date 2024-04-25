import fetch from 'node-fetch';

export const sendSMS = async (MobileNo, OTP) => {
    const sApiKey = "fa526904-5c64-4efc-b6b5-eeb40cbedc0e";
    const sClientId = "1ade59f7-1b0c-4287-b170-bb9c94d3c142";
    const sSID = "NHSKTM";

    const sNumber = MobileNo;
    const sMessage = `Welcome to The KTM Jewellery Ltd. Register Job Application OTP is ${OTP}. Best of luck. Thank You.`;

    const sURL = `https://sms.nettyfish.com/api/v2/SendSMS?ApiKey=${sApiKey}&ClientId=${sClientId}&SenderId=TKTMJL&Message=${encodeURIComponent(sMessage)}&MobileNumbers=${sNumber}`;

    try {
        const response = await fetch(sURL);
        if (!response.ok) {
            throw new Error('Failed to send SMS');
        }
        return 'OTP Sent';
    } catch (error) {
        console.error('Error sending SMS:', error);
        return 'OTP Sent Failure';
    }
};
