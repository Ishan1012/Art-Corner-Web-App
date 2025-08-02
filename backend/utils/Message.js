function Message(verificationUrl) {
    return (`
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center">
                    <table width="500" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff; font-family: 'Comic Relief', system-ui; border-radius: 10px; padding: 20px;">
                        <tr>
                            <td align="center">
                                <img src="https://ci3.googleusercontent.com/meips/ADKq_NZve2fiyZ2IkVB8omRw3EwP0eb-ICXS6EBzXO6_ZwePX2VuaanY_QsRuVRqoODv0rO5fL4MLfaQhpirC5mKVK9MYBqQuBEe3Zy7g9Tvpuil5xeGGkj47eLVdfSGdQInik9f=s0-d-e1-ft#https://drive.google.com/uc?export=view&id=1_wVcvPKNA-8GN8L76zjfmM_IiTVQVt1F" alt="" style="width: 300px;">
                                <h1 style="font-size: 1.7rem">Verify You Account</h1>
                                <p style="margin-top: 0; font-size: 1rem; text-align: center;">Thank you for signing up. Please verify your account by clicking the link below:</p>
                                <br><br>
                                <a style="text-decoration: none; color: #fff; background-color: #348dc4; margin-top: 10px; padding: 15px 20px; font-size: 1.3rem; border-radius: 10px;" href="${verificationUrl}" target="_blank">CONFIRM EMAIL</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `);
}

function VerificationPage() {
    return (`
        <div>
            <div style="font-family: 'Comic Relief', system-ui; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 90vh; text-align: center;">
                <img src="https://ci3.googleusercontent.com/meips/ADKq_NZve2fiyZ2IkVB8omRw3EwP0eb-ICXS6EBzXO6_ZwePX2VuaanY_QsRuVRqoODv0rO5fL4MLfaQhpirC5mKVK9MYBqQuBEe3Zy7g9Tvpuil5xeGGkj47eLVdfSGdQInik9f=s0-d-e1-ft#https://drive.google.com/uc?export=view&id=1_wVcvPKNA-8GN8L76zjfmM_IiTVQVt1F" alt="" style="width: 300px;">
                <h1>🎉 Woohoo! Your Email is Verified! 🎉</h1>
                <p>You're all set to dive into the Art Corner Website. Go ahead, log in, and let the fun begin!</p>
            </div>
        </div>
    `);
}

module.exports = { Message, VerificationPage };
