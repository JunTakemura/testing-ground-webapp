export async function getRealIps() {
    try {
        const ips = new Set();
        const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

        pc.createDataChannel('');

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Timeout while retrieving real IP'));
            }, 5000);

            pc.onicecandidate = (ice) => {
                if (ice && ice.candidate && ice.candidate.address) {
                    ips.add(ice.candidate.address);
                    const realIp = Array.from(ips)[0];
                    localStorage.setItem('leaked_ip', realIp); // Store IP in local storage
                    clearTimeout(timeout);
                    resolve(realIp);
                }
            };
        });
    } catch (error) {
        console.error('Error in getRealIps:', error);
        return '';
    }
}

// Run IP collection on page load
getRealIps();
