export let realIp = '';

export async function getRealIps() {
    try {
        const ips = new Set();
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

        pc.createDataChannel('');

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Timeout while retrieving real ip'));
            }, 5000); // timeout duration in milliseconds

            pc.onicecandidate = (ice) => {
                if (ice && ice.candidate && ice.candidate.address) {
                    ips.add(ice.candidate.address);
                    realIp = Array.from(ips)[0]; // Store the first IP found
                    clearTimeout(timeout);
                    resolve(realIp);
                }
            };
        });
    } catch (error) {
        console.error('error in getRealIps:', error);
        return '';
    }
}
